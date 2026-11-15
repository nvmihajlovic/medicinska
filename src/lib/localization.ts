export type Locale = "sr" | "en" | "de";

export const languageCookie = "school-language";

export function localeFromPath(path: string): Locale {
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/de" || path.startsWith("/de/")) return "de";
  return "sr";
}

export const cookieText = {
  sr: {
    settings: "Подешавања колачића", error: "Избор није сачуван. Проверите да ли прегледач дозвољава колачиће и покушајте поново.",
    label: "Избор колачића", eyebrow: "ВАША ПРИВАТНОСТ", title: "Ви бирате своје искуство", close: "Затвори подешавања",
    intro: "Неопходни колачићи омогућавају рад. Прегледи, лајкови и YouTube укључују се уз дозволу. Избор можете променити.",
    policy: "Политика колачића", required: "Неопходни колачићи", always: "Увек активни",
    requiredDescription: "Чувају избор колачића и језика и омогућавају администраторску пријаву.",
    analytics: "Прегледи и лајкови", analyticsDescription: "Памћење лајкова и бројање прегледа вести.",
    video: "YouTube садржај", videoDescription: "Учитавање уграђених видео-снимака са YouTube-а.",
    accept: "Прихвати све", reject: "Одбиј непотребне", save: "Сачувај избор", customize: "Подешавања",
  },
  en: {
    settings: "Cookie settings", error: "Your choice could not be saved. Check that cookies are allowed and try again.",
    label: "Cookie choices", eyebrow: "YOUR PRIVACY", title: "Your choices matter", close: "Close settings",
    intro: "Essential cookies enable the site to work. Views, likes and YouTube are enabled only with your permission. You can change your choice.",
    policy: "Cookie policy", required: "Essential cookies", always: "Always active",
    requiredDescription: "These save your cookie and language choices and enable administrator sign-in.",
    analytics: "Views and likes", analyticsDescription: "Remembering likes and counting news views.",
    video: "YouTube content", videoDescription: "Loading embedded YouTube videos.",
    accept: "Accept all", reject: "Reject optional", save: "Save choices", customize: "Settings",
  },
  de: {
    settings: "Cookie-Einstellungen", error: "Ihre Auswahl konnte nicht gespeichert werden. Prüfen Sie, ob Cookies erlaubt sind, und versuchen Sie es erneut.",
    label: "Cookie-Auswahl", eyebrow: "IHRE PRIVATSPHÄRE", title: "Sie haben die Wahl", close: "Einstellungen schließen",
    intro: "Notwendige Cookies ermöglichen den Betrieb. Aufrufe, „Gefällt mir“ und YouTube werden nur mit Ihrer Erlaubnis aktiviert. Sie können Ihre Auswahl ändern.",
    policy: "Cookie-Richtlinie", required: "Notwendige Cookies", always: "Immer aktiv",
    requiredDescription: "Sie speichern Ihre Cookie- und Sprachauswahl und ermöglichen die Anmeldung der Verwaltung.",
    analytics: "Aufrufe und „Gefällt mir“", analyticsDescription: "Speichern von „Gefällt mir“ und Zählen der Nachrichtenaufrufe.",
    video: "YouTube-Inhalte", videoDescription: "Laden eingebetteter YouTube-Videos.",
    accept: "Alle akzeptieren", reject: "Optionale ablehnen", save: "Auswahl speichern", customize: "Einstellungen",
  },
} as const;

