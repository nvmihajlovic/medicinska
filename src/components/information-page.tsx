import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/school-pages";
import { LanguageText } from "@/components/language-size";
import { informationText } from "@/lib/information-text";
import type { Locale } from "@/lib/localization";
import "@/app/academic.css";

const pages = {
  "raspored-zvonjenja": {
    title: "Распоред звоњења",
    description: "Времена часова у преподневној и поподневној смени.",
  },
  "plan-pismenih-provera": {
    title: "План писмених провера",
    description: "Информације о плану писмених провера.",
  },
  "dezurstva-nastavnika": {
    title: "Распоред дежурства наставника",
    description: "Распоред дежурства наставника.",
  },
};

const shifts = [
  { title: "Преподневна смена", times: ["07:15–08:00", "08:05–08:50", "09:10–09:55", "10:00–10:45", "10:50–11:35", "11:40–12:25", "12:30–13:15"] },
  { title: "Поподневна смена", times: ["13:20–14:05", "14:10–14:55", "15:15–16:00", "16:05–16:50", "16:55–17:40", "17:45–18:30", "18:35–19:15"] },
];

const dutyDays = ["Понедељак", "Уторак", "Среда", "Четвртак", "Петак"];
const dutySchedule = [
  ["Рашовић Клара", "Станојевски Јелена", "Лупшић Милан", "Бурић Мирјана", "Богдан Весна"],
  ["Рашовић Клара", "Даничић Љиљана", "Лупшић Милан", "Даничић Љиљана", "Лукић Драгана"],
  ["Вучићевић Драгана", "Лупшић Милан", "Ристић Тамара", "Арамбашић Наташа", "Стојаковић Биљана"],
  ["Бонцић Мирјана", "Бурић Мирјана", "Милојевић Невена", "Коленовић Маја", "Грујић Наталија"],
  ["Грујић Наталија", "Арамбашић Наташа", "Рорат Симоновић Јелица", "Цамтоска Наташа", "Поповић Бојана"],
  ["Павловић Марина", "Бонцић Мирјана", "Ступар Здјелар Душанка", "Лошић Светлана", "Радовановић Дорина"],
  ["Никодиновић Виолета", "Радуловић Јасмина", "Родић Оливера", "Јованов Марина", "Рорат Симоновић Јелица"],
  ["Богдан Весна", "Стојаковић Биљана", "Цамтоска Наташа", "Урошев Драгана", "Васић Радојевић Сунчица"],
  ["Аксовић Милица", "Настић Јасмина", "Ожеговић Драгослава", "Поповић Бојана", "Чолока Минодора"],
  ["Урошев Драгана", "Рорат Симоновић Јелица", "Васић Радојевић Сунчица", "Настић Јасмина", "Урошев Драгана"],
  ["Васић Радојевић Сунчица", "Никодиновић Виолета", "Вучићевић Драгана", "Никодиновић Виолета"],
  ["Перић Ивана", "Коленовић Маја", "Коленовић Маја", "Настић Јасмина"],
  ["Јованов Јасмина", "Живанов Светлана", "Вучићевић Драгана", "Поповић Бојана"],
  ["Поповић Бојана", "Живанов Светлана", "Павлов Весна", "Драгосавац Драгана"],
];

export function getInformationPage(slug: string, locale: Locale = "sr") {
  if (!Object.prototype.hasOwnProperty.call(pages, slug)) return undefined;
  const key = slug as keyof typeof pages;
  return locale === "sr" ? pages[key] : informationText[locale].pages[key];
}

