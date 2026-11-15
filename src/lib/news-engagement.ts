import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { importedArticle, type NewsItem } from "@/lib/news";

export function engagementClient() {
  const config = getSupabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!config || !serviceKey) return null;
  return createSupabaseClient(config.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function resolveNewsKey(slug: string) {
  const imported = importedArticle(slug);
  if (imported) return `archive-${imported.id}`;

  const client = engagementClient();
  if (!client) return null;
  const { data, error } = await client.from("content_entries").select("id")
    .eq("kind", "news").eq("status", "published").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Вест није могла да се провери у бази.", { cause: error });
  return data ? `entry-${data.id}` : null;
}

export async function withNewsViews(entries: NewsItem[]) {
  const client = engagementClient();
  if (!client || !entries.length) return entries;
  const { data, error } = await client.from("news_engagement")
    .select("news_key, views").in("news_key", entries.map((entry) => entry.engagementKey));
  if (error) {
    console.error("Бројеви прегледа вести нису доступни.", error);
    return entries;
  }
  const counts = new Map((data ?? []).map((item) => [item.news_key, Number(item.views)]));
  return entries.map((entry) => ({ ...entry, views: counts.get(entry.engagementKey) ?? 0 }));
}
