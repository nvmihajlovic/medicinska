import Image from "next/image";
import Link from "next/link";
import { HomeProgramCard } from "@/components/home-program-card";
import { LanguageBlock, LanguageText } from "@/components/language-size";
import { NewsCard, NewsPagination } from "@/components/news-list";
import { programs } from "@/components/school-pages";
import type { Locale } from "@/lib/localization";
import type { NewsItem } from "@/lib/news";

const text = {
  sr: {
    programmesEyebrow: "01 / Средње стручно образовање", programmes: "Образовни профили", allProgrammes: "Сви образовни профили", profileNotice: "",
    practiceLabel: "Вежбе у школском кабинету", practiceEyebrow: "Настава и учење", practiceTitle: "Вежбе у кабинету и болничким одељењима",
    practice: "Вежбе у школским кабинетима и болничким одељењима повезују теоријска знања са радом у здравству. Уз подршку наставника и ментора, ученици развијају стручне вештине, сигурност и тимски приступ нези пацијената.",
    points: ["Вежбе у школским кабинетима", "Стручне вежбе у болничким одељењима", "Подршка наставника и ментора"], learnMore: "Сазнај више о школи",
    newsEyebrow: "02 / Живот и рад школе", news: "Вести из школе", newsNotice: "", empty: "Нема објављених вести.",
    useful: "Корисне информације", students: "За ученике и родитеље", quickIntro: "Брз приступ информацијама о настави, упису и раду школе.",
    quick: [["Распоред часова", "Смене и распоред звона"], ["Упис у школу", "Смерови и услови уписа"], ["Документација", "Обрасци и важни документи"], ["Контакт и локација", "Како да нас пронађете"]],
    history: "Историјат школе", city: "Панчево", beginning: "Почетак наше приче", historyText: "Медицинска школа у Панчеву основана је 1959. године. Од тада, бројне генерације ученика у њој стичу знања и вештине за рад у здравству.",
    about: "Упознајте нашу школу", future: "За будуће ученике", admission: "Информације о упису", admissionText: "Упознај програме и могућности које нуди медицинска школа у Панчеву.", explore: "Погледај образовне профиле",
    practiceAlt: "Ученици на вежбама у школском кабинету",
    imageAlts: ["Здравствени радници мере крвни притисак пацијенту", "Новорођенче у болничком окружењу", "Беба седи на поду и игра се дрвеном играчком", "Ученица увежбава поступак здравствене неге"],
  },
  en: {
    programmesEyebrow: "01 / Secondary vocational education", programmes: "Study programmes", allProgrammes: "All study programmes", profileNotice: "Programme descriptions are in Serbian.",
    practiceLabel: "Practice in the school skills lab", practiceEyebrow: "Teaching and learning", practiceTitle: "Practice in school skills labs and hospital wards",
    practice: "Exercises in school skills labs and hospital wards connect theoretical learning with healthcare practice. With support from teachers and mentors, students develop professional skills, confidence and a team-based approach to patient care.",
    points: ["Exercises in school skills labs", "Professional practice in hospital wards", "Support from teachers and mentors"], learnMore: "Learn more about the school",
    newsEyebrow: "02 / School life and work", news: "School news", newsNotice: "Some news articles and attachments are available only in Serbian.", empty: "No news has been published.",
    useful: "Useful information", students: "For students and parents", quickIntro: "Quick access to information about teaching, admissions and the school.",
    quick: [["Class schedule", "Shifts and bell times"], ["School admissions", "Programmes and admission requirements"], ["Documents", "Forms and important documents"], ["Contact and location", "How to find us"]],
    history: "School history", city: "Pančevo", beginning: "The beginning of our story", historyText: "The Medical School in Pančevo was founded in 1959. Since then, generations of students have gained knowledge and skills for work in healthcare.",
    about: "Discover our school", future: "For future students", admission: "Admissions information", admissionText: "Explore the programmes and opportunities offered by the Medical School in Pančevo.", explore: "Explore study programmes",
    practiceAlt: "Students practising in a school skills lab",
    imageAlts: ["Healthcare workers measuring a patient's blood pressure", "A newborn in a hospital setting", "A baby sitting on the floor and playing with a wooden toy", "A student practising a nursing procedure"],
  },
  de: {
    programmesEyebrow: "01 / Berufliche Sekundarbildung", programmes: "Bildungsprofile", allProgrammes: "Alle Bildungsprofile", profileNotice: "Die Profilbeschreibungen sind auf Serbisch.",
    practiceLabel: "Übungen im schulischen Fachraum", practiceEyebrow: "Unterricht und Lernen", practiceTitle: "Übungen in Fachräumen und Krankenhausstationen",
    practice: "Übungen in schulischen Fachräumen und auf Krankenhausstationen verbinden theoretisches Wissen mit der Praxis im Gesundheitswesen. Mit Unterstützung der Lehrkräfte entwickeln die Lernenden berufliche Fähigkeiten, Sicherheit und Teamgeist in der Patientenversorgung.",
    points: ["Übungen in schulischen Fachräumen", "Berufliche Praxis auf Krankenhausstationen", "Unterstützung durch Lehrkräfte und Mentorinnen und Mentoren"], learnMore: "Mehr über die Schule",
    newsEyebrow: "02 / Schulleben und Arbeit", news: "Nachrichten aus der Schule", newsNotice: "Einige Nachrichten und Anhänge sind nur auf Serbisch verfügbar.", empty: "Es wurden keine Nachrichten veröffentlicht.",
    useful: "Nützliche Informationen", students: "Für Schülerinnen, Schüler und Eltern", quickIntro: "Schneller Zugang zu Informationen über Unterricht, Aufnahme und Schule.",
    quick: [["Unterrichtszeiten", "Schichten und Klingelzeiten"], ["Schulaufnahme", "Profile und Aufnahmebedingungen"], ["Dokumente", "Formulare und wichtige Dokumente"], ["Kontakt und Standort", "So finden Sie uns"]],
    history: "Schulgeschichte", city: "Pančevo", beginning: "Der Anfang unserer Geschichte", historyText: "Die Medizinische Schule in Pančevo wurde 1959 gegründet. Seitdem erwerben Generationen von Lernenden hier Kenntnisse und Fähigkeiten für die Arbeit im Gesundheitswesen.",
    about: "Unsere Schule kennenlernen", future: "Für zukünftige Lernende", admission: "Informationen zur Aufnahme", admissionText: "Entdecken Sie die Bildungsprofile und Möglichkeiten der Medizinischen Schule in Pančevo.", explore: "Bildungsprofile entdecken",
    practiceAlt: "Lernende bei Übungen in einem schulischen Fachraum",
    imageAlts: ["Pflegekräfte messen den Blutdruck eines Patienten", "Ein Neugeborenes in einer klinischen Umgebung", "Ein Baby sitzt auf dem Boden und spielt mit einem Holzspielzeug", "Eine Schülerin übt einen Pflegeschritt"],
  },
} as const;

