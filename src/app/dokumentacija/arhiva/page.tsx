import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import attachments from "@/data/news-attachments.json";
import { documentFormat } from "@/lib/academic";
import { preferredLanguage } from "@/lib/language-preference";
import "../../academic.css";

export const metadata = { title: "Архива прилога из школских објава" };

const years = [...new Set(attachments.entries.map((entry) => entry.date.slice(0, 4)))].sort().reverse();

function attachmentPath(path: string) {
  if (!path.startsWith("public/skolski-materijali/")) {
    throw new Error(`Неисправна путања школског прилога: ${path}`);
  }
  return `/${path.slice("public/".length)}`;
}

export default async function AttachmentsArchive() {
  const locale = await preferredLanguage();
  if (locale !== "sr") redirect(`/${locale}/dokumentacija`);
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHeading section="Документација" sectionHref="/dokumentacija" title="Архива школских прилога" description="Документи и прилози објављени уз ранија обавештења и вести школе." />
        <section className="section">
          <div className="shell academic-exams__layout">
            <aside><p className="eyebrow">Школске објаве</p><h2>Прилози по годинама</h2><p className="academic-muted">Ови прилози преузети су из старијих објава и односе се на наведене датуме.</p><Link className="school-page-link" href="/dokumentacija">Документација школе <span aria-hidden="true">→</span></Link></aside>
            <div>
              {years.map((year, index) => (
                <details className="document-group" key={year} open={index === 0 ? true : undefined}>
                  <summary><span>{year}. година</span><span>{attachments.entries.filter((entry) => entry.date.startsWith(year)).length} <span aria-hidden="true">+</span></span></summary>
                  {attachments.entries.filter((entry) => entry.date.startsWith(year)).map((entry) => (
                    <article className="academic-schedule" key={entry.source}>
                      <time dateTime={entry.date.slice(0, 10)}>{new Intl.DateTimeFormat("sr-RS", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${entry.date.slice(0, 10)}T00:00:00Z`))}</time>
                      <h3>{entry.title}</h3>
                      {entry.links.map((link, index) => <a key={link.url} href={attachmentPath(link.path)}>{link.title && link.title !== "Преузми" ? link.title : `Прилог ${index + 1}`} · {documentFormat(link.url)} <span aria-hidden="true">↓</span></a>)}
                    </article>
                  ))}
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
