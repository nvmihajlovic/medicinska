import schedules from "@/data/exam-schedules.json";

const imageSchedules = [
  {
    title: "Распоред поправних испита у августовском испитном року 2024/2025",
    date: "2025-07-09",
    note: "У периоду од 10.07.2025. до 22.08.2025. школа ће радити у термину од 08-12 сати. Светлана Калапиш.",
    paths: ["/skolski-materijali/ispit-2025-1.jpg", "/skolski-materijali/ispit-2025-2.jpg"],
  },
  {
    title: "Распоред поправног, матурског и завршног испита у августовском испитном року 2023/2024",
    date: "2024-07-08",
    note: "Од 10.07.2024. школа ће радити у термину од 09-12 сати. Светлана Калапиш",
    paths: ["/skolski-materijali/ispit-2024-1.jpg", "/skolski-materijali/ispit-2024-2.jpg"],
  },
  {
    title: "Јануарски испитни рок — ванредни ученици",
    date: "2024-01-19",
    note: "",
    paths: ["/skolski-materijali/ispit-2024-januar.jpg"],
  },
];

export const examScheduleEntries = [
  ...schedules.map((schedule) => ({ title: schedule.title, date: schedule.date.slice(0, 10), note: "", paths: [schedule.link.path] })),
  ...imageSchedules,
].sort((a, b) => b.date.localeCompare(a.date));
