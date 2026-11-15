import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErasmusContent } from "@/components/erasmus-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { erasmusText } from "@/lib/erasmus-text";
import { chromeText } from "@/lib/localization";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: slug === "en" ? "Erasmus+ projects" : "Erasmus+-Projekte", description: erasmusText[slug].description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main" className="erasmus-page">
    <p className="translation-notice">{chromeText[slug].unavailable}</p>
    <ErasmusContent locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
