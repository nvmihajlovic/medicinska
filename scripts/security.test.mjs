import assert from "node:assert/strict";
import test from "node:test";
import { hasMediaSignature } from "../src/lib/media-signature.ts";
import { readLimitedBody } from "../src/lib/request-body.ts";
import { youtubeEmbedUrl } from "../src/lib/youtube-url.ts";
import { consentNewsHtml } from "../src/lib/consent-news-html.ts";

test("archived images use responsive optimized URLs and remain lazy-loaded", () => {
  const html = consentNewsHtml('<img src="/vesti/photo.jpg" alt="Фото" width="800" height="600">');
  assert.match(html, /src="\/_next\/image\?url=%2Fvesti%2Fphoto\.jpg&amp;w=1080&amp;q=75"/);
  assert.match(html, /srcset="[^"]+640w[^"]+1920w"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /alt="Фото"/);
  const external = consentNewsHtml('<img src="https://example.com/photo.jpg" srcset="https://other.example/photo.jpg 640w">');
  assert.match(external, /src="https:\/\/example\.com\/photo\.jpg"/);
  assert.doesNotMatch(external, /_next\/image/);
  assert.doesNotMatch(external, /srcset=/);
});

test("video URLs allow only HTTPS YouTube embed addresses", () => {
  for (const host of ["youtube.com", "www.youtube.com", "www.youtube-nocookie.com"]) {
    const url = `https://${host}/embed/dQw4w9WgXcQ?start=10`;
    assert.equal(youtubeEmbedUrl(url), url);
  }
  for (const url of [
    "javascript:alert(1)",
    "https://example.com/embed/dQw4w9WgXcQ",
    "https://youtube.com.example.com/embed/dQw4w9WgXcQ",
    "https://youtube.com@evil.example/embed/dQw4w9WgXcQ",
    "https://user@youtube.com/embed/dQw4w9WgXcQ",
    "https://youtube.com:444/embed/dQw4w9WgXcQ",
    "http://youtube.com/embed/dQw4w9WgXcQ",
    "https://youtube.com/redirect?url=https://evil.example",
    "https://youtube.com/embed/short",
  ]) assert.equal(youtubeEmbedUrl(url), null, url);
});

test("request bodies are bounded by bytes and stop reading on overflow", async () => {
  let cancelled = false;
  const chunks = [new TextEncoder().encode("ab"), new TextEncoder().encode("cd")];
  const stream = new ReadableStream({
    pull(controller) {
      if (chunks.length) controller.enqueue(chunks.shift());
      else controller.close();
    },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  const request = new Request("https://example.com", { method: "POST", body: stream, duplex: "half" });
  assert.equal(await readLimitedBody(request, 3), null);
  assert.equal(cancelled, true);
  const valid = new Request("https://example.com", { method: "POST", body: "аб" });
  assert.equal(await readLimitedBody(valid, 4), "аб");
  const tooLarge = new Request("https://example.com", { method: "POST", body: "аб" });
  assert.equal(await readLimitedBody(tooLarge, 3), null);
  const invalid = new Request("https://example.com", { method: "POST", body: new Uint8Array([0xff]) });
  await assert.rejects(readLimitedBody(invalid, 10), TypeError);
});

test("media signatures must match the declared format", () => {
  const signatures = {
    "image/jpeg": [0xff, 0xd8, 0xff],
    "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    "image/webp": [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
    "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d],
  };
  for (const [type, bytes] of Object.entries(signatures)) {
    assert.equal(hasMediaSignature(type, new Uint8Array(bytes)), true, type);
    assert.equal(hasMediaSignature(type, new Uint8Array(bytes.slice(0, -1))), false, type);
    assert.equal(hasMediaSignature(type, new TextEncoder().encode("<script>alert(1)</script>")), false, type);
  }
  assert.equal(hasMediaSignature("text/html", new Uint8Array(signatures["image/png"])), false);
});
