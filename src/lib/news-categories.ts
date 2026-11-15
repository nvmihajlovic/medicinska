export const newsCategories = [
  { id: "obavestenja", label: "Обавештења" },
  { id: "nastava-i-ispiti", label: "Настава и испити" },
  { id: "takmicenja-i-uspesi", label: "Такмичења и успеси" },
  { id: "projekti-i-saradnja", label: "Пројекти и сарадња" },
  { id: "humanitarne-akcije", label: "Хуманитарне акције" },
  { id: "skolski-zivot", label: "Школски живот" },
] as const;

export type NewsCategory = (typeof newsCategories)[number]["id"];

export function isNewsCategory(value: string): value is NewsCategory {
  return newsCategories.some((category) => category.id === value);
}

export function newsCategoryLabel(value: NewsCategory) {
  const category = newsCategories.find((item) => item.id === value);
  if (!category) throw new Error(`Непозната категорија вести: ${value}`);
  return category.label;
}
