import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/school-pages";
import { NewsCard, NewsPagination } from "@/components/news-list";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getNews, HOME_NEWS_LIMIT, pageNumber } from "@/lib/news";
import { archivePageHref, filterArchiveNews, type ArchiveFilters } from "@/lib/news-search";
import { isNewsCategory, newsCategories } from "@/lib/news-categories";
import { withNewsViews } from "@/lib/news-engagement";
import { preferredLanguage } from "@/lib/language-preference";
import "../news.css";

export const metadata = { title: "Архива вести" };

type SearchParams = { q?: string | string[]; godina?: string | string[]; mesec?: string | string[]; kategorija?: string | string[]; redosled?: string | string[]; strana?: string | string[] };

const months = ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"];

export default async function NewsArchive({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const locale = await preferredLanguage();
  if (locale !== "sr") redirect(`/${locale}/o-skoli`);
  const entries = (await getNews()).slice(HOME_NEWS_LIMIT);
  const years = [...new Set(entries.flatMap((entry) => entry.date ? [entry.date.slice(0, 4)] : []))].sort().reverse();
  const params = await searchParams;
  const errors: string[] = [];
  function value(input: string | string[] | undefined, label: string) {
    if (Array.isArray(input)) {
      errors.push(`Филтер „${label}” је задат више пута.`);
      return "";
    }
    return input?.trim() ?? "";
  }
  const query = value(params.q, "претрага");
  const year = value(params.godina, "година");
  const month = value(params.mesec, "месец");
  const category = value(params.kategorija, "категорија");
  const order = value(params.redosled, "редослед");
  if (year && !years.includes(year)) errors.push("Изабрана година није доступна у архиви.");
  if (month && !/^(0[1-9]|1[0-2])$/.test(month)) errors.push("Изабрани месец није исправан.");
  if (category && !isNewsCategory(category)) errors.push("Изабрана категорија није исправна.");
  if (order && order !== "najnovije" && order !== "najstarije") errors.push("Изабрани редослед није исправан.");
  const filters: ArchiveFilters = {
    query,
    year: years.includes(year) ? year : "",
    month: /^(0[1-9]|1[0-2])$/.test(month) ? month : "",
    category: isNewsCategory(category) ? category : "",
    order: order === "najstarije" ? "oldest" : "newest",
  };
  const matches = filterArchiveNews(entries, filters);
  const pages = Math.ceil(matches.length / 12);
  const page = pageNumber(params.strana, pages);
  const displayed = await withNewsViews(matches.slice((page - 1) * 12, page * 12));
  const filtered = Boolean(filters.query || filters.year || filters.month || filters.category || filters.order === "oldest");
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHeading section="Архива вести" title="Архива вести" description="Раније објаве, активности и успеси Медицинске школе у Панчеву." />
        <section className="section school-news-archive">
          <div className="shell">
            <form className="archive-search" action="/vesti" method="get" role="search" key={archivePageHref(filters, page)}>
              <div className="archive-search__heading"><div><p className="eyebrow">Пронађите објаву</p><h2>Претрага архиве</h2></div><p>Претражите наслове и сажетке, ћирилицом или латиницом.</p></div>
              <div className="archive-search__fields">
                <label className="archive-search__query">Појам<input type="search" name="q" defaultValue={filters.query} placeholder="На пример: такмичење" /></label>
                <label>Година<select name="godina" defaultValue={filters.year}><option value="">Све године</option>{years.map((item) => <option value={item} key={item}>{item}.</option>)}</select></label>
                <label>Месец<select name="mesec" defaultValue={filters.month}><option value="">Сви месеци</option>{months.map((name, index) => <option value={String(index + 1).padStart(2, "0")} key={name}>{name}</option>)}</select></label>
                <label>Категорија<select name="kategorija" defaultValue={filters.category}><option value="">Све категорије</option>{newsCategories.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
                <label>Редослед<select name="redosled" defaultValue={filters.order === "oldest" ? "najstarije" : "najnovije"}><option value="najnovije">Најновије прво</option><option value="najstarije">Најстарије прво</option></select></label>
              </div>
              <div className="archive-search__actions">
                <button type="submit">Претражи <span aria-hidden="true">→</span></button>
                {/* A full navigation also clears unsubmitted input values. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/vesti">Обриши филтере</a>
              </div>
              {errors.length > 0 && <div className="archive-search__error" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
            </form>
            <div className="school-news-archive__heading"><div><p className="eyebrow">Живот и рад школе</p><h2>Претходне објаве</h2><p className="school-news-archive__scope">У архиви су старије вести; најновијих {HOME_NEWS_LIMIT} налази се на <Link href="/#vesti">почетној страници</Link>.</p></div><p aria-live="polite">{filtered ? `Пронађено: ${matches.length} од ${entries.length} вести` : `${entries.length} вести у архиви`}</p></div>
            <div className="news-grid">
              {displayed.map((item) => <NewsCard item={item} key={item.href} />)}
            </div>
            {!displayed.length && <p className="news-empty">{filtered ? "Нема вести које одговарају задатим критеријумима." : "Тренутно нема старијих објава у архиви."}</p>}
            <NewsPagination page={page} pages={pages} href={(number) => archivePageHref(filters, number)} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
