import { connection } from "next/server";
import { HealthCalendar } from "@/components/health-calendar";
import { HomeHero } from "@/components/home-hero";
import { HomeSections } from "@/components/home-sections";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getNews, HOME_NEWS_LIMIT, pageNumber } from "@/lib/news";
import { withNewsViews } from "@/lib/news-engagement";
import { belgradeDate } from "@/lib/health-calendar";
import { preferredLanguage } from "@/lib/language-preference";
import "./news.css";

export default async function Home({ searchParams }: { searchParams: Promise<{ vesti?: string | string[] }> }) {
  await connection();
  const showArchive = await preferredLanguage() === "sr";
  const recent = await getNews(HOME_NEWS_LIMIT);
  const pages = Math.ceil(recent.length / 6);
  const currentPage = pageNumber((await searchParams).vesti, pages);
  const latest = await withNewsViews(recent.slice((currentPage - 1) * 6, currentPage * 6));

  return <>
    <SiteHeader />
    <main id="main" className="home">
      <div className="hero-area">
        <HomeHero locale="sr" />
        <HealthCalendar initialDate={belgradeDate(new Date())} />
      </div>
      <HomeSections locale="sr" latest={latest} currentPage={currentPage} pages={pages} showArchive={showArchive} />
    </main>
    <SiteFooter />
  </>;
}
