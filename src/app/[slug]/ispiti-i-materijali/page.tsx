import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TranslatedExamIndex } from "@/components/translated-exams";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { examText } from "@/lib/exam-text";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: examText[slug].title, description: examText[slug].description };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <TranslatedExamIndex locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
