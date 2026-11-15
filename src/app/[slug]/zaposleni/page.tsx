import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Staff } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { chromeText } from "@/lib/localization";
import { staffText } from "@/lib/staff-text";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: staffText[slug].title, description: staffText[slug].description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <p className="translation-notice">{chromeText[slug].unavailable}</p>
    <Staff locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
