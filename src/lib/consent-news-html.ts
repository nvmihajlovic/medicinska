import sanitizeHtml from "sanitize-html";
import { youtubeEmbedUrl } from "./youtube-url.ts";
import type { Locale } from "./localization";

export function consentNewsHtml(html: string, locale: Locale = "sr", translatedTexts?: (string | null)[]) {
  let textIndex = 0;
  const result = sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption", "video", "audio", "source", "del", "s", "u", "button"],
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "title", "download", "rel"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
      button: ["type", "data-video-url", "data-video-title", "class"],
      video: ["src", "controls", "width", "height", "poster"],
      audio: ["src", "controls"],
      source: ["src", "type"],
      ol: ["start"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    textFilter: translatedTexts ? (text) => {
      if (!text.trim()) return text;
      const translated = translatedTexts[textIndex++];
      if (translated === undefined) throw new Error("Недостаје превод текста вести.");
      if (translated === null) return text;
      return translated.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } : undefined,
    transformTags: {
      img: (_tagName, attributes): sanitizeHtml.Tag => {
        const src = attributes.src ?? "";
        const attribs: Record<string, string> = { ...attributes, loading: "lazy", decoding: "async" };
        delete attribs.srcset;
        delete attribs.sizes;
        if (/^\/(?:vesti|erasmus|erasmus-sadrzaj|images)\/[^?#]+\.(?:jpe?g|png|webp|img)$/i.test(src)) {
          const url = encodeURIComponent(src);
          const imageUrl = (width: number) => `/_next/image?url=${url}&w=${width}&q=75`;
          return {
            tagName: "img",
            attribs: {
              ...attribs,
              src: imageUrl(1080),
              srcset: [640, 750, 1080, 1920].map((width) => `${imageUrl(width)} ${width}w`).join(", "),
              sizes: "(max-width: 800px) 90vw, 65vw",
            },
          };
        }
        return { tagName: "img", attribs };
      },
      iframe: (_tagName, attributes): sanitizeHtml.Tag => {
        const url = youtubeEmbedUrl(attributes.src ?? "");
        if (!url) {
          return { tagName: "span", text: locale === "en" ? "The video is unavailable." : locale === "de" ? "Das Video ist nicht verfügbar." : "Видео-снимак није доступан.", attribs: {} };
        }
        return {
          tagName: "button",
          text: locale === "en" ? "Open cookie settings to view the YouTube video." : locale === "de" ? "Öffnen Sie die Cookie-Einstellungen, um das YouTube-Video anzusehen." : "За приказ YouTube снимка отворите подешавања колачића.",
          attribs: { type: "button", class: "cookie-video-placeholder", "data-video-url": url, "data-video-title": attributes.title || "YouTube видео-снимак" },
        };
      },
    },
  });
  if (translatedTexts && textIndex !== translatedTexts.length) throw new Error("Број преведених делова вести није исправан.");
  return result;
}

export function sizedConsentNewsHtml(
  html: string,
  locale: Locale,
  translations: { en: (string | null)[]; de: (string | null)[] },
) {
  const inlineTags = ["a", "b", "strong", "em", "i", "u", "s", "del", "br", "span", "small", "sub", "sup"];
  // Only duplicate inline text; media and other complex markup stay in the original paragraph.
  const inlineOnly = (content: string) => {
    let safe = true;
    const text = content.replace(/<\/?([a-z][\w-]*)(?:\s[^<>]*)?\s*\/?>/gi, (_tag, name: string) => {
      if (!inlineTags.includes(name.toLowerCase())) safe = false;
      return "";
    });
    return safe && !text.includes("<");
  };
  const variants = {
    sr: consentNewsHtml(html),
    en: consentNewsHtml(html, "en", translations.en),
    de: consentNewsHtml(html, "de", translations.de),
  };
  const paragraph = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g;
  const texts = {
    sr: Array.from(variants.sr.matchAll(paragraph), (match) => match[1]),
    en: Array.from(variants.en.matchAll(paragraph), (match) => match[1]),
    de: Array.from(variants.de.matchAll(paragraph), (match) => match[1]),
  };
  if (texts.sr.length !== texts.en.length || texts.sr.length !== texts.de.length) {
    throw new Error("Структура преведених пасуса вести није исправна.");
  }
  let index = 0;
  return variants[locale].replace(paragraph, (full, content: string) => {
    const position = index++;
    const options = [texts.sr[position], texts.en[position], texts.de[position]];
    if (!options.every(inlineOnly) || options.every((value) => value === options[0])) return full;
    const start = full.slice(0, full.length - content.length - 4);
    const spans = (["sr", "en", "de"] as const).map((language) => {
      const visible = language === locale;
      const inner = visible ? texts[language][position] : sanitizeHtml(texts[language][position], {
        allowedTags: inlineTags,
        allowedAttributes: { "*": ["class"] },
      });
      return `<span lang="${language === "sr" ? "sr-Cyrl" : language}"${visible ? "" : ' aria-hidden="true"'}>${inner}</span>`;
    }).join("");
    return `${start}<span class="news-language-text">${spans}</span></p>`;
  });
}