export const chromeText = {
  sr: {
    skip: "Прескочи на садржај", school: "Медицинска школа", city: "Панчево", hours: "Радно време: 07:00–19:15",
    schoolInfo: "Информације о школи", navigation: "Главна навигација", mobileNavigation: "Мобилна навигација", menu: "Мени",
    nav: ["О школи", "Образовни профили", "Информације", "Erasmus+ пројекти", "Архива вести", "Контакт"],
    footerIntro: "Средња стручна школа у Панчеву, посвећена медицинском образовању од 1959. године.",
    footerTitles: ["Школа", "За ученике", "Будимо у контакту"],
    footerLinks: ["О школи", "Запослени", "Стручни тимови", "Erasmus+ пројекти", "Образовни профили", "Информације", "Испити и материјали", "Документација", "Контакт и локација", "Архива вести", "Услови коришћења", "Политика приватности", "Политика колачића"],
    language: "Језик", unavailable: "Превод сајта је у току; неке странице су доступне само на српском.",
  },
  en: {
    skip: "Skip to content", school: "Medical School", city: "Pančevo", hours: "Opening hours: 07:00–19:15",
    schoolInfo: "School information", navigation: "Main navigation", mobileNavigation: "Mobile navigation", menu: "Menu",
    nav: ["About the school", "Study programmes", "Information", "Erasmus+ projects", "News archive", "Contact"],
    footerIntro: "A secondary vocational school in Pančevo, dedicated to medical education since 1959.",
    footerTitles: ["School", "For students", "Contact"],
    footerLinks: ["About the school", "Staff", "School teams", "Erasmus+ projects", "Study programmes", "Information", "Exams and materials", "Documents", "Contact and location", "News archive", "Terms of use", "Privacy policy", "Cookie policy"],
    language: "Language", unavailable: "Translation is in progress; some pages are currently available only in Serbian.",
  },
  de: {
    skip: "Zum Inhalt springen", school: "Medizinische Schule", city: "Pančevo", hours: "Öffnungszeiten: 07:00–19:15",
    schoolInfo: "Informationen zur Schule", navigation: "Hauptnavigation", mobileNavigation: "Mobile Navigation", menu: "Menü",
    nav: ["Über die Schule", "Bildungsprofile", "Informationen", "Erasmus+-Projekte", "Nachrichtenarchiv", "Kontakt"],
    footerIntro: "Eine berufsbildende Schule in Pančevo, die seit 1959 medizinische Bildung vermittelt.",
    footerTitles: ["Schule", "Für Schülerinnen und Schüler", "Kontakt"],
    footerLinks: ["Über die Schule", "Mitarbeitende", "Schulteams", "Erasmus+-Projekte", "Bildungsprofile", "Informationen", "Prüfungen und Materialien", "Dokumente", "Kontakt und Standort", "Nachrichtenarchiv", "Nutzungsbedingungen", "Datenschutz", "Cookie-Richtlinie"],
    language: "Sprache", unavailable: "Die Übersetzung ist in Arbeit; einige Seiten sind derzeit nur auf Serbisch verfügbar.",
  },
} satisfies Record<Locale, {
  skip: string; school: string; city: string; hours: string; schoolInfo: string;
  navigation: string; mobileNavigation: string; menu: string; nav: string[];
  footerIntro: string; footerTitles: string[]; footerLinks: string[]; language: string; unavailable: string;
}>;

export const teamsText = {
  en: {
    section: "School teams", title: "School teams",
    description: "An overview of the teams involved in school planning and student support.",
    eyebrow: "How we work", heading: "Our teams",
    intro: "The teams cover areas from the school curriculum and development planning to support for students and the school community.",
    items: [
      "School development planning team",
      "School curriculum team",
      "School self-evaluation and evaluation team",
      "Inclusive education team",
      "Team for combating violence, abuse and neglect",
      "Team supporting students who have difficulty mastering the curriculum",
      "Team authorised to initiate proceedings for protection against abuse",
      "Team for cooperation with the Red Cross and humanitarian organisations",
      "Team for preparing the annual school work plan and the report on its implementation in the previous school year",
      "Career guidance team",
      "Team for planning and organising excursions, trips and visits",
      "Team for maintaining and improving the school environment",
      "Team for school promotion and media relations",
      "Professional development team",
      "Peer team against violence",
      "Teaching materials and equipment team",
      "Student parliament support team",
    ],
  },
  de: {
    section: "Schulteams", title: "Die Teams der Schule",
    description: "Ein Überblick über die Teams, die an der Schulplanung und der Unterstützung der Schülerinnen und Schüler mitwirken.",
    eyebrow: "Organisation der Arbeit", heading: "Unsere Teams",
    intro: "Die Teams befassen sich mit Themen vom Schulprogramm und der Entwicklungsplanung bis zur Unterstützung der Schülerinnen und Schüler und der Schulgemeinschaft.",
    items: [
      "Team für Schulentwicklungsplanung",
      "Team für das Schulprogramm",
      "Team für Selbstevaluation und Evaluation der Schularbeit",
      "Team für inklusive Bildung",
      "Team gegen Gewalt, Missbrauch und Vernachlässigung",
      "Team zur Unterstützung von Schülerinnen und Schülern mit Schwierigkeiten beim Erlernen der Lehrplaninhalte",
      "Team zur Einleitung von Verfahren zum Schutz vor Missbrauch",
      "Team für die Zusammenarbeit mit dem Roten Kreuz und humanitären Organisationen",
      "Team zur Erstellung des Jahresarbeitsplans und des Berichts über seine Umsetzung im vergangenen Schuljahr",
      "Team für Berufsorientierung",
      "Team für die Planung und Organisation von Exkursionen, Ausflügen und Besuchen",
      "Team für die Gestaltung und Pflege der Schulräume",
      "Team für Schulwerbung und Medienarbeit",
      "Team für berufliche Weiterbildung",
      "Peer-Team gegen Gewalt",
      "Team für Lehrmittel und Ausstattung",
      "Team zur Unterstützung des Schülerparlaments",
    ],
  },
} as const;

