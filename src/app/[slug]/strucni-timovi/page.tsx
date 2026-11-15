import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Teams } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { chromeText, teamsText } from "@/lib/localization";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return {
    title: { absolute: `${teamsText[slug].title} — ${chromeText[slug].school} “Stevica Jovanović”` },
    description: teamsText[slug].description,
  };
}

export default async function TranslatedTeamsPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return (
    <div lang={slug}>
      <SiteHeader locale={slug} />
      <main id="main">
        <Teams locale={slug} />
      </main>
      <SiteFooter locale={slug} />
    </div>
  );
}
