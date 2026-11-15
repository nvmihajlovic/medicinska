import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load as parseHtml } from "cheerio";
import ts from "typescript";

const require = createRequire(import.meta.url);

function load(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => Object.prototype.hasOwnProperty.call(modules, id) ? modules[id] : require(id) });
  return testModule.exports;
}

const translations = load("../src/lib/legal-text.ts");
const localization = load("../src/lib/localization.ts");
const languageSize = load("../src/components/language-size.tsx");
const commonModules = {
  "next/link": ({ children, ...props }) => React.createElement("a", props, children),
  "@/components/school-pages": { PageHeading: ({ title }) => React.createElement("h1", null, title) },
  "@/components/site-chrome": { SiteHeader: () => null, SiteFooter: () => null },
  "@/components/cookie-consent": { CookieSettingsButton: () => React.createElement("button", { type: "button", className: "cookie-settings-link" }, "Settings") },
  "@/components/language-size": languageSize,
  "@/lib/localization": localization,
  "@/lib/legal-text": translations,
  "@/lib/school-contact": { schoolEmail: "school@example.test" },
  "./legal-pages.css": {},
};
const legalPages = load("../src/components/legal-pages.tsx", commonModules);
const { TranslatedLegalPage } = load("../src/components/translated-legal-page.tsx", {
  ...commonModules,
  "@/components/legal-pages": legalPages,
});

test("translated legal pages keep draft notices, navigation and settings controls", () => {
  for (const locale of ["en", "de"]) {
    for (const [page, slug] of [["terms", "uslovi-koriscenja"], ["privacy", "privatnost"], ["cookies", "kolacici"]]) {
      const $ = parseHtml(renderToStaticMarkup(React.createElement(TranslatedLegalPage, { locale, page })));
      assert.equal($("main h1").text(), translations.legalText[locale].pages[page].title);
      assert.ok($(".legal-content__notice").text().includes(translations.legalText[locale].notice));
      assert.equal($(`aside a[href="/${locale}/${slug}"][aria-current="page"]`).length, 1);
      assert.equal($("article:not([aria-hidden]) button").length, page === "terms" ? 0 : 1);
      if (page === "privacy") assert.equal($('a[href="mailto:school@example.test"]').length, 1);
      if (page === "terms") assert.equal($(`article a[href="/${locale}/kontakt"]`).length, 1);
      if (page === "cookies") {
        for (const cookie of ["school-cookie-preferences", "school-language", "school-news-visitor"]) assert.ok($("article").text().includes(cookie));
        assert.ok($("article").text().includes("180"));
      }
    }
  }
});

test("legal sizing variants have no active links or buttons", () => {
  for (const locale of ["sr", "en", "de"]) {
    for (const page of ["terms", "privacy", "cookies"]) {
      const $ = parseHtml(renderToStaticMarkup(React.createElement(legalPages.LegalLayout, { locale, page })));
      assert.equal($(`article:not([aria-hidden])[lang="${locale}"]`).length, 1);
      assert.equal($('article[aria-hidden="true"]').length, 2);
      assert.equal($('article[aria-hidden="true"] a[href], article[aria-hidden="true"] button:not([disabled])').length, 0);
      assert.equal($("article:not([aria-hidden]) button:not([disabled])").length, page === "terms" ? 0 : 1);
    }
  }
});
