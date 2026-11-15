import { ExamIndexContent } from "@/components/exam-index-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "../academic.css";

export const metadata = { title: "Испити и материјали" };

export default function ExamIndex() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <ExamIndexContent locale="sr" />
      </main>
      <SiteFooter />
    </>
  );
}
