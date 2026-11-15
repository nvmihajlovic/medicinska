"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { consentCookie, consentValue, parseConsent } from "@/lib/cookie-consent";
import { cookieText, localeFromPath, type Locale } from "@/lib/localization";
import "./cookie-consent.css";

const updatedEvent = "school-consent-updated";
const openEvent = "school-consent-open";

function snapshot() {
  return document.cookie.split("; ").find((cookie) => cookie.startsWith(`${consentCookie}=`))?.slice(consentCookie.length + 1) ?? "";
}

function subscribe(callback: () => void) {
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(updatedEvent) : null;
  channel?.addEventListener("message", callback);
  window.addEventListener(updatedEvent, callback);
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener(updatedEvent, callback);
    window.removeEventListener("focus", callback);
    channel?.close();
  };
}

function useConsentValue() {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

export function useCookieConsent() {
  return parseConsent(useConsentValue() ?? undefined);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(openEvent));
}

export function CookieSettingsButton({ locale }: { locale?: Locale }) {
  const pathLocale = localeFromPath(usePathname());
  const text = cookieText[locale ?? pathLocale];
  return <button type="button" className="cookie-settings-link" onClick={() => window.dispatchEvent(new CustomEvent(openEvent, { detail: locale }))}>{text.settings}</button>;
}

export function CookieConsent() {
  const pathLocale = localeFromPath(usePathname());
  const storedChoice = useConsentValue();
  const choice = parseConsent(storedChoice ?? undefined);
  const [settings, setSettings] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openedLocale, setOpenedLocale] = useState<Locale | null>(null);
  const [analytics, setAnalytics] = useState(false);
  const [video, setVideo] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locale = opened ? openedLocale ?? pathLocale : pathLocale;
  const text = cookieText[locale];

  useEffect(() => {
    const open = (event: Event) => {
      const current = parseConsent(snapshot());
      const selected: unknown = event instanceof CustomEvent ? event.detail : null;
      setOpenedLocale(selected === "sr" || selected === "en" || selected === "de" ? selected : null);
      setAnalytics(current?.analytics ?? false);
      setVideo(current?.video ?? false);
      setError("");
      setSettings(true);
      setOpened(true);
    };
    window.addEventListener(openEvent, open);
    return () => window.removeEventListener(openEvent, open);
  }, []);

  async function save(nextAnalytics: boolean, nextVideo: boolean) {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analytics: nextAnalytics, video: nextVideo }),
      });
      if (!response.ok || snapshot() !== consentValue(nextAnalytics, nextVideo)) throw new Error("Сачувани избор није доступан.");
      window.dispatchEvent(new Event(updatedEvent));
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel(updatedEvent);
        channel.postMessage("updated");
        channel.close();
      }
      setOpened(false);
      setSettings(false);
    } catch {
      setError(text.error);
    } finally {
      setPending(false);
    }
  }

  if (storedChoice === null || (choice && !opened)) return null;
  return (
    <section className="cookie-panel" lang={locale === "sr" ? "sr-Cyrl" : locale} aria-label={text.label}>
      <div className="cookie-panel__header">
        <span className="cookie-panel__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 19 6v5c0 4.5-2.8 7.7-7 10-4.2-2.3-7-5.5-7-10V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <div>
          <p className="cookie-panel__eyebrow">{text.eyebrow}</p>
          <h2>{text.title}</h2>
        </div>
        {opened && <button type="button" className="cookie-panel__close" disabled={pending} onClick={() => setOpened(false)} aria-label={text.close}>×</button>}
      </div>
      <div className="cookie-panel__intro">
        <p>{text.intro}</p>
        <Link href={locale === "sr" ? "/kolacici" : `/${locale}/kolacici`}>{text.policy} <span aria-hidden="true">↗</span></Link>
      </div>
      {settings && (
        <div className="cookie-panel__options">
          <div><div className="cookie-panel__option-heading"><strong>{text.required}</strong><span>{text.always}</span></div><p>{text.requiredDescription}</p></div>
          <label><span><strong>{text.analytics}</strong><small>{text.analyticsDescription}</small></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></label>
          <label><span><strong>{text.video}</strong><small>{text.videoDescription}</small></span><input type="checkbox" checked={video} onChange={(event) => setVideo(event.target.checked)} /></label>
        </div>
      )}
      {error && <p className="cookie-panel__error" role="alert">{error}</p>}
      <div className="cookie-panel__actions">
        <button type="button" disabled={pending} onClick={() => save(true, true)}>{text.accept}</button>
        <button type="button" disabled={pending} onClick={() => save(false, false)}>{text.reject}</button>
        {settings ? <button className="cookie-panel__customize" type="button" disabled={pending} onClick={() => save(analytics, video)}>{text.save}</button> :
          <button className="cookie-panel__customize" type="button" onClick={() => setSettings(true)}>{text.customize}</button>}
      </div>
    </section>
  );
}
