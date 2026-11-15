import { PageHeading } from "@/components/school-pages";
import { LegalLayout } from "@/components/legal-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { chromeText } from "@/lib/localization";
import { legalHeadings, type LegalPageKind } from "@/lib/legal-text";
import "./legal-pages.css";

export function TranslatedLegalPage({ page, locale }: { page: LegalPageKind; locale: "en" | "de" }) {
  const headings = legalHeadings(page);
  return <div lang={locale}>
    <SiteHeader locale={locale} />
    <main id="main">
      <p className="translation-notice">{chromeText[locale].unavailable}</p>
      <PageHeading locale={locale} {...headings[locale]} variants={headings} />
      <LegalLayout page={page} locale={locale} />
    </main>
    <SiteFooter locale={locale} />
  </div>;
}
