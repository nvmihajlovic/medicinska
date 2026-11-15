import Link from "next/link";
import Image from "next/image";
import { importedArticle, newsDate, type NewsItem } from "@/lib/news";
import { newsCategories, newsCategoryLabel } from "@/lib/news-categories";
import { newsIllustration } from "@/lib/news-illustration";
import { newsTranslation } from "@/lib/news-translations";
import type { Locale } from "@/lib/localization";

const labels = {
  en: { categories: ["Announcements", "Teaching and exams", "Competitions and achievements", "Projects and cooperation", "Humanitarian activities", "School life"], read: "Read news", views: "views", unavailable: "Views unavailable", pages: "News pages", previous: "Previous page", next: "Next page" },
  de: { categories: ["Bekanntmachungen", "Unterricht und Prüfungen", "Wettbewerbe und Erfolge", "Projekte und Zusammenarbeit", "Humanitäre Aktionen", "Schulleben"], read: "Nachricht lesen", views: "Aufrufe", unavailable: "Aufrufe nicht verfügbar", pages: "Nachrichtenseiten", previous: "Vorherige Seite", next: "Nächste Seite" },
} as const;

export function localizedNewsCategory(category: NewsItem["category"], locale: Locale) {
  const result = locale === "sr" ? newsCategoryLabel(category) : labels[locale].categories[newsCategories.findIndex((entry) => entry.id === category)];
  if (!result) throw new Error(`Непозната категорија вести: ${category}`);
  return result;
}

type NewsTranslation = { title: string; excerpt: string } | null;

function NewsCardBody({ item, locale, translation, hidden }: { item: NewsItem; locale: Locale; translation: NewsTranslation; hidden: boolean }) {
  const text = locale === "sr" ? null : labels[locale];
  const category = localizedNewsCategory(item.category, locale);
  const href = locale === "sr" ? item.href : `/${locale}${item.href}`;
  const title = translation?.title ?? item.title;
  const excerpt = translation?.excerpt ?? item.excerpt;
  return <div className="school-news-card__body" aria-hidden={hidden || undefined} lang={locale}>
    <div className="school-news-card__meta"><span>{category}</span>{item.date && <time dateTime={item.date}>{locale === "sr" ? newsDate(item.date) : new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${item.date.slice(0, 10)}T12:00:00Z`))}</time>}</div>
    <h3 lang={text && !translation ? "sr" : undefined}>{hidden ? title : <Link href={href}>{title}</Link>}</h3>
    {excerpt && <p lang={text && !translation ? "sr" : undefined}>{excerpt}</p>}
    <div className="school-news-card__footer">
      {hidden ? <span className="school-news-card__link">{text?.read ?? "Прочитај вест"} <span aria-hidden="true">→</span></span> : <Link className="school-news-card__link" href={href} aria-label={`${text?.read ?? "Прочитај вест"}: ${title}`}>{text?.read ?? "Прочитај вест"} <span aria-hidden="true">→</span></Link>}
      <span className="school-news-card__views">{item.views === null ? text?.unavailable ?? "Прегледи нису доступни" : `${item.views.toLocaleString(locale === "sr" ? "sr-RS" : locale)} ${text?.views ?? "прегледа"}`}</span>
    </div>
  </div>;
}

export function NewsCard({ item, locale = "sr", matchLanguages = false }: { item: NewsItem; locale?: Locale; matchLanguages?: boolean }) {
  const article = matchLanguages || locale !== "sr" ? importedArticle(item.href.slice("/vesti/".length)) : undefined;
  const translations = { sr: null, en: newsTranslation(article, "en"), de: newsTranslation(article, "de") };
  const href = locale === "sr" ? item.href : `/${locale}${item.href}`;
  return (
    <article className="school-news-card">
      <Link className="school-news-card__image" href={href} tabIndex={-1} aria-hidden="true">
        <Image src={item.image?.src ?? newsIllustration(item.title, item.category)} alt="" fill sizes="(max-width: 560px) 90vw, (max-width: 800px) 45vw, 30vw" />
      </Link>
      {matchLanguages ? <div className="school-news-card__body-stack">
        {(["sr", "en", "de"] as const).map((language) => <NewsCardBody key={language} item={item} locale={language} translation={translations[language]} hidden={language !== locale} />)}
      </div> : <NewsCardBody item={item} locale={locale} translation={translations[locale]} hidden={false} />}
    </article>
  );
}

export function NewsPagination({ page, pages, href, locale = "sr" }: { page: number; pages: number; href: (page: number) => string; locale?: Locale }) {
  const text = locale === "sr" ? null : labels[locale];
  if (pages <= 1) return null;
  const visible = Array.from({ length: pages }, (_, index) => index + 1).filter((number) =>
    number === 1 || number === pages || Math.abs(number - page) <= 1);
  return (
    <nav className="news-pagination" aria-label={text?.pages ?? "Странице вести"}>
      {page > 1 && <Link href={href(page - 1)} aria-label={text?.previous ?? "Претходна страница"}>←</Link>}
      {visible.map((number, index) => (
        <span key={number}>
          {index > 0 && number - visible[index - 1] > 1 && <span className="news-pagination__dots" aria-hidden="true">…</span>}
          <Link href={href(number)} aria-current={number === page ? "page" : undefined}>{number}</Link>
        </span>
      ))}
      {page < pages && <Link href={href(page + 1)} aria-label={text?.next ?? "Следећа страница"}>→</Link>}
    </nav>
  );
}
