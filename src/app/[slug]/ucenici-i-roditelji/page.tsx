import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Students } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { informationText } from "@/lib/information-text";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: informationText[slug].title, description: informationText[slug].description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <Students locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
