import Link from "next/link";
import { ExamProgramCard } from "@/components/exam-program-card";
import { LanguageText } from "@/components/language-size";
import { PageHeading, programs } from "@/components/school-pages";
import { examIndexHeadings, examText } from "@/lib/exam-text";
import type { Locale } from "@/lib/localization";

const original = {
  material: "Материјали за ученике", choose: "Изаберите образовни профил", intro: "На страницама профила налазе се објављена испитна и матурска питања, са документима доступним на овом сајту.",
  graduation: "Матурски и завршни испит", notice: "Отворите свој образовни профил за податке о испиту и доступне материјале. За важеће услове обратите се школи.",
  schedule: "Архива распореда испита", documents: "Документација школе",
};

function ExamText({ locale, name }: { locale: Locale; name: keyof typeof original }) {
  return <LanguageText locale={locale} values={{ sr: original[name], en: examText.en[name], de: examText.de[name] }} />;
}

export function ExamIndexContent({ locale }: { locale: Locale }) {
  const base = locale === "sr" ? "" : `/${locale}`;
  return <>
    <PageHeading locale={locale} {...examIndexHeadings[locale]} sectionHref={`${base}/ucenici-i-roditelji`} variants={examIndexHeadings} />
    <section className="academic-directory section">
      <div className="shell">
        <div className="academic-directory__intro"><div><p className="eyebrow"><ExamText locale={locale} name="material" /></p><h2><ExamText locale={locale} name="choose" /></h2></div><p><ExamText locale={locale} name="intro" /></p></div>
        <div className="academic-directory__cards" id="ispitna-pitanja">
          {programs.map((program) => <ExamProgramCard key={program.id} program={program} locale={locale} />)}
        </div>
        <div className="academic-directory__note" id="maturska-pitanja"><strong><ExamText locale={locale} name="graduation" /></strong><p><ExamText locale={locale} name="notice" /></p><Link href={`${base}/ispiti-i-materijali/rasporedi`}><ExamText locale={locale} name="schedule" /> <span aria-hidden="true">→</span></Link></div>
        <Link className="school-page-link" href={`${base}/dokumentacija`}><ExamText locale={locale} name="documents" /> <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </>;
}
