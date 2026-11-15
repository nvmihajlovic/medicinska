import { InformationPage, getInformationPage } from "@/components/information-page";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

type Props = { params: Promise<{ stranica: string }> };

export function generateStaticParams() {
  return ["raspored-zvonjenja", "plan-pismenih-provera", "dezurstva-nastavnika"].map((stranica) => ({ stranica }));
}

export async function generateMetadata({ params }: Props) {
  const { stranica } = await params;
  const page = getInformationPage(stranica);
  return page ? { title: page.title } : {};
}

export default async function Page({ params }: Props) {
  const { stranica } = await params;
  return <><SiteHeader /><main id="main"><InformationPage stranica={stranica} /></main><SiteFooter /></>;
}
