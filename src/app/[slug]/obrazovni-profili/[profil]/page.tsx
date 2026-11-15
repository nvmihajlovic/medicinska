import { notFound } from "next/navigation";
import { ProgramProfile } from "@/components/program-profile";
import { curricula } from "@/lib/academic";
import { examPrograms } from "@/lib/exam-text";
import { profileTranslations } from "@/lib/profile-text";

type Props = { params: Promise<{ slug: string; profil: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, profil } = await params;
  if ((slug !== "en" && slug !== "de") || !curricula.some((profile) => profile.slug === profil)) return {};
  if (!examPrograms[profil] || !profileTranslations[profil]) throw new Error(`Недостаје превод профила: ${profil}`);
  return { title: examPrograms[profil][slug], description: profileTranslations[profil][slug].description };
}

export default async function Page({ params }: Props) {
  const { slug, profil } = await params;
  if ((slug !== "en" && slug !== "de") || !curricula.some((profile) => profile.slug === profil)) notFound();
  return <div lang={slug}><ProgramProfile profil={profil} locale={slug} /></div>;
}
