import { redirect } from "next/navigation";
import { NewsArticle, newsMetadata, requireRecentNews } from "@/components/news-article";
import { preferredLanguage } from "@/lib/language-preference";

type Props = { params: Promise<{ slug: string }> };

async function selectedSlug(params: Props["params"]) {
  const { slug } = await params;
  const locale = await preferredLanguage();
  if (locale !== "sr") {
    await requireRecentNews(slug, locale);
    redirect(`/${locale}/vesti/${slug}`);
  }
  return slug;
}

export async function generateMetadata({ params }: Props) {
  return newsMetadata(await selectedSlug(params), "sr");
}

export default async function Page({ params }: Props) {
  return <NewsArticle slug={await selectedSlug(params)} locale="sr" />;
}
