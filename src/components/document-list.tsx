import { Fragment } from "react";
import { LanguageText } from "@/components/language-size";
import { documentPath } from "@/lib/academic";
import { documentText, documentTitles } from "@/lib/document-text";
import type { Locale } from "@/lib/localization";

const translatedDocuments: Record<string, string> = {
  "/skolski-materijali/document-6f1799a7858bd44e.docx": "enhanced-educational-work.txt",
  "/skolski-materijali/document-71a5961b3aebad5d.docx": "community-humanitarian-work.txt",
};

export function DocumentList({ documents, locale = "sr", titles = documentTitles, matchLanguages = false }: { documents: { title: string; url: string }[]; locale?: Locale; titles?: Record<string, { en: string; de: string }>; matchLanguages?: boolean }) {
  return (
    <div className="document-list">
      {documents.map((document) => {
        const translation = Object.prototype.hasOwnProperty.call(titles, document.title) ? titles[document.title] : null;
        const title = locale !== "sr" ? translation?.[locale] : null;
        const path = documentPath(document.url);
        const translatedFile = translatedDocuments[path];
        const original = document.title.replace(/([^\d])-(?=[^\d])/g, "$1 ");
        const titleValues = { sr: original, en: translation?.en ?? original, de: translation?.de ?? original };
        return (
          <Fragment key={document.url}>
            <a href={path} className="document-list__item" download>
              <span lang={title ? undefined : "sr"}>{matchLanguages ? <LanguageText locale={locale} values={titleValues} languages={translation ? undefined : { en: "sr", de: "sr" }} /> : title ?? original}</span>
              <span>{matchLanguages ? <LanguageText locale={locale} values={{ sr: "Преузми документа", en: documentText.en.download, de: documentText.de.download }} /> : locale === "sr" ? "Преузми документа" : documentText[locale].download} <span aria-hidden="true">↓</span></span>
            </a>
            {translatedFile && locale !== "sr" && <a href={`/dokumenti-prevodi/${locale}/${translatedFile}`} className="document-list__item" download>
              <span>{matchLanguages ? <LanguageText locale={locale} values={{ sr: "", en: translation?.en ?? "", de: translation?.de ?? "" }} /> : title}</span>
              <span>{matchLanguages ? <LanguageText locale={locale} values={{ sr: "", en: documentText.en.translationDownload, de: documentText.de.translationDownload }} /> : documentText[locale].translationDownload} <span aria-hidden="true">↓</span></span>
            </a>}
            {translatedFile && locale === "sr" && matchLanguages && <span className="document-list__item" aria-hidden="true">
              <span><LanguageText locale={locale} values={{ sr: "", en: translation?.en ?? "", de: translation?.de ?? "" }} /></span>
              <span><LanguageText locale={locale} values={{ sr: "", en: documentText.en.translationDownload, de: documentText.de.translationDownload }} /> <span>↓</span></span>
            </span>}
          </Fragment>
        );
      })}
    </div>
  );
}
