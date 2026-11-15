import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InformationPage, getInformationPage } from "@/components/information-page";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { chromeText } from "@/lib/localization";

type Props = { params: Promise<{ slug: string; stranica: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, stranica } = await params;
  if (slug !== "en" && slug !== "de") return {};
  const page = getInformationPage(stranica, slug);
  return page ? { title: page.title, description: page.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug, stranica } = await params;
  if ((slug !== "en" && slug !== "de") || !getInformationPage(stranica, slug)) notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <p className="translation-notice">{chromeText[slug].unavailable}</p>
    <InformationPage stranica={stranica} locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
