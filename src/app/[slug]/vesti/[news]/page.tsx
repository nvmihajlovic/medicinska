import { notFound } from "next/navigation";
import { NewsArticle, newsMetadata } from "@/components/news-article";

type Props = { params: Promise<{ slug: string; news: string }> };

async function values(params: Props["params"]): Promise<{ locale: "en" | "de"; news: string }> {
  const { slug, news } = await params;
  if (slug !== "en" && slug !== "de") notFound();
  return { locale: slug, news };
}

export async function generateMetadata({ params }: Props) {
  const { locale, news } = await values(params);
  return newsMetadata(news, locale);
}

export default async function Page({ params }: Props) {
  const { locale, news } = await values(params);
  return <NewsArticle slug={news} locale={locale} />;
}
