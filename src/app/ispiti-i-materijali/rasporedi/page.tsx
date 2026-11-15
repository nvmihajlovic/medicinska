import { ExamSchedulesContent } from "@/components/exam-schedules-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "../../academic.css";

export const metadata = { title: "Распореди испита" };

export default function ExamSchedules() {
  return <>
    <SiteHeader />
    <main id="main"><ExamSchedulesContent locale="sr" /></main>
    <SiteFooter />
  </>;
}
