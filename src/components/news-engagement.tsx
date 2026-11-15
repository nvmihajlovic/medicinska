"use client";

import { useEffect, useRef, useState } from "react";
import { openCookieSettings, useCookieConsent } from "@/components/cookie-consent";
import { LanguageInline, LanguageText } from "@/components/language-size";
import type { Locale } from "@/lib/localization";

type Metrics = { views: number; likes: number; liked: boolean };
const labels = {
  sr: { label: "Интеракција са вешћу", consent: "За бројаче је потребна сагласност.", views: "прегледа", loading: "Учитавање прегледа…", countersError: "Бројачи прегледа и лајкова тренутно нису доступни.", likeError: "Лајк није сачуван. Покушајте поново.", liked: "Свиђа вам се", like: "Свиђа ми се", share: "Подели вест", copied: "Линк је копиран.", shareError: "Дељење није успело. Копирајте адресу из прегледача.", note: "За памћење лајкова и бројање прегледа користи се колачић у овом прегледачу.", settings: "Подешавања колачића", noScript: "За лајкове и дељење потребан је JavaScript." },
  en: { label: "News interaction", consent: "Consent is required for counters.", views: "views", loading: "Loading views…", countersError: "View and like counts are currently unavailable.", likeError: "Your like could not be saved. Please try again.", liked: "You like this", like: "Like", share: "Share news", copied: "Link copied.", shareError: "Sharing failed. Copy the address from your browser.", note: "A cookie in this browser is used to remember likes and count views.", settings: "Cookie settings", noScript: "JavaScript is required for likes and sharing." },
  de: { label: "Interaktion mit der Nachricht", consent: "Für die Zähler ist Ihre Einwilligung erforderlich.", views: "Aufrufe", loading: "Aufrufe werden geladen…", countersError: "Aufruf- und „Gefällt mir“-Zähler sind derzeit nicht verfügbar.", likeError: "Ihre „Gefällt mir“-Angabe konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.", liked: "Gefällt Ihnen", like: "Gefällt mir", share: "Nachricht teilen", copied: "Link kopiert.", shareError: "Das Teilen ist fehlgeschlagen. Kopieren Sie die Adresse aus dem Browser.", note: "Ein Cookie in diesem Browser speichert „Gefällt mir“-Angaben und zählt Aufrufe.", settings: "Cookie-Einstellungen", noScript: "Für „Gefällt mir“ und das Teilen ist JavaScript erforderlich." },
} as const;

const shareLabels = {
  sr: { link: "Линк за дељење", copy: "Копирај линк", native: "Подели преко уређаја" },
  en: { link: "Link to share", copy: "Copy link", native: "Share using your device" },
  de: { link: "Link zum Teilen", copy: "Link kopieren", native: "Über das Gerät teilen" },
} as const;

async function requestMetrics(slug: string, action?: "view" | "like", signal?: AbortSignal): Promise<Metrics> {
  const response = await fetch(`/api/news/${encodeURIComponent(slug)}`, action ? {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
    cache: "no-store",
    signal,
  } : { cache: "no-store", signal });
  if (!response.ok) throw new Error("Бројачи тренутно нису доступни.");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("views" in data) || !("likes" in data) || !("liked" in data) ||
      typeof data.views !== "number" || typeof data.likes !== "number" || typeof data.liked !== "boolean") {
    throw new Error("Подаци о прегледима нису исправни.");
  }
  return { views: data.views, likes: data.likes, liked: data.liked };
}

async function recordView(slug: string, signal: AbortSignal) {
  await requestMetrics(slug, undefined, signal);
  return requestMetrics(slug, "view", signal);
}

