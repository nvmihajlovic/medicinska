import { ErasmusContent } from "@/components/erasmus-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata = {
  title: "Erasmus+ пројекти",
  description: "Међународна сарадња и Erasmus+ пројекти Медицинске школе у Панчеву.",
};

export default function Page() {
  return <><SiteHeader /><main id="main" className="erasmus-page"><ErasmusContent /></main><SiteFooter /></>;
}
