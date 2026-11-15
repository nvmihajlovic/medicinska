import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { formatNewsCount } from "../src/lib/news-counts.ts";

const source = readFileSync(new URL("../src/lib/news.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
const archive = [
  { id: 1, title: "Archive 1", excerpt: "", date: "2025-12-15", image: null },
  { id: 2, title: "Archive 2", excerpt: "", date: "2024-01-01", image: null },
];
const rows = Array.from({ length: 60 }, (_, index) => ({
  id: `id-${index}`, slug: `news-${index}`, title: `News ${index}`, excerpt: "", media_path: null,
  published_at: index === 59 ? null : new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
  category: "obavestenja",
}));

function setup({ configured = true, failure = false, records = rows } = {}) {
  const calls = { limit: null, order: null };
  const query = {
    select() { return this; },
    eq() { return this; },
    order(column, options) { calls.order = { column, ...options }; return this; },
    limit(value) { calls.limit = value; return this; },
    then(resolve, reject) {
      const sorted = [...records].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
      return Promise.resolve({ data: calls.limit === null ? sorted : sorted.slice(0, calls.limit), error: failure ? new Error("database down") : null }).then(resolve, reject);
    },
  };
  const modules = {
    "next/server": { connection: async () => {} },
    "@/data/news.json": archive,
    "@/data/news-categories.json": { 1: "obavestenja", 2: "obavestenja" },
    "@/lib/news-categories": { isNewsCategory: (value) => value === "obavestenja" },
    "@/lib/supabase/config": { getSupabaseConfig: () => configured ? {} : null },
    "@/lib/supabase/server": {
      createClient: async () => ({
        from: () => query,
        storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
      }),
    },
  };
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => modules[id], Date, Intl });
  return { getNews: testModule.exports.getNews, homeLimit: testModule.exports.HOME_NEWS_LIMIT, calls };
}

test("recent news limits the database query without changing the merged top 30", async () => {
  const full = setup();
  const expected = (await full.getNews()).slice(0, 30).map((entry) => entry.href);
  const limited = setup();
  const actual = (await limited.getNews(30)).map((entry) => entry.href);
  assert.deepEqual(Array.from(actual), Array.from(expected));
  assert.equal(limited.calls.limit, 30);
  assert.equal(limited.calls.order.column, "published_at");
  assert.equal(limited.calls.order.nullsFirst, false);
  assert.equal(full.calls.limit, null);
});

test("recent news works without a database and reports database errors", async () => {
  const offline = setup({ configured: false });
  assert.equal((await offline.getNews(1))[0].href, "/vesti/objava-1");
  assert.equal((await offline.getNews(1)).length, 1);
  assert.equal(offline.calls.limit, null);
  await assert.rejects(setup({ failure: true }).getNews(30), /Вести нису могле/);
});

test("publishing a newer story moves the oldest homepage story into the archive", async () => {
  const before = setup();
  const previous = await before.getNews(before.homeLimit);
  const newStory = {
    id: "new-id", slug: "new-story", title: "New story", excerpt: "", media_path: null,
    published_at: "2030-01-01T00:00:00Z", category: "obavestenja",
  };
  const after = setup({ records: [...rows, newStory] });
  const recent = await after.getNews(after.homeLimit);
  const archiveEntries = (await setup({ records: [...rows, newStory] }).getNews()).slice(after.homeLimit);

  assert.equal(recent.length, before.homeLimit);
  assert.equal(recent[0].href, "/vesti/new-story");
  assert.equal(archiveEntries[0].href, previous[previous.length - 1].href);
  assert.ok(!recent.some((entry) => entry.href === archiveEntries[0].href));
});

