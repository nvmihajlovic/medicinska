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
const data = JSON.parse(readFileSync(new URL("../src/data/academic-content.json", import.meta.url), "utf8"));
const staff = JSON.parse(readFileSync(new URL("../src/data/staff.json", import.meta.url), "utf8"));

function load(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => Object.prototype.hasOwnProperty.call(modules, id) ? modules[id] : require(id), URL });
  return testModule.exports;
}

const academic = load("../src/lib/academic.ts", { "@/data/academic-content.json": data });
const translations = load("../src/lib/document-text.ts");
const localization = load("../src/lib/localization.ts");
const information = load("../src/lib/information-text.ts");
const contact = load("../src/lib/contact-text.ts");
const staffText = load("../src/lib/staff-text.ts");
const programs = load("../src/lib/program-text.ts");
const exams = load("../src/lib/exam-text.ts");
const languageSize = load("../src/components/language-size.tsx");
const contactLabel = load("../src/components/contact-label.tsx", { "@/components/language-size": languageSize, "@/lib/contact-text": contact });
const { DocumentList } = load("../src/components/document-list.tsx", { "@/lib/academic": academic, "@/lib/document-text": translations, "@/components/language-size": languageSize });

function documentsComponent(groups) {
  return load("../src/components/school-pages.tsx", {
    "next/image": () => null,
    "next/link": ({ children, ...props }) => React.createElement("a", props, children),
    "@/data/staff.json": staff,
    "@/components/document-list": { DocumentList },
    "@/components/contact": {},
    "@/components/contact-label": contactLabel,
    "@/components/language-size": languageSize,
    "@/lib/academic": { ...academic, generalDocumentGroups: groups },
    "@/lib/localization": localization,
    "@/lib/contact-text": contact,
    "@/lib/information-text": information,
    "@/lib/staff-text": staffText,
    "@/lib/document-text": translations,
    "@/lib/school-contact": {},
    "@/lib/program-text": programs,
    "@/lib/exam-text": exams,
    "./school-pages.css": {},
  }).Documents;
}

test("translated document directory preserves all original downloads and labels their language", () => {
  const Documents = documentsComponent(academic.generalDocumentGroups);
  const render = (locale) => parseHtml(renderToStaticMarkup(React.createElement(Documents, { locale })));
  const original = render("sr");
  const paths = original(".document-list__item").map((_, item) => original(item).attr("href")).get();
  for (const locale of ["en", "de"]) {
    const $ = render(locale);
    const links = $(".document-list__item").map((_, item) => $(item).attr("href")).get();
    assert.deepEqual(links.filter((path) => !path.startsWith("/dokumenti-prevodi/")), paths);
    const translatedPaths = links.filter((path) => path.startsWith("/dokumenti-prevodi/"));
    assert.equal(translatedPaths.length, 2);
    for (const path of translatedPaths) {
      const content = readFileSync(new URL(`../public${path}`, import.meta.url), "utf8");
      assert.ok(content.includes(locale === "en" ? "UNOFFICIAL TRANSLATION" : "UNVERBINDLICHE ÜBERSETZUNG"));
    }
    assert.ok($("aside").text().includes(translations.documentText[locale].language));
    for (const group of academic.generalDocumentGroups) {
      assert.ok(translations.documentGroupsText[group.id]?.[locale], `Missing ${locale} group ${group.id}`);
      for (const document of group.links) {
        assert.ok(translations.documentTitles[document.title]?.[locale], `Missing ${locale} document ${document.title}`);
      }
    }
    assert.equal($(".document-list__item > span[lang=sr]").length, 0);
    assert.ok($(".source-note .language-size-stack > span:not([aria-hidden])").toArray().every((entry) => !$(entry).text().includes(translations.documentText[locale].untranslated)));
  }
});

test("new untranslated document titles remain visible with a notice", () => {
  const groups = structuredClone(academic.generalDocumentGroups);
  groups[0].links[0].title = "Нови документ";
  const Documents = documentsComponent(groups);
  const $ = parseHtml(renderToStaticMarkup(React.createElement(Documents, { locale: "en" })));
  assert.ok($.text().includes(translations.documentText.en.untranslated));
  assert.equal($(".document-list__item > span[lang=sr] .language-size-stack > span:not([aria-hidden])").first().text(), "Нови документ");
});

test("attachment archive is linked only for a Serbian language selection", () => {
  const Documents = documentsComponent(academic.generalDocumentGroups);
  for (const [locale, showArchive, expected] of [["sr", true, 1], ["sr", false, 0], ["en", true, 0], ["de", true, 0]]) {
    const $ = parseHtml(renderToStaticMarkup(React.createElement(Documents, { locale, showArchive })));
    assert.equal($('a[href="/dokumentacija/arhiva"]').length, expected);
    if (!expected) assert.equal($('.source-note--archive-hidden[aria-hidden="true"] a[href]').length, 0);
  }
});
