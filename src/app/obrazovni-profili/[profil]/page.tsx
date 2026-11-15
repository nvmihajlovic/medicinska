import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading, programs } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { curricula } from "@/lib/academic";
import "../../academic.css";

export function generateStaticParams() {
  return curricula.map((profile) => ({ profil: profile.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ profil: string }> }) {
  const { profil } = await params;
  const profile = curricula.find((item) => item.slug === profil);
  return profile ? { title: profile.title } : {};
}

export default async function ProfilePage({ params }: { params: Promise<{ profil: string }> }) {
  const { profil } = await params;
  const profile = curricula.find((item) => item.slug === profil);
  const program = programs.find((item) => item.id === profil);
  if (!profile || !program) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHeading section="Образовни профили" sectionHref="/obrazovni-profili" title={program.title} description={program.description} />
        <section className="academic-profile section">
          <div className="shell">
            <div className="academic-profile__intro">
              <div>
                <p className="eyebrow">Образовни профил / {program.number}</p>
                <h2>Упознајте профил</h2>
                {program.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <Image src={program.image} alt={program.alt} width={760} height={520} />
            </div>
            <div className="academic-profile__details">
              <section className="academic-profile__learning">
                <p className="eyebrow">Знања и вештине</p>
                <h2>Шта ћете учити?</h2>
                <p>Профил повезује опште образовање са стручним предметима и развојем вештина важних за рад са људима.</p>
                <ul>{program.learning.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <aside className="academic-profile__outlook">
                <section>
                  <p className="eyebrow">Поглед у будућност</p>
                  <h2>Након школовања</h2>
                  <p>{program.opportunities}</p>
                  <p className="academic-profile__disclaimer">Могућности запослења и наставка школовања зависе од важећих прописа и услова установе.</p>
                </section>
                <section>
                  <h2>Коме профил може да одговара?</h2>
                  <p>{program.suitable}</p>
                </section>
              </aside>
            </div>
            <div className="academic-profile__curriculum-heading">
              <div>
                <p className="eyebrow">Предмети и настава</p>
                <h2>Настава по годинама</h2>
                <p>Приказ је заснован на раније објављеном школском плану. За актуелни наставни план и услове уписа <Link href="/kontakt">обратите се школи</Link>.</p>
              </div>
              <Link className="school-page-link" href={`/ispiti-i-materijali/${profil}`}>Испити и материјали за овај профил <span aria-hidden="true">→</span></Link>
            </div>
            <div className="academic-years">
              {profile.years.map((year, index) => (
                <details className="academic-year" key={index} open={index === 0 ? true : undefined}>
                  <summary><span><small>{String(index + 1).padStart(2, "0")}</small>{["I", "II", "III", "IV"][index]} година</span><span aria-hidden="true">+</span></summary>
                  <ol>{year.subjects.map((subject, subjectIndex) => <li key={subjectIndex}>{subject}</li>)}</ol>
                </details>
              ))}
            </div>
            <div className="academic-notes"><strong>Напомене</strong>{profile.notes.map((note) => <p key={note}>{note}</p>)}</div>
            <section className="academic-profile__exam">
              <h2>Завршетак школовања</h2>
              <p>{program.exam}</p>
              <p>За актуелне услове и материјале <Link href={`/ispiti-i-materijali/${profil}`}>погледајте испите за овај профил</Link> или <Link href="/kontakt">обратите се школи</Link>.</p>
            </section>
            <Link href="/obrazovni-profili" className="school-page-link">Сви образовни профили <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