test("listing counts include likes, default missing rows to zero, and retain unavailable counts on errors", async () => {
  const source = readFileSync(new URL("../src/lib/news-engagement.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const entries = [
    { engagementKey: "archive-1", views: null, likes: null },
    { engagementKey: "entry-2", views: null, likes: null },
  ];

  async function loadCounts(result, configured = true) {
    let columns;
    const client = { from: () => ({ select(value) { columns = value; return this; }, in: async () => result }) };
    const modules = {
      "@supabase/supabase-js": { createClient: () => client },
      "@/lib/supabase/config": { getSupabaseConfig: () => configured ? { url: "https://example.test" } : null },
      "@/lib/news": {},
    };
    const testModule = { exports: {} };
    vm.runInNewContext(compiled, {
      module: testModule, exports: testModule.exports, require: (id) => modules[id],
      process: { env: { SUPABASE_SERVICE_ROLE_KEY: "test-key" } }, console: { error() {} },
    });
    const output = await testModule.exports.withNewsViews(entries);
    return { output, columns };
  }

  const { output, columns } = await loadCounts({ data: [{ news_key: "archive-1", views: 7, likes: 3 }], error: null });
  assert.equal(columns, "news_key, views, likes");
  assert.equal(output[0].views, 7);
  assert.equal(output[0].likes, 3);
  assert.equal(output[1].views, 0);
  assert.equal(output[1].likes, 0);
  assert.equal((await loadCounts({ data: null, error: new Error("offline") })).output[0].likes, null);
  assert.equal((await loadCounts(null, false)).output[0].likes, null);
});

test("news previews display likes and report unavailable counts without inventing zero", () => {
  const source = readFileSync(new URL("../src/components/news-list.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const realRequire = createRequire(import.meta.url);
  const modules = {
    "next/link": { __esModule: true, default: ({ children }) => children },
    "next/image": { __esModule: true, default: () => null },
    "@/lib/news": { importedArticle: () => undefined, newsDate: () => "" },
    "@/lib/news-categories": { newsCategories: [], newsCategoryLabel: () => "Вести" },
    "@/lib/news-illustration": { newsIllustration: () => "" },
    "@/lib/news-translations": { newsTranslation: () => null },
    "@/lib/news-counts": { formatNewsCount },
  };
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => modules[id] ?? realRequire(id), Intl });
  const item = { title: "Вест", excerpt: "", date: null, href: "/vesti/objava-1", image: null, category: "obavestenja", engagementKey: "archive-1", views: 7, likes: 3 };
  const render = (values) => renderToStaticMarkup(React.createElement(testModule.exports.NewsCard, { item: { ...item, ...values } }));
  assert.match(render({}), /3 лајка/);
  assert.match(render({ views: 1, likes: 1 }), /1 преглед/);
  assert.match(render({ views: 2, likes: 2 }), /2 лајка/);
  assert.match(render({ likes: 0 }), /0 лајкова/);
  assert.match(render({ likes: null }), /Лајкови нису доступни/);
});

test("view and like counts use the correct Serbian forms including teen and compound numbers", () => {
  for (const [count, view, like] of [
    [0, "прегледа", "лајкова"], [1, "преглед", "лајк"], [2, "прегледа", "лајка"],
    [4, "прегледа", "лајка"], [5, "прегледа", "лајкова"], [11, "прегледа", "лајкова"],
    [12, "прегледа", "лајкова"], [14, "прегледа", "лајкова"], [21, "преглед", "лајк"],
    [22, "прегледа", "лајка"], [111, "прегледа", "лајкова"], [121, "преглед", "лајк"],
  ]) {
    assert.equal(formatNewsCount(count, "views", "sr"), `${count.toLocaleString("sr-RS")} ${view}`);
    assert.equal(formatNewsCount(count, "likes", "sr"), `${count.toLocaleString("sr-RS")} ${like}`);
  }
  assert.equal(formatNewsCount(1, "views", "en"), "1 view");
  assert.equal(formatNewsCount(2, "likes", "en"), "2 likes");
  assert.equal(formatNewsCount(1, "views", "de"), "1 Aufruf");
  assert.equal(formatNewsCount(2, "views", "de"), "2 Aufrufe");
});
