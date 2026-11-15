import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import * as cheerio from "cheerio";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const staff = JSON.parse(readFileSync(new URL("../src/data/staff.json", import.meta.url), "utf8"));

function load(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => Object.prototype.hasOwnProperty.call(modules, id) ? modules[id] : require(id) });
  return testModule.exports;
}

const translations = load("../src/lib/staff-text.ts");
const localization = load("../src/lib/localization.ts");
const information = load("../src/lib/information-text.ts");
const contact = load("../src/lib/contact-text.ts");
const documents = load("../src/lib/document-text.ts");
const programs = load("../src/lib/program-text.ts");
const exams = load("../src/lib/exam-text.ts");
const languageSize = load("../src/components/language-size.tsx");
const contactLabel = load("../src/components/contact-label.tsx", { "@/components/language-size": languageSize, "@/lib/contact-text": contact });

function staffComponent(data) {
  return load("../src/components/school-pages.tsx", {
    "next/image": () => null,
    "next/link": ({ children, ...props }) => React.createElement("a", props, children),
    "@/data/staff.json": data,
    "@/components/document-list": {},
    "@/components/contact": {},
    "@/components/contact-label": contactLabel,
    "@/components/language-size": languageSize,
    "@/lib/academic": { documentGroups: [{ path: "/dokumentacija/", links: [{ title: "Приручник-за-родитеље" }] }], documentPath: () => "/handbook" },
    "@/lib/localization": localization,
    "@/lib/contact-text": contact,
    "@/lib/information-text": information,
    "@/lib/staff-text": translations,
    "@/lib/document-text": documents,
    "@/lib/school-contact": {},
    "@/lib/program-text": programs,
    "@/lib/exam-text": exams,
    "./school-pages.css": {},
  }).Staff;
}

test("staff names and every published role are present in both translations", () => {
  const Staff = staffComponent(staff);
  for (const locale of ["en", "de"]) {
    const html = renderToStaticMarkup(React.createElement(Staff, { locale }));
    for (const entries of Object.values(staff.groups)) {
      for (const entry of entries) {
        assert.ok(translations.staffRoles[entry.role]?.[locale], `Missing ${locale} translation for ${entry.role}`);
        assert.ok(html.includes(entry.name));
        assert.ok(html.includes(translations.staffRoles[entry.role][locale].replaceAll("&", "&amp;").replaceAll("'", "&#x27;")));
      }
    }
    assert.ok(!html.includes(translations.staffText[locale].untranslated));
  }
});

test("an unknown role remains visible in Serbian with an explicit notice", () => {
  const data = structuredClone(staff);
  data.groups.uprava.push({ name: "Тест Особа", role: "Нова улога" });
  const Staff = staffComponent(data);
  const html = renderToStaticMarkup(React.createElement(Staff, { locale: "en" }));
  assert.ok(html.includes(translations.staffText.en.untranslated));
  const $ = cheerio.load(html);
  assert.equal($(".staff-entry").filter((_, entry) => $(entry).text().includes("Тест Особа")).find('span[lang="sr-Cyrl"] .language-size-stack > span:not([aria-hidden])').text(), "Нова улога");
});
