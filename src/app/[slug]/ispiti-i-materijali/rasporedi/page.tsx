import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamSchedulesContent } from "@/components/exam-schedules-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { examScheduleText } from "@/lib/exam-text";
import { chromeText } from "@/lib/localization";
import "@/app/academic.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: examScheduleText[slug].title, description: examScheduleText[slug].description };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <p className="translation-notice">{chromeText[slug].unavailable}</p>
    <ExamSchedulesContent locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