export function NewsEngagement({ slug, title, locale = "sr" }: { slug: string; title: string; locale?: Locale }) {
  const text = labels[locale];
  const values = (key: keyof typeof labels.sr) => ({ sr: labels.sr[key], en: labels.en[key], de: labels.de[key] });
  const numberLocale = locale === "sr" ? "sr-RS" : locale;
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  const consent = useCookieConsent();
  const allowed = consent?.analytics === true;
  const likeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    const controller = new AbortController();
    recordView(slug, controller.signal).then((result) => {
      if (active) { setMetrics(result); setError(""); }
    }).catch(() => {
      if (active) { setMetrics(null); setError(text.countersError); }
    });
    return () => { active = false; controller.abort(); likeRequest.current?.abort(); };
  }, [slug, allowed, text.countersError]);

  async function toggleLike() {
    setPending(true);
    setError("");
    const controller = new AbortController();
    likeRequest.current = controller;
    try {
      setMetrics(await requestMetrics(slug, "like", controller.signal));
    } catch {
      if (!controller.signal.aborted) setError(text.likeError);
    } finally {
      setPending(false);
    }
  }

  function showShareOptions() {
    setShareMessage("");
    setShareUrl(`${window.location.origin}${locale === "sr" ? "" : `/${locale}`}/vesti/${encodeURIComponent(slug)}`);
    setNativeShareAvailable(typeof navigator.share === "function");
  }

  async function copyLink() {
    setShareMessage("");
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage(text.copied);
    } catch {
      setShareMessage(text.shareError);
    }
  }

  async function shareOnDevice() {
    setShareMessage("");
    try {
      await navigator.share({ title, url: shareUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage(text.shareError);
    }
  }

  return (
    <div className="news-engagement">
      <p className="news-engagement__label"><LanguageText locale={locale} values={values("label")} /></p>
      <div className="news-engagement__views" aria-live="polite">
        <span aria-hidden="true">◉</span>
        {!allowed ? <LanguageText locale={locale} values={values("consent")} /> : metrics ? <strong><LanguageText locale={locale} values={{ sr: `${metrics.views.toLocaleString("sr-RS")} ${labels.sr.views}`, en: `${metrics.views.toLocaleString("en")} ${labels.en.views}`, de: `${metrics.views.toLocaleString("de")} ${labels.de.views}` }} /></strong> : <LanguageText locale={locale} values={values(error ? "countersError" : "loading")} />}
      </div>
      <div className="news-engagement__actions">
        <button type="button" onClick={toggleLike} disabled={!allowed || !metrics || pending} aria-pressed={allowed && (metrics?.liked ?? false)}>
          <span aria-hidden="true">{allowed && metrics?.liked ? "♥" : "♡"}</span> <LanguageText locale={locale} values={values(allowed && metrics?.liked ? "liked" : "like")} /> {allowed && metrics && <span className="news-engagement__like-count">{metrics.likes.toLocaleString(numberLocale)}</span>}
        </button>
        <button type="button" onClick={showShareOptions} aria-expanded={Boolean(shareUrl)} aria-controls="news-share-options"><span aria-hidden="true">↗</span> <LanguageText locale={locale} values={values("share")} /></button>
      </div>
      {allowed && error && metrics && <p className="news-engagement__status" role="alert">{error}</p>}
      {shareUrl && <div id="news-share-options" className="news-engagement__share">
        <label htmlFor="news-share-link">{shareLabels[locale].link}</label>
        <input id="news-share-link" type="text" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} />
        <button type="button" onClick={copyLink}>{shareLabels[locale].copy}</button>
        {nativeShareAvailable && <button type="button" onClick={shareOnDevice}>{shareLabels[locale].native}</button>}
      </div>}
      {shareMessage && <p className="news-engagement__status" role="status">{shareMessage}</p>}
      <p className="news-engagement__note"><LanguageInline locale={locale}>{(language) => <>{labels[language].note} {language === locale ? <button type="button" className="cookie-settings-link" onClick={openCookieSettings}>{labels[language].settings}</button> : <button type="button" className="cookie-settings-link" disabled>{labels[language].settings}</button>}</>}</LanguageInline></p>
      <noscript>{text.noScript}</noscript>
    </div>
  );
}
