import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TranslatedLegalPage } from "@/components/translated-legal-page";
import { legalText, type LegalPageKind } from "@/lib/legal-text";

const pages: Record<string, LegalPageKind> = {
  "uslovi-koriscenja": "terms",
  privatnost: "privacy",
  kolacici: "cookies",
};

function getPage(path: string) {
  return Object.prototype.hasOwnProperty.call(pages, path) ? pages[path] : undefined;
}

type Props = { params: Promise<{ slug: string; legal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, legal } = await params;
  const page = getPage(legal);
  if ((slug !== "en" && slug !== "de") || !page) return {};
  const { title, description } = legalText[slug].pages[page];
  return { title, description };
}

export default async function Page({ params }: Props) {
  const { slug, legal } = await params;
  const page = getPage(legal);
  if ((slug !== "en" && slug !== "de") || !page) notFound();
  return <TranslatedLegalPage page={page} locale={slug} />;
}
