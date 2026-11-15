"use client";

import { usePathname } from "next/navigation";
import { chromeText, type Locale } from "@/lib/localization";

export function LanguageSwitcher({ locale, selectedLocale = locale, onNavigate }: { locale: Locale; selectedLocale?: Locale; onNavigate?: () => void }) {
  const pathname = usePathname();
  const originalPath = pathname.replace(/^\/(en|de)(?=\/|$)/, "");
  const translated = /^\/(?:vesti|obrazovni-profili)\/[^/]+$/.test(originalPath) || ["", "/", "/o-skoli", "/zaposleni", "/strucni-timovi", "/kontakt", "/dokumentacija", "/erasmus-projekti", "/obrazovni-profili", "/ispiti-i-materijali", "/ispiti-i-materijali/rasporedi", "/ispiti-i-materijali/medicinska-sestra-tehnicar", "/ispiti-i-materijali/ginekolosko-akuserska-sestra", "/ispiti-i-materijali/medicinska-sestra-vaspitac", "/ispiti-i-materijali/zdravstveni-negovatelj", "/uslovi-koriscenja", "/privatnost", "/kolacici", "/ucenici-i-roditelji", "/informacije/raspored-zvonjenja", "/informacije/plan-pismenih-provera", "/informacije/dezurstva-nastavnika"].includes(originalPath);
  const home = originalPath === "" || originalPath === "/";
  const languages = [
    { code: "sr", label: "Српски", href: translated ? (home ? "/" : originalPath) : pathname },
    { code: "en", label: translated ? "English" : "English — About the school", href: translated ? `/en${home ? "" : originalPath}` : "/en/o-skoli" },
    { code: "de", label: translated ? "Deutsch" : "Deutsch — Über die Schule", href: translated ? `/de${home ? "" : originalPath}` : "/de/o-skoli" },
  ] as const;
  return (
    <div className="language-switcher" role="group" aria-label={chromeText[locale].language}>
      {languages.map((language) => <a key={language.code} href={`/api/language?locale=${language.code}&next=${encodeURIComponent(language.href)}`} lang={language.code === "sr" ? "sr-Cyrl" : language.code} onClick={onNavigate}
        aria-label={language.label} aria-current={language.code === selectedLocale ? "true" : undefined}>{language.code.toUpperCase()}</a>)}
    </div>
  );
}
