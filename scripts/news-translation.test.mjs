import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { load } from "cheerio";
import { consentNewsHtml, sizedConsentNewsHtml } from "../src/lib/consent-news-html.ts";
import { newsTranslation } from "../src/lib/news-translations.ts";

const articles = JSON.parse(readFileSync(new URL("../src/data/news.json", import.meta.url), "utf8"));

test("translated articles preserve original downloads and images", () => {
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  for (const article of latest) {
    const { id } = article;
    const original = load(consentNewsHtml(article.content));
    for (const locale of ["en", "de"]) {
      const translation = newsTranslation(article, locale);
      assert.ok(translation, `Missing ${locale} translation for ${id}`);
      const translated = load(consentNewsHtml(article.content, locale, translation.texts));
      for (const selector of ["a[href]", "img[src]"]) {
        const attribute = selector.startsWith("a") ? "href" : "src";
        const values = ($) => $(selector).map((_, element) => $(element).attr(attribute)).get();
        assert.deepEqual(values(translated), values(original), `${locale} ${id} ${selector}`);
      }
      const videos = ($) => $("button[data-video-url]").map((_, element) => $(element).attr("data-video-url")).get();
      assert.deepEqual(videos(translated), videos(original), `${locale} ${id} video`);
      const lastText = translation.texts.filter((text) => text !== null).at(-1);
      if (lastText) assert.ok(translated("body").text().includes(lastText));
      if (id === 6652) {
        const cells = ($) => $("td").map((_, element) => $(element).text()).get();
        const originalCells = cells(original);
        const translatedCells = cells(translated);
        assert.equal(translatedCells.length, originalCells.length);
        for (let index = 0; index < originalCells.length; index++) {
          if (originalCells[index] !== "Име" && originalCells[index] !== "Презиме") assert.equal(translatedCells[index], originalCells[index]);
        }
      }
    }
  }
});

test("changed or untranslated articles are not presented as translated", () => {
  const article = articles.find((item) => item.id === 6824);
  assert.equal(newsTranslation({ ...article, content: `${article.content}changed` }, "en"), null);
  assert.equal(newsTranslation({ ...article, title: `${article.title}changed` }, "de"), null);
  assert.equal(newsTranslation({ ...article, id: -1 }, "en"), null);
  assert.equal(newsTranslation(undefined, "de"), null);
});

test("partial translations do not silently omit content", () => {
  const article = articles.find((item) => item.id === 6824);
  assert.throws(() => consentNewsHtml(article.content, "en", ["I1"]), /Недостаје превод/);
  assert.throws(() => consentNewsHtml(article.content, "en", [...newsTranslation(article, "en").texts, "extra"]), /Број преведених/);
});

test("sizing translated paragraphs preserves content and does not duplicate media or links", () => {
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  let sizedParagraphs = 0;
  for (const article of latest) {
    const en = newsTranslation(article, "en");
    const de = newsTranslation(article, "de");
    for (const locale of ["sr", "en", "de"]) {
      const expected = load(consentNewsHtml(article.content, locale, locale === "sr" ? undefined : { en, de }[locale].texts));
      const actual = load(sizedConsentNewsHtml(article.content, locale, { en: en.texts, de: de.texts }));
      sizedParagraphs += actual(".news-language-text").length;
      assert.equal(actual('.news-language-text [aria-hidden="true"] a[href], .news-language-text [aria-hidden="true"] img, .news-language-text [aria-hidden="true"] button').length, 0);
      actual('.news-language-text [aria-hidden="true"]').remove();
      assert.equal(actual("body").text(), expected("body").text());
      for (const selector of ["a[href]", "img[src]", "video", "audio", "button[data-video-url]"]) {
        assert.deepEqual(actual(selector).map((_, element) => actual.html(element)).get(), expected(selector).map((_, element) => expected.html(element)).get());
      }
    }
  }
  assert.ok(sizedParagraphs > 0);
});

test("sizing keeps inline links active only in the selected language and skips media", () => {
  const html = '<p>Text <strong>long</strong> <a href="/file">download</a><br>next</p><p><img src="/images/photo.png" alt=""></p>';
  const en = ["Text", "longer", "download", "next"];
  const de = ["Text", "länger", "herunterladen", "weiter"];
  const $ = load(sizedConsentNewsHtml(html, "en", { en, de }));
  assert.equal($(".news-language-text").length, 1);
  assert.equal($('.news-language-text span:not([aria-hidden]) a[href="/file"]').length, 1);
  assert.equal($('.news-language-text [aria-hidden="true"] a[href]').length, 0);
  assert.equal($("img").length, 1);
});
