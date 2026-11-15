import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentList } from "@/components/document-list";
import { PageHeading, programs } from "@/components/school-pages";
import { ExamIndexContent } from "@/components/exam-index-content";
import { LanguageText } from "@/components/language-size";
import { examQuestionGroup, finalExams } from "@/lib/academic";
import { examContent, examDocumentTitles, examProfileHeadings, examPrograms, examText } from "@/lib/exam-text";
import type { Locale } from "@/lib/localization";
import "@/app/academic.css";

type TranslatedLocale = "en" | "de";

const original = {
  programme: "Образовни профил", contents: "Садржај странице", questions: "Испитна питања",
  final: "Матурски / завршни испит", subjects: "Предмети по годинама", prepare: "Материјали за припрему",
  chooseYear: "Изаберите разред и предмет за преузимање испитних питања.", count: "Докумената",
  other: "Остали материјали", noQuestions: "Посебна испитна питања за овај профил нису доступна.",
  finishing: "Завршетак школовања", downloads: "Материјали за преузимање",
  current: "За актуелне испитне услове и материјале обратите се школи.", original: "", untranslated: "",
};

function ExamLabel({ locale, name }: { locale: Locale; name: keyof typeof original }) {
  return <LanguageText locale={locale} values={{ sr: original[name], en: examText.en[name], de: examText.de[name] }} />;
}

function paragraphText(block: { text?: string }) {
  if (typeof block.text !== "string") throw new Error("Недостаје текст испитног материјала.");
  return block.text;
}

export function TranslatedExamIndex({ locale }: { locale: TranslatedLocale }) {
  return <ExamIndexContent locale={locale} />;
}

export function TranslatedExamPage({ locale, profil }: { locale: TranslatedLocale; profil: string }) {
  return <ExamProfileContent locale={locale} profil={profil} />;
}

export function ExamProfileContent({ locale, profil }: { locale: Locale; profil: string }) {
  const program = programs.find((item) => item.id === profil);
  const exam = finalExams.find((item) => item.slug === profil);
  if (!program || !exam) notFound();
  const headings = examProfileHeadings(profil, program.title);
  const title = examPrograms[profil];
  if (!title) throw new Error(`Недостаје превод назива профила: ${profil}`);
  const questions = examQuestionGroup(profil);
  const byYear = ["I", "II", "III", "IV"].map((year) => ({
    year,
    links: questions?.links.filter((link) => new RegExp(`^${year}\\s+RAZRED\\b`, "i").test(link.title))
      .map((link) => ({ ...link, title: link.title.replace(/^(?:I|II|III|IV)\s+RAZRED\s*[-–—]?\s*/i, "") })) ?? [],
  }));
  const otherLinks = questions?.links.filter((link) => !/^(?:I|II|III|IV)\s+RAZRED\b/i.test(link.title)) ?? [];
  const missing = exam.contents.some((block) => block.type === "paragraph"
    ? !Object.prototype.hasOwnProperty.call(examContent, paragraphText(block))
    : block.items?.some((item) => !Object.prototype.hasOwnProperty.call(examContent, item.text)))
    || [...byYear.flatMap((group) => group.links), ...otherLinks, ...exam.links]
      .some((link) => !Object.prototype.hasOwnProperty.call(examDocumentTitles, link.title));
  function translated(value: string) {
    const result = Object.prototype.hasOwnProperty.call(examContent, value) ? examContent[value] : null;
    return <LanguageText locale={locale} values={{ sr: value, en: result?.en ?? value, de: result?.de ?? value }} languages={result ? undefined : { en: "sr", de: "sr" }} />;
  }
  const base = locale === "sr" ? "" : `/${locale}`;

  return <>
    <PageHeading locale={locale} {...headings[locale]} sectionHref={`${base}/ispiti-i-materijali`} variants={headings} />
    <section className="academic-exams section">
      <div className="shell academic-exams__layout">
        <aside><p className="eyebrow"><ExamLabel locale={locale} name="programme" /></p><h2><LanguageText locale={locale} values={{ sr: program.title, ...title }} /></h2><nav aria-label={locale === "sr" ? original.contents : examText[locale].contents}><a href="#ispitna-pitanja"><ExamLabel locale={locale} name="questions" /> ↓</a><a href="#zavrsni-ispit"><ExamLabel locale={locale} name="final" /> ↓</a></nav><Link className="school-page-link" href={`/obrazovni-profili/${profil}`}><ExamLabel locale={locale} name="subjects" /> <span aria-hidden="true">→</span></Link></aside>
        <div>
          <p className="academic-muted"><ExamLabel locale={locale} name="original" /></p>
          {missing && <p className="academic-muted"><ExamLabel locale={locale} name="untranslated" /></p>}
          <section id="ispitna-pitanja" className="academic-exam-section">
            <p className="eyebrow"><ExamLabel locale={locale} name="prepare" /></p><h2><ExamLabel locale={locale} name="questions" /></h2>
            {questions ? <div className="academic-question-groups">
              <p className="academic-question-groups__intro"><ExamLabel locale={locale} name="chooseYear" /></p>
              {byYear.filter((group) => group.links.length > 0).map((group) => <details className="document-group" key={group.year} open><summary><span><LanguageText locale={locale} values={{ sr: `${group.year} разред`, en: `${examText.en.year} ${group.year}`, de: `${examText.de.year} ${group.year}` }} /></span><span className="academic-question-groups__meta"><LanguageText locale={locale} values={{ sr: `${original.count}: ${group.links.length}`, en: `${examText.en.count}: ${group.links.length}`, de: `${examText.de.count}: ${group.links.length}` }} /> <span className="academic-question-groups__toggle" aria-hidden="true" /></span></summary><DocumentList documents={group.links} locale={locale} titles={examDocumentTitles} matchLanguages /></details>)}
              {otherLinks.length > 0 && <details className="document-group" open><summary><span><ExamLabel locale={locale} name="other" /></span><span className="academic-question-groups__meta"><LanguageText locale={locale} values={{ sr: `${original.count}: ${otherLinks.length}`, en: `${examText.en.count}: ${otherLinks.length}`, de: `${examText.de.count}: ${otherLinks.length}` }} /> <span className="academic-question-groups__toggle" aria-hidden="true" /></span></summary><DocumentList documents={otherLinks} locale={locale} titles={examDocumentTitles} matchLanguages /></details>}
            </div> : <p className="academic-muted"><ExamLabel locale={locale} name="noQuestions" /></p>}
          </section>
          <section id="zavrsni-ispit" className="academic-exam-section">
            <p className="eyebrow"><ExamLabel locale={locale} name="finishing" /></p><h2><ExamLabel locale={locale} name="final" /></h2>
            {exam.contents.map((block, index) => block.type === "paragraph" ? <p key={index}>{translated(paragraphText(block))}</p> : <ul className="academic-exam-list" key={index}>{block.items?.map((item, itemIndex) => <li key={itemIndex}>{translated(item.text)}</li>)}</ul>)}
            {exam.links.length > 0 && <><h3><ExamLabel locale={locale} name="downloads" /></h3><DocumentList documents={exam.links} locale={locale} titles={examDocumentTitles} matchLanguages /></>}
          </section>
          <p className="academic-muted"><ExamLabel locale={locale} name="current" /></p>
        </div>
      </div>
    </section>
  </>;
}
