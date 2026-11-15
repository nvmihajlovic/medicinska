"use client";

import { useEffect, useRef } from "react";
import { openCookieSettings, useCookieConsent } from "@/components/cookie-consent";
import { LanguageText } from "@/components/language-size";
import { youtubeEmbedUrl } from "@/lib/youtube-url";
import type { Locale } from "@/lib/localization";

const permissions = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function ConsentVideo({ src, title, locale = "sr" }: { src: string; title: string; locale?: Locale }) {
  const allowed = useCookieConsent()?.video === true;
  const url = youtubeEmbedUrl(src);
  if (!url) return <p>{locale === "en" ? "The video is unavailable." : locale === "de" ? "Das Video ist nicht verfügbar." : "Видео-снимак није доступан."}</p>;
  return allowed
    ? <iframe src={url} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow={permissions} allowFullScreen />
    : <button className="cookie-video-placeholder" type="button" onClick={openCookieSettings}><LanguageText locale={locale} values={{ sr: "За приказ YouTube снимка отворите подешавања колачића.", en: "Open cookie settings to view the YouTube video.", de: "Öffnen Sie die Cookie-Einstellungen, um das YouTube-Video anzusehen." }} /></button>;
}

export function ConsentNewsContent({ html }: { html: string }) {
  const allowed = useCookieConsent()?.video === true;
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!allowed || !container.current) return;
    const replacements = Array.from(container.current.querySelectorAll<HTMLButtonElement>("button[data-video-url]")).flatMap((button) => {
      const url = youtubeEmbedUrl(button.dataset.videoUrl ?? "");
      if (!url) {
        console.error("Недозвољен URL уграђеног видео-снимка.");
        button.textContent = "Видео-снимак није доступан.";
        return [];
      }
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = button.dataset.videoTitle ?? "YouTube видео-снимак";
      frame.loading = "lazy";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allow = permissions;
      frame.allowFullscreen = true;
      button.replaceWith(frame);
      return [{ button, frame }];
    });
    return () => { replacements.forEach(({ button, frame }) => frame.replaceWith(button)); };
  }, [allowed, html]);

  return <div ref={container} className="school-news-article__content" onClick={(event) => {
    if (event.target instanceof Element && event.target.closest("button[data-video-url]")) openCookieSettings();
  }} dangerouslySetInnerHTML={{ __html: html }} />;
}
