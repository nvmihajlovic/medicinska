import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Programs } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { programmeText } from "@/lib/program-text";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return { title: programmeText[slug].title, description: programmeText[slug].description };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return <div lang={slug}><SiteHeader locale={slug} /><main id="main">
    <Programs locale={slug} />
  </main><SiteFooter locale={slug} /></div>;
}
