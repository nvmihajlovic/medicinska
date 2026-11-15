import { programs } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExamProfileContent } from "@/components/translated-exams";
import "../../academic.css";

export function generateStaticParams() {
  return programs.map((program) => ({ profil: program.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ profil: string }> }) {
  const { profil } = await params;
  const program = programs.find((item) => item.id === profil);
  return program ? { title: `Испити и материјали — ${program.title}` } : {};
}

export default async function ExamPage({ params }: { params: Promise<{ profil: string }> }) {
  const { profil } = await params;
  return <>
    <SiteHeader />
    <main id="main"><ExamProfileContent locale="sr" profil={profil} /></main>
    <SiteFooter />
  </>;
}
