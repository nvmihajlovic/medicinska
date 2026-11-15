import type { NewsItem } from "./news";
import type { NewsCategory } from "./news-categories";

export type ArchiveFilters = {
  query: string;
  year: string;
  month: string;
  category: NewsCategory | "";
  order: "newest" | "oldest";
};

const cyrillic: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "dj", е: "e", ж: "z",
  з: "z", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n",
  њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ћ: "c", у: "u",
  ф: "f", х: "h", ц: "c", ч: "c", џ: "dz", ш: "s",
};

function searchable(value: string) {
  return value.toLowerCase()
    .replace(/[а-яђјљњћџ]/g, (letter) => cyrillic[letter] ?? letter)
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function filterArchiveNews(entries: NewsItem[], filters: ArchiveFilters) {
  const terms = searchable(filters.query).trim().split(/\s+/).filter(Boolean);
  const matches = entries.filter((entry) => {
    const text = searchable(`${entry.title} ${entry.excerpt}`);
    return terms.every((term) => text.includes(term)) &&
      (!filters.year || entry.date?.slice(0, 4) === filters.year) &&
      (!filters.month || entry.date?.slice(5, 7) === filters.month) &&
      (!filters.category || entry.category === filters.category);
  });

  if (filters.order === "oldest") {
    matches.sort((a, b) => {
      if (!a.date) return b.date ? 1 : 0;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }
  return matches;
}

export function archivePageHref(filters: ArchiveFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.year) params.set("godina", filters.year);
  if (filters.month) params.set("mesec", filters.month);
  if (filters.category) params.set("kategorija", filters.category);
  if (filters.order === "oldest") params.set("redosled", "najstarije");
  if (page > 1) params.set("strana", String(page));
  const query = params.toString();
  return query ? `/vesti?${query}` : "/vesti";
}
