import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSchool } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { aboutText, chromeText } from "@/lib/localization";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return {
    title: { absolute: `${aboutText[slug].section} — ${chromeText[slug].school} “Stevica Jovanović”` },
    description: aboutText[slug].description,
  };
}

export default async function TranslatedAboutPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return (
    <div lang={slug}>
      <SiteHeader locale={slug} />
      <main id="main">
        <AboutSchool locale={slug} />
      </main>
      <SiteFooter locale={slug} />
    </div>
  );
}
