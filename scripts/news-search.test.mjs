import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { archivePageHref, filterArchiveNews } from "../src/lib/news-search.ts";
import { isNewsCategory } from "../src/lib/news-categories.ts";

const entries = [
  { title: "Ђаци у Панчеву", excerpt: "Посета школи", date: "2024-05-10", href: "/vesti/1", image: null, category: "skolski-zivot" },
  { title: "Takmičenje učenika", excerpt: "U Novom Sadu", date: "2023-05-09", href: "/vesti/2", image: null, category: "takmicenja-i-uspesi" },
  { title: "Успех ученика", excerpt: "Такмичење", date: "2022-10-12", href: "/vesti/3", image: null, category: "takmicenja-i-uspesi" },
  { title: "Обавештење", excerpt: "", date: null, href: "/vesti/4", image: null, category: "obavestenja" },
];
const defaults = { query: "", year: "", month: "", category: "", order: "newest" };

test("searches title and excerpt across scripts, case and accents", () => {
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, query: "DJACI pancevu" }).map((entry) => entry.href), ["/vesti/1"]);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, query: "такмичење" }).map((entry) => entry.href), ["/vesti/2", "/vesti/3"]);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, query: "novom učenika" }).map((entry) => entry.href), ["/vesti/2"]);
});

test("combines date filters and sorts undated items last", () => {
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, month: "05" }).map((entry) => entry.href), ["/vesti/1", "/vesti/2"]);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, year: "2023", month: "05" }).map((entry) => entry.href), ["/vesti/2"]);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, year: "2023", month: "10" }), []);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, category: "takmicenja-i-uspesi", month: "05" }).map((entry) => entry.href), ["/vesti/2"]);
  assert.deepEqual(filterArchiveNews(entries, { ...defaults, order: "oldest" }).map((entry) => entry.href), ["/vesti/3", "/vesti/2", "/vesti/1", "/vesti/4"]);
});

test("pagination preserves filters and omits the first page number", () => {
  const filters = { query: "школа", year: "2023", month: "05", category: "skolski-zivot", order: "oldest" };
  const page = new URL(archivePageHref(filters, 2), "http://localhost");
  assert.deepEqual(Object.fromEntries(page.searchParams), { q: "школа", godina: "2023", mesec: "05", kategorija: "skolski-zivot", redosled: "najstarije", strana: "2" });
  assert.equal(new URL(archivePageHref(filters, 1), "http://localhost").searchParams.has("strana"), false);
  assert.equal(archivePageHref(defaults, 1), "/vesti");
});

test("each archived article has a valid category", () => {
  const articles = JSON.parse(readFileSync(new URL("../src/data/news.json", import.meta.url), "utf8"));
  const categories = JSON.parse(readFileSync(new URL("../src/data/news-categories.json", import.meta.url), "utf8"));
  const ids = articles.map((article) => String(article.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(categories).sort(), ids.sort());
  assert.ok(Object.values(categories).every(isNewsCategory));
  assert.equal(categories["5855"], "projekti-i-saradnja");
  assert.equal(categories["6608"], "humanitarne-akcije");
});
