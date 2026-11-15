"use client";

import { useEffect, useState } from "react";
import { LanguageBlock, LanguageText } from "@/components/language-size";
import { belgradeDate, healthObservances } from "@/lib/health-calendar";
import { healthEntries, healthText } from "@/lib/health-text";
import type { Locale } from "@/lib/localization";

export function HealthCalendar({ initialDate, locale = "sr" }: { initialDate: string; locale?: Locale }) {
  const [date, setDate] = useState(initialDate);
  const calendar = healthObservances(date);
  const hasMissing = [...calendar.daily, ...calendar.weekly, ...calendar.monthly]
    .some((item) => !Object.prototype.hasOwnProperty.call(healthEntries, item.title));
  const dateValue = new Date(`${date}T00:00:00Z`);
  const months = { sr: calendar.month, en: new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(dateValue), de: new Intl.DateTimeFormat("de", { month: "long", timeZone: "UTC" }).format(dateValue) };
  function content(item: { title: string; description: string }, kind: "daily" | "weekly" | "monthly") {
    const labels = { daily: "Данас обележавамо", weekly: "Недељна кампања", monthly: "Месечна кампања" };
    return <LanguageBlock locale={locale}>{(language) => {
      const translated = language !== "sr" && Object.prototype.hasOwnProperty.call(healthEntries, item.title) ? healthEntries[item.title][language] : null;
      return <><p className="health-calendar__label">{language === "sr" ? labels[kind] : healthText[language][kind]}</p><h2 lang={translated ? undefined : "sr-Cyrl"}>{translated?.[0] ?? item.title}</h2><p lang={translated ? undefined : "sr-Cyrl"}>{translated?.[1] ?? item.description}</p></>;
    }}</LanguageBlock>;
  }

  useEffect(() => {
    const update = () => setDate(belgradeDate(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <section className="shell health-calendar" aria-labelledby="health-calendar-title">
      <div className="health-calendar__date">
        <p id="health-calendar-title"><LanguageText locale={locale} values={{ sr: "Здравствени календар", en: healthText.en.title, de: healthText.de.title }} /></p>
        <time dateTime={calendar.date}><strong>{calendar.day}</strong><span><LanguageText locale={locale} values={months} />{calendar.year}.</span></time>
      </div>
      <div className="health-calendar__entries">
        {calendar.daily.map((item) => (
          <article className="health-calendar__entry" key={item.title}>
            {content(item, "daily")}
          </article>
        ))}
        {calendar.weekly.map((item) => (
          <article className="health-calendar__entry" key={item.title}>
            {content(item, "weekly")}
          </article>
        ))}
        {calendar.monthly.map((item) => (
          <article className="health-calendar__entry" key={item.title}>
            {content(item, "monthly")}
          </article>
        ))}
        {hasMissing && <p><LanguageText locale={locale} values={{ sr: "", en: healthText.en.missing, de: healthText.de.missing }} /></p>}
      </div>
    </section>
  );
}
