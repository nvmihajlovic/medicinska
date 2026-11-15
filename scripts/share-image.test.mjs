import assert from "node:assert/strict";
import test from "node:test";
import { defaultShareImage, shareImage } from "../src/lib/share-image.ts";

test("uses supported article images and falls back for missing or non-image media", () => {
  for (const path of ["/photo.jpg", "/photo.JPEG", "/photo.png?version=1", "/photo.webp#image", "/photo.gif"]) {
    assert.deepEqual(shareImage(path, "Article"), { url: path, alt: "Article" });
  }
  for (const path of [null, undefined, "", "/document.pdf", "/document.pdf?image=photo.jpg"]) {
    assert.deepEqual(shareImage(path, "Article"), defaultShareImage);
  }
});

test("uses SITE_URL, then Netlify URL, then the default site URL", async () => {
  const previousSiteUrl = process.env.SITE_URL;
  const previousUrl = process.env.URL;
  try {
    process.env.SITE_URL = "https://school.example";
    process.env.URL = "https://netlify.example";
    assert.equal((await import("../src/lib/share-image.ts?site")).metadataBase.origin, "https://school.example");
    delete process.env.SITE_URL;
    assert.equal((await import("../src/lib/share-image.ts?netlify")).metadataBase.origin, "https://netlify.example");
    delete process.env.URL;
    assert.equal((await import("../src/lib/share-image.ts?default")).metadataBase.origin, "https://medicinska-2.netlify.app");
    process.env.SITE_URL = "ftp://school.example";
    await assert.rejects(import("../src/lib/share-image.ts?invalid"), /HTTP или HTTPS/);
  } finally {
    if (previousSiteUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previousSiteUrl;
    if (previousUrl === undefined) delete process.env.URL;
    else process.env.URL = previousUrl;
  }
});
