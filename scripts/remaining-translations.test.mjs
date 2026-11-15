import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => Object.prototype.hasOwnProperty.call(modules, id) ? modules[id] : require(id), Date, Intl });
  return testModule.exports;
}
const json = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const academic = json("../src/data/academic-content.json");
const { examContent, examDocumentTitles, examPrograms, examScheduleNotes, examScheduleTitles } = load("../src/lib/exam-text.ts");
const { examScheduleEntries } = load("../src/lib/exam-schedules.ts", { "@/data/exam-schedules.json": json("../src/data/exam-schedules.json") });
const { healthObservances } = load("../src/lib/health-calendar.ts");
const { healthEntries } = load("../src/lib/health-text.ts");
const { erasmusText } = load("../src/lib/erasmus-text.ts");
const stories = json("../src/data/erasmus-stories.json");

test("published exam content, downloads and schedules have both translations", () => {
  for (const locale of ["en", "de"]) {
    for (const exam of academic.exams) {
      assert.ok(examPrograms[exam.slug]?.[locale], `Missing ${locale} programme ${exam.slug}`);
      for (const block of exam.contents) {
        const values = block.type === "paragraph" ? [block.text] : block.items.map((item) => item.text);
        for (const value of values) assert.ok(examContent[value]?.[locale], `Missing ${locale} exam text: ${value}`);
      }
      for (const link of exam.links) assert.ok(examDocumentTitles[link.title]?.[locale], `Missing ${locale} document: ${link.title}`);
    }
    for (const group of academic.documents.filter((item) => item.path.startsWith("/ucenici/ispitna-pitanja/"))) {
      for (const link of group.links) {
        const title = link.title.replace(/^(?:I|II|III|IV)\s+RAZRED\s*[-–—]?\s*/i, "");
        assert.ok(examDocumentTitles[title]?.[locale], `Missing ${locale} exam question: ${title}`);
      }
    }
    for (const entry of examScheduleEntries) {
      assert.ok(examScheduleTitles[entry.title]?.[locale], `Missing ${locale} schedule: ${entry.title}`);
      if (entry.note) assert.ok(examScheduleNotes[entry.note]?.[locale], `Missing ${locale} schedule note`);
    }
  }
});

test("every health observance selected throughout the year has both translations", () => {
  for (const year of [2024, 2026]) {
    for (let timestamp = Date.UTC(year, 0, 1); timestamp < Date.UTC(year + 1, 0, 1); timestamp += 86_400_000) {
      const date = new Date(timestamp).toISOString().slice(0, 10);
      const calendar = healthObservances(date);
      for (const item of [...calendar.daily, ...calendar.weekly, ...calendar.monthly]) {
        for (const locale of ["en", "de"]) {
          assert.ok(healthEntries[item.title]?.[locale]?.every(Boolean), `Missing ${locale} health entry: ${item.title}`);
        }
      }
    }
  }
});

test("every Erasmus story with source text has a translation", () => {
  const mapping = {
    "Obilazak Lajpciga": "lajpcig",
    "Naši učenici u prvoj radnoj nedelji": "prva-nedelja",
    "Prvi vikend u Lajpcigu i Drezdenu": "prvi-vikend",
    "U radnom ambijentu": "radni-ambijent",
    "Prvi maj u Berlinu": "berlin",
    "Podela sertifikata": "sertifikati",
    "Prezentacija projekta i evaluacija": "evaluacija",
    "Promo za kraj": "promocija",
  };
  for (const locale of ["en", "de"]) {
    assert.ok(erasmusText[locale].intro.length > 0);
    for (const section of stories.sections.filter((item) => item.name !== "Erazmus uvod" && item.documents.length)) {
      assert.ok(mapping[section.name], `Missing story mapping: ${section.name}`);
      const paragraphs = erasmusText[locale].paragraphs[mapping[section.name]];
      assert.ok(paragraphs?.length && paragraphs.every(Boolean), `Missing ${locale} story: ${section.name}`);
    }
  }
});
