import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";
import { LanguageBlock, LanguageText } from "@/components/language-size";
import type { Locale } from "@/lib/localization";

const text = {
  sr: {
    school: "Медицинска школа „Стевица Јовановић”", since: "Панчево · од 1959.", eyebrow: "Образовање за здравство и социјалну заштиту",
    heading: "Медицинско образовање у Панчеву", headingEnd: "од 1959.\u00a0године.",
    lead: "У Медицинској школи „Стевица Јовановић” ученици стичу стручна знања, практичне вештине и темељ за одговоран рад у здравству.",
    explore: "Истражи образовне профиле", about: "Упознај нашу школу",
  },
  en: {
    school: "Medical School “Stevica Jovanović”", since: "Pančevo · since 1959", eyebrow: "Education for healthcare and social protection",
    heading: "Medical education in Pančevo", headingEnd: "since 1959.",
    lead: "At Medical School “Stevica Jovanović”, students gain professional knowledge, practical skills and a foundation for responsible work in healthcare.",
    explore: "Explore study programmes", about: "Discover our school",
  },
  de: {
    school: "Medizinische Schule „Stevica Jovanović“", since: "Pančevo · seit 1959", eyebrow: "Bildung für Gesundheit und soziale Betreuung",
    heading: "Medizinische Ausbildung in Pančevo", headingEnd: "seit 1959.",
    lead: "An der Medizinischen Schule „Stevica Jovanović“ erwerben die Lernenden Fachwissen, praktische Fähigkeiten und eine Grundlage für verantwortungsvolle Arbeit im Gesundheitswesen.",
    explore: "Bildungsprofile entdecken", about: "Unsere Schule kennenlernen",
  },
} as const;

export function HomeHero({ locale }: { locale: Locale }) {
  const base = locale === "sr" ? "" : `/${locale}`;
  return <section className="hero">
    <div className="shell hero__identity">
      <LanguageText locale={locale} values={{ sr: text.sr.school, en: text.en.school, de: text.de.school }} />
      <LanguageText locale={locale} values={{ sr: text.sr.since, en: text.en.since, de: text.de.since }} />
    </div>
    <div className="shell hero__layout">
      <div className="hero__copy"><LanguageBlock locale={locale}>{(language) => <>
        <p className="eyebrow"><span className="eyebrow__dot" /> {text[language].eyebrow}</p>
        <h1>{text[language].heading} <em>{text[language].headingEnd}</em></h1>
        <p className="hero__lead">{text[language].lead}</p>
        <div className="hero__actions">
          {language === locale ? <><Link className="button button--primary" href={`${base}/obrazovni-profili`}>{text[language].explore} <span aria-hidden="true">→</span></Link><Link className="button button--text" href={`${base}/o-skoli`}>{text[language].about} <span aria-hidden="true">→</span></Link></> : <><a className="button button--primary">{text[language].explore} <span aria-hidden="true">→</span></a><a className="button button--text">{text[language].about} <span aria-hidden="true">→</span></a></>}
        </div>
      </>}</LanguageBlock></div>
      <HeroSlider locale={locale} />
    </div>
  </section>;
}
