import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);

function load(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => id in modules ? modules[id] : require(id) });
  return testModule.exports;
}

const { informationText } = load("../src/lib/information-text.ts");
const { InformationPage, getInformationPage } = load("../src/components/information-page.tsx", {
  "next/link": { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) },
  "next/navigation": { notFound: () => { throw new Error("not found"); } },
  "@/components/school-pages": { PageHeading: ({ title }) => React.createElement("h1", null, title) },
  "@/lib/information-text": { informationText },
  "@/app/academic.css": {},
});

test("information schedules retain their data and localized return links", () => {
  for (const [locale, title] of [["sr", "Распоред звоњења"], ["en", "Bell schedule"], ["de", "Klingelzeiten"]]) {
    const html = renderToStaticMarkup(React.createElement(InformationPage, { stranica: "raspored-zvonjenja", locale }));
    assert.match(html, new RegExp(title));
    assert.match(html, /07:15–08:00/);
    assert.match(html, /18:35–19:15/);
    assert.match(html, /2017/);
    assert.ok(html.includes(`href="${locale === "sr" ? "" : `/${locale}`}/ucenici-i-roditelji"`));
  }
});

test("teacher duty schedules preserve names and original document in translated pages", () => {
  for (const locale of ["en", "de"]) {
    const html = renderToStaticMarkup(React.createElement(InformationPage, { stranica: "dezurstva-nastavnika", locale }));
    assert.match(html, /Рашовић Клара/);
    assert.match(html, /lang="sr-Cyrl"/);
    assert.match(html, /raspored-dezurstava-2026\.jpg/);
  }
});

test("unknown information pages cannot resolve inherited object properties", () => {
  assert.equal(getInformationPage("toString", "en"), undefined);
  assert.equal(getInformationPage("missing", "de"), undefined);
  assert.throws(() => renderToStaticMarkup(React.createElement(InformationPage, { stranica: "missing", locale: "en" })), /not found/);
});
