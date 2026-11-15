import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ContactExtras, customSchoolPageSlugs, SchoolPage } from "@/components/school-pages";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { schoolEmail } from "@/lib/school-contact";
import { preferredLanguage } from "@/lib/language-preference";
import { TranslatedHome } from "@/components/translated-home";

type LinkItem = { title: string; href: string; description?: string };

type PageDefinition = {
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs?: string[];
  items?: string[];
  links?: LinkItem[];
  images?: { src: string; alt: string }[];
};

const pages: Record<string, PageDefinition> = {
  "o-skoli": {
    eyebrow: "Профил школе · Панчево",
    title: "Медицинска школа „Стевица Јовановић”",
    intro:
      "Основана је марта 1959. године одлуком Народног одбора Среза Панчево, у време када је развој здравствене службе тражио образоване медицинске сестре.",
    paragraphs: [
      "Иницијативу за отварање школе покренуо је директор болнице др Бора Дрндарски. Прва четворогодишња Медицинска школа отворена је 1960. године, а наставна база била је Општа болница.",
      "Школа данас образује ученике за област здравства и социјалне заштите. Настава повезује стручна знања, практичан рад и одговоран однос према пацијентима и заједници.",
    ],
    items: ["Основана 1959. године", "Налази се у Панчеву", "Образује здравствене раднике", "Негује хуманост и стручну одговорност"],
  },
  "obrazovni-profili": {
    eyebrow: "Средње стручно образовање",
    title: "Образовни профили",
    intro:
      "Медицинска школа „Стевица Јовановић” образује ученике за подручје рада здравства и социјалне заштите.",
    items: [
      "Медицинска сестра – техничар",
      "Медицинска сестра – васпитач",
      "Здравствени неговатељ",
      "Гинеколошко-акушерска сестра",
    ],
    paragraphs: [
      "Школовање повезује стручну наставу са вежбама у школским кабинетима и болничким одељењима. Ученици развијају знања и вештине потребне за одговоран рад у здравству.",
      "Информације о конкретним условима уписа и броју места објављују се у актуелном конкурсу за упис.",
    ],
    images: [
      { src: "/images/praktikum-5.jpg", alt: "Вежбе у школском кабинету" },
      { src: "/images/praktikum-20.jpg", alt: "Вежбање здравствене неге" },
      { src: "/images/praktikum-16.jpg", alt: "Ученица увежбава поступак здравствене неге" },
      { src: "/images/praktikum-18.jpg", alt: "Вежбе из гинеколошко-акушерске неге" },
    ],
  },
  "ucenici-i-roditelji": {
    eyebrow: "Сервисне информације",
    title: "Информације",
    intro:
      "На једном месту су важна обавештења, школски материјали и информације за ученике и родитеље.",
    links: [
      { title: "Распоред звоњења", href: "/informacije/raspored-zvonjenja" },
      { title: "Испитна питања", href: "/ispiti-i-materijali#ispitna-pitanja" },
      { title: "Матурска питања", href: "/ispiti-i-materijali#maturska-pitanja" },
      { title: "Распоред дежурства наставника", href: "/informacije/dezurstva-nastavnika" },
      { title: "Документација школе", href: "/dokumentacija" },
    ],
  },
  dokumentacija: {
    eyebrow: "Обрасци и прописи",
    title: "Документација",
    intro:
      "Документи које је школа објавила доступни су за преглед и преузимање.",
  },
  "zaposleni": {
    eyebrow: "Школа",
    title: "Запослени",
    intro:
      "Наставници и стручни сарадници воде образовни процес и подржавају ученике током школовања.",
    paragraphs: [
      "За актуелне податке о запосленима обратите се школи.",
    ],
  },
  "strucni-timovi": {
    eyebrow: "Подршка квалитету наставе",
    title: "Стручни тимови",
    intro:
      "Стручни тимови планирају, прате и унапређују образовни рад и подршку ученицима.",
    items: [
      "Тим за развојно планирање",
      "Тим за школски програм",
      "Тим за самовредновање и вредновање рада школе",
      "Тим за инклузивно образовање",
      "Тим за заштиту од насиља, злостављања и занемаривања",
      "Тим за подршку ученицима",
      "Тим за сарадњу са Црвеним крстом и хуманитарним организацијама",
      "Тим за каријерно вођење",
      "Тим за стручно усавршавање",
    ],
  },
  vesti: {
    eyebrow: "Актуелности",
    title: "Вести из школе",
    intro:
      "Обавештења, успеси ученика и активности Медицинске школе у Панчеву.",
  },
  kontakt: {
    eyebrow: "Медицинска школа · Панчево",
    title: "Контакт",
    intro: "Посетите нас на адреси Пастерова 2, 26101 Панчево.",
    links: [
      { title: "Директор школе · 013/333-883", href: "tel:+38113333883" },
      { title: "Секретар · 013/2511-772", href: "tel:+381132511772" },
      { title: "Зборница · 013/331-390", href: "tel:+38113331390" },
      { title: "Организатор наставе · 013/2156-306", href: "tel:+381132156306" },
      { title: schoolEmail, href: `mailto:${schoolEmail}` },
    ],
    paragraphs: ["Адреса: Пастерова 2, 26101 Панчево."],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "en" || slug === "de") return { title: slug === "en" ? "Medical School “Stevica Jovanović”" : "Medizinische Schule „Stevica Jovanović“" };
  const page = pages[slug];
  return page ? { title: slug === "o-skoli" ? "О школи" : page.title, description: page.intro } : {};
}

export default async function ContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ vesti?: string | string[] }>;
}) {
  const { slug } = await params;
  if (slug === "en" || slug === "de") return <TranslatedHome locale={slug} searchParams={searchParams} />;
  if (slug === "galerija") permanentRedirect("/");
  let page = pages[slug];
  let hasPublishedOverride = false;

  if (getSupabaseConfig()) {
    await connection();
    const supabase = await createClient();
    const { data: entry, error } = await supabase
      .from("content_entries")
      .select("title, excerpt, body")
      .in("kind", ["page", "program"])
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error("Садржај странице није могао да се учита из базе.");
    if (entry) {
      hasPublishedOverride = true;
      page = {
        eyebrow: "Медицинска школа · Панчево",
        title: entry.title,
        intro: entry.excerpt,
        paragraphs: entry.body.split(/\n\s*\n/).filter(Boolean),
      };
    }
  }

  if (!page) notFound();
  const showArchive = slug !== "dokumentacija" || await preferredLanguage() === "sr";

  return (
    <>
      <SiteHeader />
      <main id="main">
        {customSchoolPageSlugs.includes(slug) && !hasPublishedOverride ? <SchoolPage slug={slug} showArchive={showArchive} /> : (
          <>
        <section className="content-masthead">
          <div className="shell">
            <p className="eyebrow"><span className="eyebrow__dot" />{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
          </div>
        </section>
        <section className="content-body section">
          <div className="shell content-layout">
            <div className="content-main">
              {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {page.items && (
                <ul className="content-list">
                  {page.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {page.links && (
                <div className="content-links">
                  {page.links.map((item) => (
                    <a href={item.href} key={item.title} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                      <span><strong>{item.title}</strong>{item.description && <small>{item.description}</small>}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            {page.images && (
              <div className="content-gallery">
                {page.images.map((image) => (
                  <figure key={image.src}>
                    <Image src={image.src} alt={image.alt} width={760} height={520} />
                    <figcaption>{image.alt}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
        {slug === "kontakt" && <ContactExtras />}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