export function InformationPage({ stranica, locale = "sr" }: { stranica: string; locale?: Locale }) {
  const page = getInformationPage(stranica, locale);
  if (!page) notFound();
  const text = locale === "sr" ? null : informationText[locale];
  const informationHref = locale === "sr" ? "/ucenici-i-roditelji" : `/${locale}/ucenici-i-roditelji`;
  const key = stranica as keyof typeof pages;
  const headings = {
    sr: { section: "Информације", ...pages[key] },
    en: { section: informationText.en.section, ...informationText.en.pages[key] },
    de: { section: informationText.de.section, ...informationText.de.pages[key] },
  };

  return (
    <>
        <PageHeading locale={locale} {...headings[locale]} sectionHref={informationHref} variants={headings} />
        <section className="section">
          <div className="shell">
            {stranica === "raspored-zvonjenja" && (
              <>
                <div className="academic-bell-schedule">
                  {shifts.map((shift, shiftIndex) => (
                    <section key={shift.title}>
                      <p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Распоред часова", en: informationText.en.lessons, de: informationText.de.lessons }} /></p><h2><LanguageText locale={locale} values={{ sr: shift.title, en: informationText.en.shifts[shiftIndex], de: informationText.de.shifts[shiftIndex] }} /></h2>
                      <ol>{shift.times.map((time, index) => <li key={time}><span><LanguageText locale={locale} values={{ sr: `${index + 1}. час`, en: `${informationText.en.lesson} ${index + 1}`, de: `${index + 1}. ${informationText.de.lesson}` }} /></span><strong>{time}</strong></li>)}</ol>
                    </section>
                  ))}
                </div>
                <p className="academic-muted"><LanguageText locale={locale} values={{ sr: "Распоред је последњи пут ажуриран 2017. године. За важећи распоред обратите се школи.", en: informationText.en.bellNote, de: informationText.de.bellNote }} /></p>
              </>
            )}
            {stranica === "plan-pismenih-provera" && <p className="academic-muted"><LanguageText locale={locale} values={{ sr: "План писмених провера тренутно није доступан. За актуелне информације обратите се школи.", en: informationText.en.assessmentNote, de: informationText.de.assessmentNote }} /></p>}
            {stranica === "dezurstva-nastavnika" && (
              <>
                <div className="duty-schedule">
                  <div className="duty-schedule__heading">
                    <div><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Архива распореда", en: informationText.en.dutyArchive, de: informationText.de.dutyArchive }} /></p><h2><LanguageText locale={locale} values={{ sr: "Дежурства наставника", en: informationText.en.dutyTitle, de: informationText.de.dutyTitle }} /></h2><p><LanguageText locale={locale} values={{ sr: "Радне недеље 1 и 2 · Школска 2026/2027. година", en: informationText.en.dutyWeeks, de: informationText.de.dutyWeeks }} /></p></div>
                    <div className="duty-schedule__period"><span><LanguageText locale={locale} values={{ sr: "Период важења", en: informationText.en.validity, de: informationText.de.validity }} /></span><strong><LanguageText locale={locale} values={{ sr: "1–11. септембар 2026.", en: informationText.en.period, de: informationText.de.period }} /></strong></div>
                  </div>
                  <p className="duty-schedule__notice"><LanguageText locale={locale} values={{ sr: "Овај распоред односи се на наведени период. За важећи распоред обратите се школи.", en: informationText.en.dutyNote, de: informationText.de.dutyNote }} /></p>
                  <p className="duty-schedule__scroll-hint"><LanguageText locale={locale} values={{ sr: "На мањим екранима померите табелу улево за приказ свих дана.", en: informationText.en.scroll, de: informationText.de.scroll }} /></p>
                  <div className="duty-schedule__table-wrap" role="region" aria-label={text?.tableLabel ?? "Табела дежурстава наставника"} tabIndex={0}>
                    <table className="duty-schedule__table">
                      <caption><LanguageText locale={locale} values={{ sr: "Распоред дежурстава од 1. до 11. септембра 2026.", en: informationText.en.caption, de: informationText.de.caption }} /></caption>
                      <thead><tr><th scope="col"><LanguageText locale={locale} values={{ sr: "Час", en: informationText.en.lesson, de: informationText.de.lesson }} /></th>{dutyDays.map((day, index) => <th scope="col" key={day}><LanguageText locale={locale} values={{ sr: day, en: informationText.en.days[index], de: informationText.de.days[index] }} /></th>)}</tr></thead>
                      <tbody>
                        {dutySchedule.map((names, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}.</th>
                            {names.map((name, day) => <td key={dutyDays[day]} lang="sr-Cyrl">{name}</td>)}
                            {index === 10 && <td rowSpan={4} className="duty-schedule__friday" lang="sr-Cyrl">Станојевски Јелена <span>04.09.</span><br />Стојку Сања <span>11.09.</span></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="duty-schedule__source">
                    <span><LanguageText locale={locale} values={{ sr: "Датум документа: 31.08.2026.", en: informationText.en.documentDate, de: informationText.de.documentDate }} /></span>
                    <a href="/skolski-materijali/raspored-dezurstava-2026.jpg" target="_blank" rel="noopener noreferrer"><LanguageText locale={locale} values={{ sr: "Отворите оригинални документ", en: informationText.en.original, de: informationText.de.original }} /> <span aria-hidden="true">↗</span></a>
                  </div>
                </div>
              </>
            )}
            <Link href={informationHref} className="school-page-link"><LanguageText locale={locale} values={{ sr: "Информације за ученике и родитеље", en: informationText.en.back, de: informationText.de.back }} /> <span aria-hidden="true">→</span></Link>
          </div>
        </section>
    </>
  );
}
