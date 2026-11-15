import Link from "next/link";
import { PageHeading } from "@/components/school-pages";
import { LanguageText } from "@/components/language-size";
import { documentFormat } from "@/lib/academic";
import { examScheduleEntries } from "@/lib/exam-schedules";
import { examScheduleHeadings, examScheduleNotes, examScheduleText, examScheduleTitles, examText } from "@/lib/exam-text";
import type { Locale } from "@/lib/localization";

const original = {
  eyebrow: "Архива школе", heading: "Испитни рокови",
  note: "Распореди се односе на наведене датуме и нису потврда актуелних рокова. За текуће информације обратите се школи.",
  original: "", untranslated: "",
};

function ScheduleLabel({ locale, name }: { locale: Locale; name: keyof typeof original }) {
  return <LanguageText locale={locale} values={{ sr: original[name], en: examScheduleText.en[name], de: examScheduleText.de[name] }} />;
}

export function ExamSchedulesContent({ locale }: { locale: Locale }) {
  const years = [...new Set(examScheduleEntries.map((entry) => entry.date.slice(0, 4)))];
  const missing = examScheduleEntries.some((entry) => !Object.prototype.hasOwnProperty.call(examScheduleTitles, entry.title) || (entry.note && !Object.prototype.hasOwnProperty.call(examScheduleNotes, entry.note)));
  const base = locale === "sr" ? "" : `/${locale}`;

  return <>
    <PageHeading locale={locale} {...examScheduleHeadings[locale]} sectionHref={`${base}/ispiti-i-materijali`} variants={examScheduleHeadings} />
    <section className="section"><div className="shell academic-exams__layout">
      <aside><p className="eyebrow"><ScheduleLabel locale={locale} name="eyebrow" /></p><h2><ScheduleLabel locale={locale} name="heading" /></h2><p className="academic-muted"><ScheduleLabel locale={locale} name="note" /></p><p className="academic-muted"><ScheduleLabel locale={locale} name="original" /></p><Link className="school-page-link" href={`${base}/ispiti-i-materijali`}><LanguageText locale={locale} values={{ sr: "Испити и материјали", en: examText.en.title, de: examText.de.title }} /> <span aria-hidden="true">→</span></Link></aside>
      <div>
        {missing && <p className="academic-muted"><ScheduleLabel locale={locale} name="untranslated" /></p>}
        {years.map((year, index) => <details className="document-group" key={year} open={index === 0 ? true : undefined}>
          <summary><span><LanguageText locale={locale} values={{ sr: `${year}. година`, en: `${examScheduleText.en.year} ${year}`, de: `${examScheduleText.de.year} ${year}` }} /></span><span>{examScheduleEntries.filter((entry) => entry.date.startsWith(year)).length} <span aria-hidden="true">+</span></span></summary>
          {examScheduleEntries.filter((entry) => entry.date.startsWith(year)).map((entry) => {
            const title = Object.prototype.hasOwnProperty.call(examScheduleTitles, entry.title) ? examScheduleTitles[entry.title] : null;
            const note = Object.prototype.hasOwnProperty.call(examScheduleNotes, entry.note) ? examScheduleNotes[entry.note] : null;
            const date = new Date(`${entry.date}T00:00:00Z`);
            const formatDate = (language: string) => new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(date);
            return <article className="academic-schedule" key={`${entry.date}-${entry.title}`}>
              <time dateTime={entry.date}><LanguageText locale={locale} values={{ sr: formatDate("sr-RS"), en: formatDate("en-GB"), de: formatDate("de-DE") }} /></time>
              <h3><LanguageText locale={locale} values={{ sr: entry.title, en: title?.en ?? entry.title, de: title?.de ?? entry.title }} languages={title ? undefined : { en: "sr", de: "sr" }} /></h3>
              {entry.note && <p><LanguageText locale={locale} values={{ sr: entry.note, en: note?.en ?? entry.note, de: note?.de ?? entry.note }} languages={note ? undefined : { en: "sr", de: "sr" }} /></p>}
              {entry.paths.map((path, pathIndex) => {
                const part = entry.paths.length > 1;
                return <a key={path} href={path}><LanguageText locale={locale} values={{ sr: `Отвори ${part ? `део ${pathIndex + 1}` : "распоред"} · ${documentFormat(path)}`, en: `${part ? `${examScheduleText.en.part} ${pathIndex + 1}` : examScheduleText.en.open} · ${documentFormat(path)}`, de: `${part ? `${examScheduleText.de.part} ${pathIndex + 1}` : examScheduleText.de.open} · ${documentFormat(path)}` }} /> <span aria-hidden="true">↓</span></a>;
              })}
            </article>;
          })}
        </details>)}
      </div>
    </div></section>
  </>;
}
