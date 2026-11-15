import type { NewsCategory } from "./news-categories";

const illustrations: Record<NewsCategory, string> = {
  "obavestenja": "/images/news/obavestenja.svg",
  "nastava-i-ispiti": "/images/news/nastava.svg",
  "takmicenja-i-uspesi": "/images/news/takmicenja.svg",
  "projekti-i-saradnja": "/images/news/saradnja.svg",
  "humanitarne-akcije": "/images/news/humanitarno.svg",
  "skolski-zivot": "/images/news/skola.svg",
};

export function newsIllustration(title: string, category: NewsCategory): string {
  if (/распоред|raspored|испит|ispit/i.test(title)) return "/images/news/raspored.svg";
  return illustrations[category];
}
