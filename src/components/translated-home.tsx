import { connection } from "next/server";
import { HealthCalendar } from "@/components/health-calendar";
import { HomeHero } from "@/components/home-hero";
import { HomeSections } from "@/components/home-sections";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { belgradeDate } from "@/lib/health-calendar";
import { chromeText } from "@/lib/localization";
import { getNews, HOME_NEWS_LIMIT, pageNumber } from "@/lib/news";
import { withNewsViews } from "@/lib/news-engagement";
import "@/app/news.css";

export async function TranslatedHome({ locale, searchParams }: { locale: "en" | "de"; searchParams: Promise<{ vesti?: string | string[] }> }) {
  await connection();
  const recent = await getNews(HOME_NEWS_LIMIT);
  const pages = Math.ceil(recent.length / 6);
  const currentPage = pageNumber((await searchParams).vesti, pages);
  const latest = await withNewsViews(recent.slice((currentPage - 1) * 6, currentPage * 6));

  return <div lang={locale}>
    <SiteHeader locale={locale} />
    <main id="main" className="home">
      <p className="translation-notice">{chromeText[locale].unavailable}</p>
      <div className="hero-area">
        <HomeHero locale={locale} />
        <HealthCalendar locale={locale} initialDate={belgradeDate(new Date())} />
      </div>
      <HomeSections locale={locale} latest={latest} currentPage={currentPage} pages={pages} showArchive={false} />
    </main>
    <SiteFooter locale={locale} />
  </div>;
}
