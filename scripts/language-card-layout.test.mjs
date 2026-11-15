import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as cheerio from "cheerio";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";

function loadComponent(path, modules) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const componentModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: componentModule,
    exports: componentModule.exports,
    require(id) {
      if (id === "react/jsx-runtime") return jsxRuntime;
      if (id === "next/link") return { __esModule: true, default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children) };
      if (id === "next/image") return { __esModule: true, default: () => React.createElement("img", { alt: "" }) };
      if (id in modules) return modules[id];
      throw new Error(`Unknown module: ${id}`);
    },
    Intl,
    Date,
  });
  return componentModule.exports;
}

test("programme cards reserve space for all languages but expose only the selected text", () => {
  const { HomeProgramCard } = loadComponent("../src/components/home-program-card.tsx", {
    "@/lib/exam-text": { examPrograms: { nursing: { en: "Nurse", de: "Pflegefachkraft" } } },
  });
  const program = { id: "nursing", number: "01", title: "Медицинска сестра", description: "Опис", image: "/image.jpg", alt: "Image" };
  for (const locale of ["sr", "en", "de"]) {
    const $ = cheerio.load(renderToStaticMarkup(React.createElement(HomeProgramCard, { locale, program })));
    const variants = $(".program-card__content");
    assert.equal(variants.length, 3);
    assert.equal(variants.filter('[aria-hidden="true"]').length, 2);
    assert.equal(variants.not('[aria-hidden="true"]').find("strong").text(), { sr: "Медицинска сестра", en: "Nurse", de: "Pflegefachkraft" }[locale]);
    assert.equal(variants.filter('[aria-hidden="true"]').find("a, button").length, 0);
  }
});

test("homepage news cards size for translations and retain the Serbian fallback", () => {
  const article = { id: 1 };
  const { NewsCard } = loadComponent("../src/components/news-list.tsx", {
    "@/lib/news": { importedArticle: () => article, newsDate: () => "1. 1. 2026." },
    "@/lib/news-categories": { newsCategories: [{ id: "obavestenja" }], newsCategoryLabel: () => "Обавештења" },
    "@/lib/news-illustration": { newsIllustration: () => "/image.jpg" },
    "@/lib/news-translations": { newsTranslation: (source, locale) => source && locale === "en" ? { title: "Translated title", excerpt: "Translated excerpt" } : null },
  });
  const item = { href: "/vesti/objava-1", title: "Оригинални наслов", excerpt: "Оригинални текст", category: "obavestenja", image: null, date: null, views: 10 };
  for (const locale of ["sr", "en", "de"]) {
    const $ = cheerio.load(renderToStaticMarkup(React.createElement(NewsCard, { item, locale, matchLanguages: true })));
    const variants = $(".school-news-card__body");
    assert.equal(variants.length, 3);
    assert.equal(variants.filter('[aria-hidden="true"]').length, 2);
    assert.equal(variants.not('[aria-hidden="true"]').find("h3").text(), locale === "en" ? "Translated title" : item.title);
    assert.equal(variants.filter('[aria-hidden="true"]').find("a, button").length, 0);
  }
  const $ = cheerio.load(renderToStaticMarkup(React.createElement(NewsCard, { item })));
  assert.equal($(".school-news-card__body").length, 1);
});
