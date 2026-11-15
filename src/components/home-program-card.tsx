import Image from "next/image";
import Link from "next/link";
import { examPrograms } from "@/lib/exam-text";
import type { Locale } from "@/lib/localization";

type Program = { id: string; number: string; title: string; description: string; image: string; alt: string };

const labels = {
  sr: { profile: "Образовни профил", details: "Детаљи профила" },
  en: { profile: "Study programme", details: "Programme details (in Serbian)" },
  de: { profile: "Bildungsprofil", details: "Profildetails (auf Serbisch)" },
} as const;

export function HomeProgramCard({ program, locale }: { program: Program; locale: Locale }) {
  const names = examPrograms[program.id];
  if (!names) throw new Error(`Недостаје превод назива профила: ${program.id}`);

  return <Link className="program-card" href={`/obrazovni-profili/${program.id}`}>
    <span className="program-card__photo">
      <Image src={program.image} alt={program.alt} fill sizes="(max-width: 560px) 90vw, (max-width: 1050px) 45vw, 23vw" />
      <span className="program-card__number">{program.number}</span>
    </span>
    <span className="program-card__content-stack">
      {(["sr", "en", "de"] as const).map((language) => <span className="program-card__content" key={language} aria-hidden={language !== locale || undefined}>
        <span className="program-card__eyebrow">{labels[language].profile}</span>
        <strong>{language === "sr" ? program.title : names[language]}</strong>
        <span className="program-card__description" lang="sr-Cyrl">{program.description}</span>
        <span className="program-card__link">{labels[language].details} <span aria-hidden="true">→</span></span>
      </span>)}
    </span>
  </Link>;
}
