import Link from "next/link";
import { examPrograms, examText } from "@/lib/exam-text";
import type { Locale } from "@/lib/localization";

type Program = { id: string; number: string; title: string };

export function ExamProgramCard({ program, locale }: { program: Program; locale: Locale }) {
  const names = examPrograms[program.id];
  if (!names) throw new Error(`Недостаје превод назива профила: ${program.id}`);

  return <Link href={`${locale === "sr" ? "" : `/${locale}`}/ispiti-i-materijali/${program.id}`} className="academic-directory__card">
    {(["sr", "en", "de"] as const).map((language) => <div className="academic-directory__card-content" key={language} lang={language} aria-hidden={language !== locale || undefined}>
      <span>{program.number} / {language === "sr" ? "Образовни профил" : examText[language].programme}</span>
      <h3>{language === "sr" ? program.title : names[language]}</h3>
      <span>{language === "sr" ? "Питања и материјали" : examText[language].questionsMaterials} →</span>
    </div>)}
  </Link>;
}
