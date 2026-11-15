import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { NewsEngagement } from "@/components/news-engagement";
import { ConsentNewsContent } from "@/components/consent-video";
import { LanguageText } from "@/components/language-size";
import { localizedNewsCategory } from "@/components/news-list";
import { consentNewsHtml, sizedConsentNewsHtml } from "@/lib/consent-news-html";
import { getNews, HOME_NEWS_LIMIT, importedArticle, importedNewsCategory, newsDate } from "@/lib/news";
import { newsTranslation } from "@/lib/news-translations";
import { newsIllustration } from "@/lib/news-illustration";
import { isNewsCategory, type NewsCategory } from "@/lib/news-categories";
import type { Locale } from "@/lib/localization";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import "@/app/news.css";

export async function requireRecentNews(slug: string, locale: Locale) {
  if (locale !== "sr" && !(await getNews(HOME_NEWS_LIMIT)).some((item) => item.href === `/vesti/${slug}`)) {
    redirect(`/${locale}/o-skoli`);
  }
}

export async function newsMetadata(slug: string, locale: Locale): Promise<Metadata> {
  await requireRecentNews(slug, locale);
  const imported = importedArticle(slug);
  if (imported) {
    const translation = locale === "sr" ? null : newsTranslation(imported, locale);
    const title = translation?.title ?? imported.title;
    const excerpt = translation?.excerpt ?? imported.excerpt;
    return {
      title,
      description: excerpt || undefined,
      openGraph: { type: "article", title, description: excerpt || undefined, publishedTime: imported.date },
    };
  }
  if (!getSupabaseConfig()) return {};
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.from("content_entries").select("title, excerpt, published_at")
    .eq("kind", "news").eq("status", "published").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Подаци за дељење вести нису могли да се учитају.");
  if (!data) return {};
  return {
    title: data.title,
    description: data.excerpt || undefined,
    openGraph: { type: "article", title: data.title, description: data.excerpt || undefined, publishedTime: data.published_at ?? undefined },
  };
}

const labels = {
  sr: { home: "Почетна", archive: "Архива вести", news: "Вести из школе", more: "Истражите још", latest: "Најновије вести", untranslated: "", attachments: "", videos: "" },
  en: { home: "Home", archive: "News archive", news: "School news", more: "Explore more", latest: "Latest news", untranslated: "This article is available in Serbian only.", attachments: "The attached documents are in Serbian.", videos: "The video is in Serbian." },
  de: { home: "Startseite", archive: "Nachrichtenarchiv", news: "Nachrichten aus der Schule", more: "Mehr entdecken", latest: "Aktuelle Nachrichten", untranslated: "Dieser Artikel ist nur auf Serbisch verfügbar.", attachments: "Die angehängten Dokumente sind auf Serbisch.", videos: "Das Video ist auf Serbisch." },
} as const;

