import { ProgramProfile } from "@/components/program-profile";
import { curricula } from "@/lib/academic";

type Props = { params: Promise<{ profil: string }> };

export function generateStaticParams() {
  return curricula.map((profile) => ({ profil: profile.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { profil } = await params;
  const profile = curricula.find((item) => item.slug === profil);
  return profile ? { title: profile.title } : {};
}

export default async function ProfilePage({ params }: Props) {
  const { profil } = await params;
  return <ProgramProfile profil={profil} />;
}
