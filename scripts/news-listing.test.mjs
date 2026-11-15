import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

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