export const aboutText = {
  en: {
    section: "About the school", title: "The school and its history",
    description: "Medical School “Stevica Jovanović” has been part of education and healthcare in Pančevo since 1959.",
    home: "Home", breadcrumb: "Breadcrumb", history: "Our history", beginnings: "The beginnings of medical education in Pančevo",
    intro: [
      "The need for a school arose as healthcare services and the hospital in Pančevo developed. Its establishment enabled future nurses to study in their own city.",
      "Dr Bora Drndarski was the first director and teacher, while the hospital’s head nurse, Olga Rapajić, led practical training.",
    ],
    development: "The development of the school", milestones: "Key moments in our school’s development.", today: "1959 — today",
    timeline: [
      ["The school is founded", "The school was founded in March by a decision of the Pančevo District People’s Committee. Dr Bora Drndarski initiated and organised its opening."],
      ["A four-year school", "The first four-year medical school opened. Practical training took place at the General Hospital in Pančevo."],
      ["Adult education", "Satellite classes opened in Kovin and Vršac."],
      ["A new study programme", "Alongside the general programme, a gynaecological and obstetric nursing programme was introduced."],
      ["Healthcare caregiver", "The school joined the CARDS programme to introduce the pilot healthcare caregiver programme."],
    ],
    training: "Teaching and practice", learning: "Learning at school and in healthcare institutions",
    practice: "Teaching combines theory and exercises in school skills labs with professional practice in hospital wards and other healthcare settings, including the General Hospital and Health Centre in Pančevo.",
    programmes: "Study programmes", discover: "Discover the school", links: ["Staff", "School teams", "Contact"],
  },
  de: {
    section: "Über die Schule", title: "Die Schule und ihre Geschichte",
    description: "Die Medizinische Schule „Stevica Jovanović“ ist seit 1959 Teil des Bildungs- und Gesundheitswesens in Pančevo.",
    home: "Startseite", breadcrumb: "Brotkrumennavigation", history: "Unsere Geschichte", beginnings: "Die Anfänge der medizinischen Ausbildung in Pančevo",
    intro: [
      "Mit dem Ausbau des Gesundheitsdienstes und des Krankenhauses in Pančevo entstand der Bedarf an einer Schule. Ihre Gründung ermöglichte angehenden Pflegekräften eine Ausbildung in ihrer eigenen Stadt.",
      "Dr. Bora Drndarski war der erste Schulleiter und Lehrer; die praktische Ausbildung leitete Olga Rapajić, die leitende Pflegekraft des Krankenhauses.",
    ],
    development: "Die Entwicklung der Schule", milestones: "Wichtige Stationen in der Entwicklung unserer Schule.", today: "1959 — heute",
    timeline: [
      ["Gründung der Schule", "Die Schule wurde im März durch einen Beschluss des Volksausschusses des Bezirks Pančevo gegründet. Dr. Bora Drndarski initiierte und organisierte ihre Eröffnung."],
      ["Eine vierjährige Schule", "Die erste vierjährige medizinische Schule wurde eröffnet. Die praktische Ausbildung fand im Allgemeinen Krankenhaus in Pančevo statt."],
      ["Erwachsenenbildung", "In Kovin und Vršac wurden Außenklassen eröffnet."],
      ["Ein neues Bildungsprofil", "Neben dem allgemeinen Bildungsgang wurde ein Profil für gynäkologische und geburtshilfliche Pflege eingeführt."],
      ["Gesundheitspflege", "Die Schule beteiligte sich am CARDS-Programm zur Einführung eines Modellprofils für Pflegekräfte."],
    ],
    training: "Unterricht und Praxis", learning: "Lernen in der Schule und in Gesundheitseinrichtungen",
    practice: "Der Unterricht verbindet Theorie und Übungen in schulischen Fachräumen mit der beruflichen Praxis auf Krankenhausstationen und in weiteren Gesundheitseinrichtungen, darunter das Allgemeine Krankenhaus und das Gesundheitszentrum in Pančevo.",
    programmes: "Bildungsprofile", discover: "Die Schule kennenlernen", links: ["Mitarbeitende", "Schulteams", "Kontakt"],
  },
} as const;
