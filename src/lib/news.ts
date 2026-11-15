import { connection } from "next/server";
import importedNews from "@/data/news.json";
import importedCategories from "@/data/news-categories.json";
import { isNewsCategory, type NewsCategory } from "@/lib/news-categories";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const HOME_NEWS_LIMIT = 30;

export type NewsItem = {
  title: string;
  excerpt: string;
  date: string | null;
  href: string;
  image: { src: string; alt: string } | null;
  category: NewsCategory;
  engagementKey: string;
  views: number | null;
  likes: number | null;
};

const categoriesById: Record<string, string> = importedCategories;

export function importedNewsCategory(id: number): NewsCategory {
  const category: string | undefined = categoriesById[String(id)];
  if (!category || !isNewsCategory(category)) throw new Error(`Недостаје категорија вести ${id}.`);
  return category;
}

export function newsDate(date: string | null) {
  return date ? new Intl.DateTimeFormat("sr-RS", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T12:00:00Z`)) : "";
}

export function importedArticle(slug: string) {
  const match = /^objava-(\d+)$/.exec(slug);
  return match ? importedNews.find((entry) => entry.id === Number(match[1])) : undefined;
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const items: NewsItem[] = importedNews.map((entry) => ({
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.date,
    href: `/vesti/objava-${entry.id}`,
    image: entry.image,
    category: importedNewsCategory(entry.id),
    engagementKey: `archive-${entry.id}`,
    views: null,
    likes: null,
  }));
  if (getSupabaseConfig()) {
    await connection();
    const supabase = await createClient();
    let query = supabase
      .from("content_entries")
      .select("id, slug, title, excerpt, media_path, published_at, category")
      .eq("kind", "news")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (limit !== undefined) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw new Error("Вести нису могле да се учитају из базе.");
    items.push(...(data ?? []).map((entry) => {
      if (!entry.category || !isNewsCategory(entry.category)) throw new Error(`Вест нема исправну категорију: ${entry.slug}`);
      return {
      title: entry.title,
      excerpt: entry.excerpt,
      date: entry.published_at,
      href: `/vesti/${entry.slug}`,
      image: entry.media_path ? { src: supabase.storage.from("school-media").getPublicUrl(entry.media_path).data.publicUrl, alt: "" } : null,
      category: entry.category,
      engagementKey: `entry-${entry.id}`,
      views: null,
      likes: null,
    };
    }));
  }
  items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return limit === undefined ? items : items.slice(0, limit);
}

export function pageNumber(value: string | string[] | undefined, pages: number) {
  const number = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
  return Number.isSafeInteger(number) ? Math.min(number, Math.max(1, pages)) : 1;
}
