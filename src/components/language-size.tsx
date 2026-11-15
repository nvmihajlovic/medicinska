import type { ReactNode } from "react";
import type { Locale } from "@/lib/localization";

export function LanguageBlock({ locale, children }: { locale: Locale; children: (language: Locale) => ReactNode }) {
  return <div className="language-size-stack">
    {(["sr", "en", "de"] as const).map((language) => <div key={language} lang={language} aria-hidden={language !== locale || undefined}>{children(language)}</div>)}
  </div>;
}

export function LanguageText({ locale, values, languages }: { locale: Locale; values: Record<Locale, string>; languages?: Partial<Record<Locale, string>> }) {
  return <span className="language-size-stack">
    {(["sr", "en", "de"] as const).map((language) => <span key={language} lang={languages?.[language] ?? language} aria-hidden={language !== locale || undefined}>{values[language]}</span>)}
  </span>;
}

export function LanguageInline({ locale, children }: { locale: Locale; children: (language: Locale) => ReactNode }) {
  return <span className="language-size-stack">
    {(["sr", "en", "de"] as const).map((language) => <span key={language} lang={language} aria-hidden={language !== locale || undefined}>{children(language)}</span>)}
  </span>;
}
