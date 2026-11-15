import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToString } from "react-dom/server";
import ts from "typescript";
import { consentValue, parseConsent } from "../src/lib/cookie-consent.ts";
import { consentNewsHtml } from "../src/lib/consent-news-html.ts";
import { isSameOrigin } from "../src/lib/request-origin.ts";
import { cookieText, localeFromPath } from "../src/lib/localization.ts";

test("language detection respects whole path segments", () => {
  for (const [path, locale] of [["/", "sr"], ["/o-skoli", "sr"], ["/en", "en"], ["/en/o-skoli", "en"], ["/de", "de"], ["/de/o-skoli", "de"], ["/english", "sr"], ["/deutsch", "sr"]]) {
    assert.equal(localeFromPath(path), locale);
  }
});

test("the server does not render the consent panel before the saved choice is known", async () => {
  const source = await readFile(new URL("../src/components/cookie-consent.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const realRequire = createRequire(import.meta.url);
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: testModule,
    exports: testModule.exports,
    require: (id) => {
      if (id === "./cookie-consent.css") return {};
      if (id === "@/lib/cookie-consent") return { consentCookie: "school-cookie-preferences", consentValue, parseConsent };
      if (id === "@/lib/localization") return { cookieText, localeFromPath };
      if (id === "next/navigation") return { usePathname: () => "/" };
      return realRequire(id);
    },
  });
  assert.equal(renderToString(React.createElement(testModule.exports.CookieConsent)), "");
});

test("consent values require a valid version and independent choices", () => {
  for (const analytics of [false, true]) {
    for (const video of [false, true]) {
      assert.deepEqual(parseConsent(consentValue(analytics, video)), { analytics, video });
    }
  }
  for (const value of [undefined, "", "v1-1", "v2-1-1", "v1-1-2", "v1-1-1-extra"]) {
    assert.equal(parseConsent(value), null);
  }
});

test("same-origin requests work on the accessed host and foreign origins are rejected", () => {
  const request = (origin) => ({
    headers: new Headers({ host: "127.0.0.1:3000", ...(origin ? { origin } : {}) }),
    nextUrl: new URL("http://localhost:3000/api/cookie-consent"),
  });
  assert.equal(isSameOrigin(request("http://127.0.0.1:3000")), true);
  assert.equal(isSameOrigin(request("http://example.com")), false);
  assert.equal(isSameOrigin(request("https://127.0.0.1:3000")), false);
});

test("all archived video embeds become inert placeholders without changing images", async () => {
  const news = JSON.parse(await readFile(new URL("../src/data/news.json", import.meta.url), "utf8"));
  let count = 0;
  for (const article of news) {
    const original = article.content;
    const output = consentNewsHtml(original);
    const embeds = (original.match(/<iframe\b/gi) ?? []).length;
    count += embeds;
    assert.equal((output.match(/data-video-url=/g) ?? []).length, embeds, article.slug);
    assert.doesNotMatch(output, /<iframe\b/i, article.slug);
    assert.equal((output.match(/<img\b/gi) ?? []).length, (original.match(/<img\b/gi) ?? []).length, article.slug);
  }
  assert.ok(count > 0);
});

test("unsupported or malformed video sources cannot become embeds", () => {
  const html = consentNewsHtml('<iframe src="https://example.com/embed/1"></iframe><iframe src="javascript:alert(1)"></iframe><iframe src="https://youtube.com@evil.example/embed/dQw4w9WgXcQ"></iframe>');
  assert.doesNotMatch(html, /data-video-url|<iframe/i);
  assert.match(html, /Видео-снимак није доступан/);
});
