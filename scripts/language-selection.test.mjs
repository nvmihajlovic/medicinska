import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/api/language/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

class MockResponse {
  constructor(body, options) {
    this.body = body;
    this.status = options.status;
    this.headers = new Headers();
    this.cookies = { set: (...args) => { this.cookie = args; } };
  }
  static redirect(url) {
    const response = new MockResponse(null, { status: 307 });
    response.headers.set("location", url.toString());
    return response;
  }
}

const modules = {
  "next/server": { NextResponse: MockResponse },
  "@/lib/localization": { languageCookie: "school-language" },
};
const testModule = { exports: {} };
vm.runInNewContext(compiled, { module: testModule, exports: testModule.exports, require: (id) => modules[id], URL });

function request(locale, next) {
  const url = new URL("https://school.example/api/language");
  if (locale !== null) url.searchParams.set("locale", locale);
  if (next !== null) url.searchParams.set("next", next);
  return { url: url.toString(), nextUrl: url };
}

test("language selection stores the choice and redirects to a local destination", () => {
  for (const locale of ["sr", "en", "de"]) {
    const response = testModule.exports.GET(request(locale, "/kontakt"));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://school.example/kontakt");
    assert.equal(response.cookie[0], "school-language");
    assert.equal(response.cookie[1], locale);
    assert.equal(response.cookie[2].path, "/");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("language selection rejects invalid locales and external destinations", () => {
  for (const [locale, next] of [["fr", "/"], [null, "/"], ["en", null], ["en", "//evil.example"], ["en", "/\\evil.example"], ["en", "https://evil.example"]]) {
    assert.equal(testModule.exports.GET(request(locale, next)).status, 400);
  }
});

test("attachment archive redirects English and German selections but remains available in Serbian", async () => {
  const source = readFileSync(new URL("../src/app/dokumentacija/arhiva/page.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const require = createRequire(import.meta.url);
  let locale = "sr";
  const modules = {
    "next/link": () => null,
    "next/navigation": { redirect: (path) => { throw new Error(`redirect:${path}`); } },
    "@/components/school-pages": { PageHeading: () => null },
    "@/components/site-chrome": { SiteHeader: () => null, SiteFooter: () => null },
    "@/data/news-attachments.json": { entries: [] },
    "@/lib/academic": { documentFormat: () => "" },
    "@/lib/language-preference": { preferredLanguage: async () => locale },
    "../../academic.css": {},
  };
  const archive = { exports: {} };
  vm.runInNewContext(compiled, { module: archive, exports: archive.exports, require: (id) => Object.prototype.hasOwnProperty.call(modules, id) ? modules[id] : require(id) });
  assert.ok(await archive.exports.default());
  for (locale of ["en", "de"]) {
    await assert.rejects(archive.exports.default(), { message: `redirect:/${locale}/dokumentacija` });
  }
});

test("language preference proxy ignores prefetched pages", () => {
  const source = readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const modules = {
    "@supabase/ssr": {},
    "next/server": {},
    "@/lib/supabase/config": {},
    "@/lib/localization": {},
  };
  const proxy = { exports: {} };
  vm.runInNewContext(compiled, { module: proxy, exports: proxy.exports, require: (id) => modules[id] });
  const { unstable_doesMiddlewareMatch } = createRequire(import.meta.url)("next/experimental/testing/server");
  const matches = (url, headers = {}) => unstable_doesMiddlewareMatch({ config: proxy.exports.config, nextConfig: {}, url, headers });
  for (const locale of ["en", "de"]) {
    assert.equal(matches(`/${locale}/kontakt`), true);
    assert.equal(matches(`/${locale}/kontakt`, { "next-router-prefetch": "1" }), false);
    assert.equal(matches(`/${locale}/kontakt`, { purpose: "prefetch" }), false);
  }
  assert.equal(matches("/admin", { "next-router-prefetch": "1" }), true);
});
