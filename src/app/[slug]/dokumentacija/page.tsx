import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Documents } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { documentText } from "@/lib/document-text";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: documentText[slug].title, description: documentText[slug].description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <Documents locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