export async function NewsArticle({ slug, locale }: { slug: string; locale: Locale }) {
  await requireRecentNews(slug, locale);
  const showArchive = locale === "sr";
  const text = labels[locale];
  const imported = importedArticle(slug);
  const translation = locale === "sr" ? null : newsTranslation(imported, locale);
  let title = imported?.title;
  let date: string | null = imported?.date ?? null;
  let paragraphs: string[] = [];
  let mediaUrl: string | null = null;
  let category: NewsCategory | null = imported ? importedNewsCategory(imported.id) : null;
  if (!imported) {
    await connection();
    if (!getSupabaseConfig()) notFound();
    const supabase = await createClient();
    const { data: entry, error } = await supabase.from("content_entries")
      .select("title, body, media_path, published_at, category")
      .eq("kind", "news").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw new Error("Вест није могла да се учита.");
    if (!entry) notFound();
    if (!entry.category || !isNewsCategory(entry.category)) throw new Error("Вест нема исправну категорију.");
    title = entry.title;
    category = entry.category;
    date = entry.published_at;
    paragraphs = String(entry.body ?? "").split(/\n\s*\n/).filter(Boolean);
    mediaUrl = entry.media_path ? supabase.storage.from("school-media").getPublicUrl(entry.media_path).data.publicUrl : null;
  }
  if (!title || !category) notFound();
  if (imported?.image && !imported.content.includes(imported.image.src)) mediaUrl = imported.image.src;
  if (!mediaUrl && !imported?.image) mediaUrl = newsIllustration(title, category);
  const displayTitle = translation?.title ?? title;
  const translations = { en: newsTranslation(imported, "en"), de: newsTranslation(imported, "de") };
  const bodyLanguage = locale !== "sr" && !translation ? "sr-Cyrl" : undefined;
  const home = locale === "sr" ? "/" : `/${locale}`;
  const newsHtml = imported ? (translations.en && translations.de
    ? sizedConsentNewsHtml(imported.content, locale, { en: translations.en.texts, de: translations.de.texts })
    : consentNewsHtml(imported.content, locale, translation?.texts)) : null;
  const titles = { sr: title, en: translations.en?.title ?? title, de: translations.de?.title ?? title };
  const titleLanguages = { en: translations.en ? "en" : "sr-Cyrl", de: translations.de ? "de" : "sr-Cyrl" };
  const values = (key: keyof typeof labels.sr) => ({ sr: labels.sr[key], en: labels.en[key], de: labels.de[key] });
  const formattedDate = (language: Locale) => date ? language === "sr" ? newsDate(date) : new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T12:00:00Z`)) : "";
  return (
    <div lang={locale === "sr" ? "sr-Cyrl" : locale}>
      <SiteHeader locale={locale} />
      <main id="main">
        <article className="school-news-article">
          <header className="school-news-article__header">
            <div className="shell">
              <div className="school-news-article__trail"><Link href={home}><LanguageText locale={locale} values={values("home")} /></Link>{showArchive ? <><span>/</span><Link href="/vesti">{text.archive}</Link></> : <span className="school-news-article__archive-placeholder" aria-hidden="true">/ <a>{labels.sr.archive}</a></span>}</div>
              <p className="eyebrow"><LanguageText locale={locale} values={{ sr: localizedNewsCategory(category, "sr"), en: localizedNewsCategory(category, "en"), de: localizedNewsCategory(category, "de") }} /></p>
              <h1><LanguageText locale={locale} values={titles} languages={titleLanguages} /></h1>
              <div className="school-news-article__meta"><span className="school-news-article__meta-label"><LanguageText locale={locale} values={values("news")} /></span>{date && <time dateTime={date}><LanguageText locale={locale} values={{ sr: formattedDate("sr"), en: formattedDate("en"), de: formattedDate("de") }} /></time>}</div>
            </div>
          </header>
          <div className="section">
            <div className="shell school-news-article__layout">
              <div className="school-news-article__body">
                {(!translations.en || !translations.de) && <p className="source-note" aria-hidden={locale === "sr" || undefined}><LanguageText locale={locale} values={{ sr: "", en: translations.en ? "" : labels.en.untranslated, de: translations.de ? "" : labels.de.untranslated }} /></p>}
                {imported?.content.includes("/skolski-materijali/") && <p className="source-note" aria-hidden={locale === "sr" || undefined}><LanguageText locale={locale} values={values("attachments")} /></p>}
                {imported?.content.includes("<iframe") && <p className="source-note" aria-hidden={locale === "sr" || undefined}><LanguageText locale={locale} values={values("videos")} /></p>}
                {mediaUrl && (
                  <Image className="school-news-article__cover" src={mediaUrl} alt="" width={900} height={600} sizes="(max-width: 800px) 90vw, 65vw" />
                )}
                <div lang={bodyLanguage}>{newsHtml !== null ? <ConsentNewsContent html={newsHtml} /> :
                  paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}</div>
              </div>
              <aside className="school-news-article__aside">
                <NewsEngagement slug={slug} title={displayTitle} locale={locale} />
                <div className="school-news-article__related"><p className="eyebrow"><LanguageText locale={locale} values={values("more")} /></p><Link href={`${home}#vesti`}><LanguageText locale={locale} values={values("latest")} /> <span aria-hidden="true">→</span></Link>{showArchive ? <Link href="/vesti">{text.archive} <span aria-hidden="true">→</span></Link> : <a className="school-news-article__archive-placeholder" aria-hidden="true">{labels.sr.archive} <span>→</span></a>}</div>
              </aside>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
