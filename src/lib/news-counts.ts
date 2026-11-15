import type { Locale } from "@/lib/localization";

const pluralRules = {
  sr: new Intl.PluralRules("sr"),
  en: new Intl.PluralRules("en"),
  de: new Intl.PluralRules("de"),
};

const countLabels = {
  sr: {
    views: { one: "преглед", few: "прегледа", other: "прегледа" },
    likes: { one: "лајк", few: "лајка", other: "лајкова" },
  },
  en: {
    views: { one: "view", other: "views" },
    likes: { one: "like", other: "likes" },
  },
  de: {
    views: { one: "Aufruf", other: "Aufrufe" },
    likes: { one: "Gefällt mir", other: "Gefällt mir" },
  },
} as const;

export function formatNewsCount(count: number, kind: "views" | "likes", locale: Locale) {
  const form = pluralRules[locale].select(count);
  const labels: Partial<Record<Intl.LDMLPluralRule, string>> = countLabels[locale][kind];
  return `${count.toLocaleString(locale === "sr" ? "sr-RS" : locale)} ${labels[form] ?? labels.other}`;
}
