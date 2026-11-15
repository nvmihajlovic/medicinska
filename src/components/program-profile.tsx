import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading, programs } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { curricula } from "@/lib/academic";
import { examPrograms } from "@/lib/exam-text";
import { programmeHeadings } from "@/lib/program-text";
import { profileImageAlts, profileText, profileTranslations, translatedProfileNote, translatedProfileSubject } from "@/lib/profile-text";
import type { Locale } from "@/lib/localization";
import "@/app/academic.css";

export function ProgramProfile({ profil, locale = "sr" }: { profil: string; locale?: Locale }) {
  const profile = curricula.find((item) => item.slug === profil);
  const program = programs.find((item) => item.id === profil);
  if (!profile || !program) notFound();
  const translations = profileTranslations[profil];
  if (!translations) throw new Error(`Недостаје превод профила: ${profil}`);
  const translation = locale === "sr" ? null : translations[locale];
  const names = examPrograms[profil];
  if (!names) throw new Error(`Недостаје назив профила: ${profil}`);
  const imageAlts = profileImageAlts[profil];
  if (!imageAlts) throw new Error(`Недостаје превод описа слике: ${profil}`);
  const text = locale === "sr" ? null : profileText[locale];
  const base = locale === "sr" ? "" : `/${locale}`;
  const details = translation ?? program;
  const headings = {
    sr: { section: programmeHeadings.sr.title, title: program.title, description: program.description },
    en: { section: programmeHeadings.en.title, title: names.en, description: translations.en.description },
    de: { section: programmeHeadings.de.title, title: names.de, description: translations.de.description },
  };

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <PageHeading locale={locale} {...headings[locale]} variants={headings} sectionHref={`${base}/obrazovni-profili`} />
        <section className="academic-profile section">
          <div className="shell">
            <div className="academic-profile__intro">
              <div>
                <p className="eyebrow">{text?.profile ?? "Образовни профил"} / {program.number}</p>
                <h2>{text?.meet ?? "Упознајте профил"}</h2>
                {details.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <Image src={program.image} alt={locale === "sr" ? program.alt : imageAlts[locale]} width={760} height={520} />
            </div>
            <div className="academic-profile__details">
              <section className="academic-profile__learning">
                <p className="eyebrow">{text?.skills ?? "Знања и вештине"}</p>
                <h2>{text?.learn ?? "Шта ћете учити?"}</h2>
                <p>{text?.learnIntro ?? "Профил повезује опште образовање са стручним предметима и развојем вештина важних за рад са људима."}</p>
                <ul>{details.learning.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <aside className="academic-profile__outlook">
                <section>
                  <p className="eyebrow">{text?.future ?? "Поглед у будућност"}</p>
                  <h2>{text?.after ?? "Након школовања"}</h2>
                  <p>{details.opportunities}</p>
                  <p className="academic-profile__disclaimer">{text?.disclaimer ?? "Могућности запослења и наставка школовања зависе од важећих прописа и услова установе."}</p>
                </section>
                <section>
                  <h2>{text?.suitable ?? "Коме профил може да одговара?"}</h2>
                  <p>{details.suitable}</p>
                </section>
              </aside>
            </div>
            <div className="academic-profile__curriculum-heading">
              <div>
                <p className="eyebrow">{text?.subjects ?? "Предмети и настава"}</p>
                <h2>{text?.years ?? "Настава по годинама"}</h2>
                <p>{text?.curriculum ?? "Приказ је заснован на раније објављеном школском плану. За актуелни наставни план и услове уписа"} <Link href={`${base}/kontakt`}>{text?.contact ?? "обратите се школи"}</Link>.</p>
              </div>
              <Link className="school-page-link" href={`${base}/ispiti-i-materijali/${profil}`}>{text?.materials ?? "Испити и материјали за овај профил"} <span aria-hidden="true">→</span></Link>
            </div>
            <div className="academic-years">
              {profile.years.map((year, index) => (
                <details className="academic-year" key={index} open={index === 0 ? true : undefined}>
                  <summary><span><small>{String(index + 1).padStart(2, "0")}</small>{["I", "II", "III", "IV"][index]} {text?.year ?? "година"}</span><span aria-hidden="true">+</span></summary>
                  <ol>{year.subjects.map((subject, subjectIndex) => <li key={subjectIndex}>{locale === "sr" ? subject : translatedProfileSubject(subject, locale)}</li>)}</ol>
                </details>
              ))}
            </div>
            <div className="academic-notes"><strong>{text?.notes ?? "Напомене"}</strong>{profile.notes.map((note) => <p key={note}>{locale === "sr" ? note : translatedProfileNote(note, locale)}</p>)}</div>
            <section className="academic-profile__exam">
              <h2>{text?.completion ?? "Завршетак школовања"}</h2>
              <p>{details.exam}</p>
              <p>{text?.current ?? "За актуелне услове и материјале"} <Link href={`${base}/ispiti-i-materijali/${profil}`}>{text?.examsLink ?? "погледајте испите за овај профил"}</Link> {text?.or ?? "или"} <Link href={`${base}/kontakt`}>{text?.contact ?? "обратите се школи"}</Link>.</p>
            </section>
            <Link href={`${base}/obrazovni-profili`} className="school-page-link">{text?.all ?? "Сви образовни профили"} <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
