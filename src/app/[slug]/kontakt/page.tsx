import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { contactText } from "@/lib/contact-text";
import { chromeText } from "@/lib/localization";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") return {};
  return {
    title: { absolute: `${contactText[slug].title} — ${chromeText[slug].school} “Stevica Jovanović”` },
    description: contactText[slug].description,
  };
}

export default async function TranslatedContactPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return (
    <div lang={slug}>
      <SiteHeader locale={slug} />
      <main id="main">
        <p className="translation-notice">{chromeText[slug].unavailable}</p>
        <Contact locale={slug} />
      </main>
      <SiteFooter locale={slug} />
    </div>
  );
}
