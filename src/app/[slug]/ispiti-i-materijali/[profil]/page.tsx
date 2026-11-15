import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TranslatedExamPage } from "@/components/translated-exams";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { examPrograms, examText } from "@/lib/exam-text";

type Props = { params: Promise<{ slug: string; profil: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, profil } = await params;
  if ((slug !== "en" && slug !== "de") || !Object.prototype.hasOwnProperty.call(examPrograms, profil)) return {};
  return { title: `${examText[slug].title} — ${examPrograms[profil][slug]}`, description: examText[slug].pageDescription };
}
export default async function Page({ params }: Props) {
  const { slug, profil } = await params;
  if ((slug !== "en" && slug !== "de") || !Object.prototype.hasOwnProperty.call(examPrograms, profil)) notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <TranslatedExamPage locale={slug} profil={profil} />
  </main><SiteFooter locale={slug} /></div>;
}