const descriptions = [
  "Знање, сигурност и брига о пацијенту у сваком кораку.",
  "Стручна подршка мајци и детету од првог дана.",
  "Спој здравствене неге, подршке и рада са децом.",
  "Практичне вештине и људски приступ у нези.",
];
const quickPaths = ["/ucenici-i-roditelji", "/obrazovni-profili", "/dokumentacija", "/kontakt"];
type TextKey = Exclude<keyof typeof text.sr, "quick" | "points" | "imageAlts">;

function HomeText({ locale, name }: { locale: Locale; name: TextKey }) {
  return <LanguageText locale={locale} values={{ sr: text.sr[name], en: text.en[name], de: text.de[name] }} />;
}

export function HomeSections({ locale, latest, currentPage, pages, showArchive }: { locale: Locale; latest: NewsItem[]; currentPage: number; pages: number; showArchive: boolean }) {
  const base = locale === "sr" ? "" : `/${locale}`;
  const copy = text[locale];
  return <>
    <section className="section programs-section"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow"><HomeText locale={locale} name="programmesEyebrow" /></p><h2><HomeText locale={locale} name="programmes" /></h2></div><Link className="section-link" href={`${base}/obrazovni-profili`}><HomeText locale={locale} name="allProgrammes" /> <span aria-hidden="true">→</span></Link></div>
      <p className="source-note"><HomeText locale={locale} name="profileNotice" /></p>
      <div className="program-grid">{programs.map((program, index) => <HomeProgramCard key={program.number} locale={locale} program={{ ...program, description: descriptions[index], alt: copy.imageAlts[index] }} />)}</div>
    </div></section>
    <section className="section practice-section"><div className="shell practice-grid">
      <div className="practice-visual"><div className="practice-visual__image"><Image src="/images/praktikum-5.jpg" alt={copy.practiceAlt} fill sizes="(max-width: 800px) 90vw, 45vw" /></div><span className="practice-visual__label"><HomeText locale={locale} name="practiceLabel" /></span></div>
      <div className="practice-copy"><LanguageBlock locale={locale}>{(language) => <>
        <p className="eyebrow">{text[language].practiceEyebrow}</p>
        <h2>{text[language].practiceTitle}</h2>
        <p>{text[language].practice}</p>
        <ul className="practice-points">{text[language].points.map((point) => <li key={point}>{point}</li>)}</ul>
        {language === locale ? <Link className="button button--outline" href={`${base}/o-skoli`}>{text[language].learnMore} <span aria-hidden="true">→</span></Link> : <a className="button button--outline">{text[language].learnMore} <span aria-hidden="true">→</span></a>}
      </>}</LanguageBlock></div>
    </div></section>
    <section className="section news-section" id="vesti"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow"><HomeText locale={locale} name="newsEyebrow" /></p><h2><HomeText locale={locale} name="news" /></h2></div>{showArchive ? <Link className="section-link" href="/vesti">Архива вести <span aria-hidden="true">→</span></Link> : <span className="section-link home-archive-placeholder" aria-hidden="true">Архива вести <span>→</span></span>}</div>
      <p className="source-note"><HomeText locale={locale} name="newsNotice" /></p>
      <div className="news-grid">{latest.map((item) => <NewsCard item={item} locale={locale} matchLanguages key={item.href} />)}{latest.length === 0 && <p className="news-empty"><HomeText locale={locale} name="empty" /></p>}</div>
      <div className="news-section__bottom"><NewsPagination page={currentPage} pages={pages} locale={locale} href={(page) => page === 1 ? `${base || "/"}#vesti` : `${base || "/"}?vesti=${page}#vesti`} />{showArchive ? <Link className="school-news-archive-link" href="/vesti">Старије вести у архиви <span aria-hidden="true">→</span></Link> : <span className="school-news-archive-link home-archive-placeholder" aria-hidden="true">Старије вести у архиви <span>→</span></span>}</div>
    </div></section>
    <section className="section school-info"><div className="shell info-layout">
      <div className="quick-panel"><p className="eyebrow"><HomeText locale={locale} name="useful" /></p><h2><HomeText locale={locale} name="students" /></h2><p className="quick-panel__intro"><HomeText locale={locale} name="quickIntro" /></p><div className="quick-grid">{quickPaths.map((path, index) => <Link className="quick-link" href={`${base}${path}`} key={path}><span className="quick-link__icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><LanguageBlock locale={locale}>{(language) => <><strong>{text[language].quick[index][0]}</strong><small>{text[language].quick[index][1]}</small></>}</LanguageBlock><span className="quick-link__arrow" aria-hidden="true">›</span></Link>)}</div></div>
      <div className="dates-panel"><div className="dates-panel__top"><p className="eyebrow"><HomeText locale={locale} name="history" /></p><span><HomeText locale={locale} name="city" /></span></div><span className="dates-panel__year">1959.</span><h2><HomeText locale={locale} name="beginning" /></h2><p><HomeText locale={locale} name="historyText" /></p><Link className="section-link" href={`${base}/o-skoli`}><HomeText locale={locale} name="about" /> <span aria-hidden="true">→</span></Link></div>
    </div></section>
    <section className="enroll-cta"><div className="shell enroll-cta__inner"><div><p className="eyebrow"><HomeText locale={locale} name="future" /></p><h2><HomeText locale={locale} name="admission" /></h2><p><HomeText locale={locale} name="admissionText" /></p></div><Link className="button button--light" href={`${base}/obrazovni-profili`}><HomeText locale={locale} name="explore" /> <span aria-hidden="true">→</span></Link></div></section>
  </>;
}
