import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";

const [inputDirectory, oldProject] = process.argv.slice(2);
if (!inputDirectory || !oldProject) {
  throw new Error("Usage: node scripts/import-news.mjs <WordPress JSON directory> <previous project directory>");
}

const root = process.cwd();
const outputDirectory = path.join(root, "public", "vesti");
const oldImagesDirectory = path.join(oldProject, "images", "news");
const pageFiles = (await readdir(inputDirectory))
  .filter((name) => /^news-wp-page-\d+\.json$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
if (pageFiles.some((file, index) => Number(file.match(/\d+/)[0]) !== index + 1)) {
  throw new Error("WordPress post pages must be numbered consecutively from 1.");
}
const pages = await Promise.all(pageFiles.map(async (file) =>
  JSON.parse((await readFile(path.join(inputDirectory, file), "utf8")).replace(/^\uFEFF/, ""))));
const posts = pages.flat();
if (!posts.length || new Set(posts.map((post) => post.id)).size !== posts.length) {
  throw new Error(`Unexpected post count or duplicate IDs: ${posts.length}`);
}
const titleOverrides = JSON.parse(await readFile(path.join(root, "src", "data", "news-title-overrides.json"), "utf8"));
const categories = JSON.parse(await readFile(path.join(root, "src", "data", "news-categories.json"), "utf8"));
const validCategories = new Set(["obavestenja", "nastava-i-ispiti", "takmicenja-i-uspesi", "projekti-i-saradnja", "humanitarne-akcije", "skolski-zivot"]);
for (const post of posts) {
  if (!validCategories.has(categories[post.id])) throw new Error(`Missing or invalid category for post ${post.id}`);
}
for (const [id, title] of Object.entries(titleOverrides)) {
  if (!posts.some((post) => String(post.id) === id) || typeof title !== "string" || !title.trim()) {
    throw new Error(`Invalid news title override for post ${id}`);
  }
}
const featured = JSON.parse((await readFile(path.join(inputDirectory, "news-wp-featured.json"), "utf8")).replace(/^\uFEFF/, ""));
const attachments = JSON.parse(await readFile(path.join(root, "src", "data", "news-attachments.json"), "utf8"));
const schedules = JSON.parse(await readFile(path.join(root, "src", "data", "exam-schedules.json"), "utf8"));
const academic = JSON.parse(await readFile(path.join(root, "src", "data", "academic-content.json"), "utf8"));
const canonicalUrl = (value) => {
  const url = new URL(value);
  return `${url.hostname.replace(/^www\./, "")}${url.pathname}${url.search}`;
};
const attachmentUrls = new Map([
  ...attachments.entries.flatMap((entry) => entry.links.map((link) =>
    [canonicalUrl(link.url), `/${link.path.replace(/^public[\\/]/, "").replaceAll("\\", "/")}`])),
  ...schedules.map((entry) => [canonicalUrl(entry.link.url), entry.link.path]),
  ...academic.assets.filter((asset) => asset.status === "available" && asset.localPath)
    .map((asset) => [canonicalUrl(asset.originalUrl), asset.localPath]),
]);
const articleUrls = new Map(posts.map((post) => [post.link.replace(/\/$/, ""), `/vesti/objava-${post.id}`]));
const localVideos = new Map([
  ["/wp-content/uploads/2022/11/166844675245075.mp4", "/vesti/video/izlet-2022.mp4"],
  ["/wp-content/uploads/2020/05/Dan-škole-2020..mp4", "/vesti/video/dan-skole-2020.mp4"],
  ["/wp-content/uploads/2017/11/video-8acd440eeca16e80f98ff5ab1181c428-V.mp4", "/vesti/video/dobrovoljno-davanje-krvi-2017.mp4"],
]);
for (const local of localVideos.values()) {
  const file = path.join(root, "public", ...local.slice(1).split("/"));
  if (!(await stat(file)).isFile()) throw new Error(`Missing local news video: ${file}`);
}
const isSchoolHost = (url) => ["medicinskapancevo.edu.rs", "www.medicinskapancevo.edu.rs"].includes(url.hostname);
const localVideo = (url) => isSchoolHost(url) ? localVideos.get(decodeURIComponent(url.pathname)) : undefined;
const oldImages = new Map((await readdir(oldImagesDirectory)).map((file) => [path.parse(file).name, file]));
const erasmus = JSON.parse(await readFile(path.join(root, "src", "data", "erasmus-stories.json"), "utf8"));
const erasmusImages = erasmus.sections.flatMap((section) => [
  ...section.images,
  ...section.childGroups.flatMap((group) => group.images),
]);
const images = new Map();
const unavailable = [];
const recovered = [];
const unavailableLinks = [];
const digest = (text) => createHash("sha256").update(text).digest("hex");

await mkdir(outputDirectory, { recursive: true });

async function localImage(source, postId) {
  if (!source) return null;
  const raw = source.trim();
  if (images.has(raw)) return images.get(raw);
  let url;
  try {
    url = new URL(raw, "https://medicinskapancevo.edu.rs");
  } catch {
    unavailable.push({ postId, source: raw, reason: "invalid URL" });
    images.set(raw, null);
    return null;
  }
  const hashes = [digest(raw), digest(url.href)];
  const existing = hashes.map((hash) => oldImages.get(hash)).find(Boolean);
  if (!existing) {
    const filename = path.basename(url.pathname);
    const originalName = /^(.*?)(?:-\d+)?-(\d+)x(\d+)\.(jpe?g|png)$/i.exec(filename);
    if (originalName) {
      const matches = erasmusImages.filter((image) => {
        const candidate = /^(.*?)(?:-\d+)?-(\d+)x(\d+)\.(jpe?g|png)$/i.exec(image.name);
        const normalize = (name) => name.replace(/-V1$/i, "-V").toLowerCase();
        return candidate && normalize(candidate[1]) === normalize(originalName[1]) &&
          Math.abs(Number(candidate[2]) - Number(originalName[2])) <= 1 &&
          Math.abs(Number(candidate[3]) - Number(originalName[3])) <= 1 &&
          candidate[4].toLowerCase() === originalName[4].toLowerCase();
      });
      if (matches.length === 1) {
        recovered.push({ postId, source: raw, local: matches[0].src });
        images.set(raw, matches[0].src);
        return matches[0].src;
      }
    }
  }
  let name = existing;
  if (existing) {
    const sourceFile = path.join(oldImagesDirectory, existing);
    const destination = path.join(outputDirectory, existing);
    try {
      await copyFile(sourceFile, destination, 1);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const [original, copied] = await Promise.all([readFile(sourceFile), readFile(destination)]);
      if (!original.equals(copied)) throw new Error(`Existing image differs: ${destination}`);
    }
  } else {
    const extension = path.extname(url.pathname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension) ||
        !["medicinskapancevo.edu.rs", "www.medicinskapancevo.edu.rs"].includes(url.hostname)) {
      unavailable.push({ postId, source: raw, reason: "unsupported image source" });
      images.set(raw, null);
      return null;
    }
    name = `${digest(raw)}${extension}`;
    const destination = path.join(outputDirectory, name);
    try {
      await stat(destination);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      const secureUrl = new URL(url.href);
      secureUrl.protocol = "https:";
      try {
        execFileSync("curl.exe", ["--fail", "--silent", "--show-error", "--location", "--max-time", "25", "--output", destination, secureUrl.href], { stdio: "pipe" });
      } catch (downloadError) {
        await rm(destination, { force: true });
        unavailable.push({ postId, source: raw, reason: String(downloadError.message) });
        images.set(raw, null);
        return null;
      }
    }
  }
  const result = `/vesti/${name}`;
  images.set(raw, result);
  return result;
}

const cleanOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption", "iframe", "video", "audio", "source", "del", "s", "u"],
  allowedAttributes: {
    "*": ["class"],
    a: ["href", "title", "download", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading"],
    video: ["src", "controls", "width", "height", "poster"],
    audio: ["src", "controls"],
    source: ["src", "type"],
    ol: ["start"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"],
};

const results = [];
for (const post of posts) {
  const $ = cheerio.load(post.content.rendered, null, false);
  // The original article marks its entire opening paragraph as a heading.
  if (post.id === 2563) {
    $("h4").each((_, element) => $(element).replaceWith($("<p>").append($(element).contents())));
  }
  const pictureSources = [];
  for (const element of $("img").toArray()) {
    const image = $(element);
    const source = image.attr("src");
    const local = await localImage(source, post.id);
    if (local) {
      image.attr("src", local).attr("loading", "lazy");
      pictureSources.push({ src: local, alt: image.attr("alt") || "" });
    } else {
      image.replaceWith('<span class="news-missing-image">Фотографија није доступна у архиви.</span>');
    }
  }
  $("source").removeAttr("srcset");
  $("img").removeAttr("srcset sizes");
  $("a[href]").each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr("href");
    if (!href || href.startsWith("#")) return;
    try {
      const url = new URL(href, post.link);
      const local = localVideo(url) || attachmentUrls.get(canonicalUrl(url.href)) || articleUrls.get(url.href.replace(/\/$/, ""));
      if (local) {
        anchor.attr("href", local);
        if (anchor.text().trim() === href) anchor.text(localVideo(url) ? "Преузми видео" : "Отвори прилог");
      } else if (isSchoolHost(url)) {
        const image = anchor.find("img").first().attr("src");
        if (image?.startsWith("/")) {
          anchor.attr("href", image);
        } else {
          unavailableLinks.push({ postId: post.id, source: href });
          anchor.removeAttr("href");
          if (anchor.text().trim() === href) anchor.text("Прилог није доступан.");
          else anchor.append(" (прилог није доступан)");
        }
      }
    } catch {
      throw new Error(`Invalid news link in post ${post.id}: ${href}`);
    }
  });
  $("[src]").not("img").each((_, element) => {
    const media = $(element);
    const source = media.attr("src");
    if (!source) return;
    const url = new URL(source, post.link);
    if (!isSchoolHost(url)) return;
    const local = localVideo(url) || attachmentUrls.get(canonicalUrl(url.href));
    if (local) {
      media.attr("src", local);
    } else {
      unavailableLinks.push({ postId: post.id, source });
      const container = media.is("source") ? media.parent("video, audio") : media;
      (container.length ? container : media).replaceWith('<span class="news-missing-image">Видео или прилог није доступан у архиви.</span>');
    }
  });
  let cover = pictureSources[0] || null;
  if (post.featured_media) {
    const media = featured.find((item) => item.id === post.featured_media);
    if (!media?.source_url) throw new Error(`Missing featured media ${post.featured_media} for post ${post.id}`);
    const local = await localImage(media.source_url, post.id);
    if (local) cover = { src: local, alt: media.alt_text || "" };
  }
  const plain = (value) => cheerio.load(value || "", null, false).text().replace(/\s+/g, " ").trim();
  results.push({
    id: post.id,
    title: titleOverrides[post.id] ?? plain(post.title.rendered),
    excerpt: plain(post.excerpt.rendered),
    date: post.date,
    source: post.link,
    image: cover,
    content: sanitizeHtml($.html(), cleanOptions),
  });
}

results.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
await writeFile(path.join(root, "src", "data", "news.json"), JSON.stringify(results, null, 2), "utf8");
await writeFile(path.join(inputDirectory, "news-import-report.json"), JSON.stringify({
  posts: results.length,
  uniqueImages: images.size,
  availableImages: [...images.values()].filter(Boolean).length,
  recovered,
  unavailable,
  unavailableLinks,
}, null, 2), "utf8");
console.log(`Imported ${results.length} posts, ${images.size} unique image sources; ${unavailable.length} unavailable.`);
if (unavailable.length) console.log(`See ${path.join(inputDirectory, "news-import-report.json")}`);
if (unavailableLinks.length) console.log(`${unavailableLinks.length} unavailable links or media; see the import report.`);
