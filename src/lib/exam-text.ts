type Pair = { en: string; de: string };

export const examText = {
  en: {
    section: "Information", title: "Exams and materials", description: "Exam and final exam questions, instructions and materials by study programme.",
    material: "Student materials", choose: "Choose a study programme", intro: "The programme pages contain published exam and final exam questions and documents available on this website.",
    programme: "Study programme", questionsMaterials: "Questions and materials", graduation: "Final and graduation exams",
    notice: "Open your study programme for exam information and available materials. Contact the school for current requirements.",
    schedule: "Exam schedule archive", documents: "School documents", pageDescription: "Exam questions, final or graduation exam and available materials for this programme.",
    contents: "Page contents", questions: "Exam questions", final: "Final / graduation exam", subjects: "Subjects by year",
    prepare: "Preparation materials", chooseYear: "Choose a year and subject to download exam questions.", year: "Year", count: "Documents",
    other: "Other materials", noQuestions: "Separate exam questions are not available for this programme.", finishing: "Completing your studies",
    downloads: "Materials to download", current: "Contact the school for current exam requirements and materials.",
    original: "The downloadable documents are in Serbian.", untranslated: "Some information or document titles are shown in Serbian.",
  },
  de: {
    section: "Informationen", title: "Prüfungen und Materialien", description: "Prüfungs- und Abschlussprüfungsfragen, Hinweise und Materialien nach Bildungsprofil.",
    material: "Materialien für Lernende", choose: "Wählen Sie ein Bildungsprofil", intro: "Auf den Profilseiten finden Sie veröffentlichte Prüfungs- und Abschlussprüfungsfragen sowie Dokumente auf dieser Website.",
    programme: "Bildungsprofil", questionsMaterials: "Fragen und Materialien", graduation: "Abschlussprüfungen",
    notice: "Öffnen Sie Ihr Bildungsprofil für Prüfungsinformationen und verfügbare Materialien. Für aktuelle Bedingungen wenden Sie sich an die Schule.",
    schedule: "Archiv der Prüfungspläne", documents: "Schuldokumente", pageDescription: "Prüfungsfragen, Abschlussprüfung und verfügbare Materialien für dieses Profil.",
    contents: "Seiteninhalt", questions: "Prüfungsfragen", final: "Abschlussprüfung", subjects: "Fächer nach Jahren",
    prepare: "Vorbereitungsmaterialien", chooseYear: "Wählen Sie Jahrgang und Fach, um Prüfungsfragen herunterzuladen.", year: "Jahrgang", count: "Dokumente",
    other: "Weitere Materialien", noQuestions: "Für dieses Profil sind keine gesonderten Prüfungsfragen verfügbar.", finishing: "Schulabschluss",
    downloads: "Materialien zum Herunterladen", current: "Für aktuelle Prüfungsbedingungen und Materialien wenden Sie sich an die Schule.",
    original: "Die herunterladbaren Dokumente sind auf Serbisch.", untranslated: "Einige Informationen oder Dokumenttitel werden auf Serbisch angezeigt.",
  },
} as const;

export const examScheduleText = {
  en: {
    title: "Exam schedules", description: "An archive of exam schedules taken from school announcements.",
    eyebrow: "School archive", heading: "Exam periods", note: "These schedules relate to the stated dates and do not confirm current exam periods. Contact the school for current information.",
    original: "The original schedules are in Serbian.", untranslated: "Some schedule titles or notes are shown in Serbian.",
    year: "Year", open: "Open schedule", part: "Open part",
  },
  de: {
    title: "Prüfungspläne", description: "Ein Archiv der Prüfungspläne aus Bekanntmachungen der Schule.",
    eyebrow: "Schularchiv", heading: "Prüfungstermine", note: "Diese Pläne beziehen sich auf die angegebenen Daten und bestätigen keine aktuellen Prüfungstermine. Für aktuelle Informationen wenden Sie sich an die Schule.",
    original: "Die Originalpläne sind auf Serbisch.", untranslated: "Einige Plantitel oder Hinweise werden auf Serbisch angezeigt.",
    year: "Jahr", open: "Plan öffnen", part: "Teil öffnen",
  },
} as const;

export const examScheduleTitles: Record<string, Pair> = {
  "Распоред испита у августовском року школске 2025/2026": { en: "August exam schedule, 2025/2026 school year", de: "Prüfungsplan für August, Schuljahr 2025/2026" },
  "Мајски испитни рок-ванредни ученици": { en: "May exam period — external students", de: "Prüfungstermin im Mai — externe Lernende" },
  "Фебруарски испитни рок-ванредни ученици": { en: "February exam period — external students", de: "Prüfungstermin im Februar — externe Lernende" },
  "Новембарски испитни рок-ванредни ученици": { en: "November exam period — external students", de: "Prüfungstermin im November — externe Lernende" },
  "Октобарски испитни рок-ванредни ученици": { en: "October exam period — external students", de: "Prüfungstermin im Oktober — externe Lernende" },
  "Августовски испитни рок-ванредни ученици": { en: "August exam period — external students", de: "Prüfungstermin im August — externe Lernende" },
  "Јунски испитни рок-ванредни ученици": { en: "June exam period — external students", de: "Prüfungstermin im Juni — externe Lernende" },
  "Мартовски испитни рок-ванредни ученици": { en: "March exam period — external students", de: "Prüfungstermin im März — externe Lernende" },
  "Maртовски испитни рок-ванредни ученици": { en: "March exam period — external students", de: "Prüfungstermin im März — externe Lernende" },
  "Јануарски испитни рок-ванредни ученици": { en: "January exam period — external students", de: "Prüfungstermin im Januar — externe Lernende" },
  "Јануарски испитни рок — ванредни ученици": { en: "January exam period — external students", de: "Prüfungstermin im Januar — externe Lernende" },
  "Распоред полагања поправних, разредних и матурских испита у августовском испитном року 2021-2022 год.": { en: "August resit, year-end and graduation exam schedule, 2021–2022", de: "Augustplan für Nach-, Jahrgangs- und Abschlussprüfungen 2021–2022" },
  "Распоред поправних испита у августовском испитном року 2024/2025": { en: "August resit exam schedule, 2024/2025", de: "Nachprüfungsplan für August 2024/2025" },
  "Распоред поправног, матурског и завршног испита у августовском испитном року 2023/2024": { en: "August resit, graduation and final exam schedule, 2023/2024", de: "Augustplan für Nach- und Abschlussprüfungen 2023/2024" },
};

export const examScheduleNotes: Record<string, Pair> = {
  "У периоду од 10.07.2025. до 22.08.2025. школа ће радити у термину од 08-12 сати. Светлана Калапиш.": { en: "From 10 July to 22 August 2025, the school will be open from 08:00 to 12:00. Svetlana Kalapiš.", de: "Vom 10. Juli bis 22. August 2025 ist die Schule von 08:00 bis 12:00 Uhr geöffnet. Svetlana Kalapiš." },
  "Од 10.07.2024. школа ће радити у термину од 09-12 сати. Светлана Калапиш": { en: "From 10 July 2024, the school will be open from 09:00 to 12:00. Svetlana Kalapiš.", de: "Ab dem 10. Juli 2024 ist die Schule von 09:00 bis 12:00 Uhr geöffnet. Svetlana Kalapiš." },
};

export const examPrograms: Record<string, Pair> = {
  "medicinska-sestra-tehnicar": { en: "Nursing technician", de: "Pflegefachkraft" },
  "ginekolosko-akuserska-sestra": { en: "Gynaecological and obstetric nurse", de: "Gynäkologische und geburtshilfliche Pflege" },
  "medicinska-sestra-vaspitac": { en: "Nurse educator", de: "Pflegekraft und Erziehung" },
  "zdravstveni-negovatelj": { en: "Healthcare caregiver", de: "Pflegeassistenz" },
};

export const examIndexHeadings = {
  sr: { section: "Информације", title: "Испити и материјали", description: "Испитна и матурска питања, упутства и материјали према образовном профилу." },
  en: examText.en,
  de: examText.de,
};

export const examScheduleHeadings = {
  sr: { section: "Испити и материјали", title: "Распореди испита", description: "Архива распореда испитних рокова преузетих из објава школе." },
  en: { section: examText.en.title, ...examScheduleText.en },
  de: { section: examText.de.title, ...examScheduleText.de },
};

export function examProfileHeadings(id: string, originalTitle: string) {
  const title = examPrograms[id];
  if (!title) throw new Error(`Недостаје превод назива профила: ${id}`);
  return {
    sr: { section: "Испити и материјали", title: originalTitle, description: "Испитна питања, матурски или завршни испит и расположиви материјали за овај профил." },
    en: { section: examText.en.title, title: title.en, description: examText.en.pageDescription },
    de: { section: examText.de.title, title: title.de, description: examText.de.pageDescription },
  };
}

export const examContent: Record<string, Pair> = {
  "Завршни испит": { en: "Final exam", de: "Abschlussprüfung" },
  "Радни задаци- практична провера знања": { en: "Work assignments — practical assessment of knowledge", de: "Arbeitsaufgaben — praktische Wissensprüfung" },
  "Матурски испит:": { en: "Graduation exam:", de: "Abschlussprüfung:" },
  "Српски језик и књижевност( писмени задатак )": { en: "Serbian language and literature (written assignment)", de: "Serbische Sprache und Literatur (schriftliche Aufgabe)" },
  "Српски језики књижевност( писмени задатак )": { en: "Serbian language and literature (written assignment)", de: "Serbische Sprache und Literatur (schriftliche Aufgabe)" },
  "Практични део испита:": { en: "Practical part of the exam:", de: "Praktischer Teil der Prüfung:" },
  "*Гинекологија са негом": { en: "*Gynaecology and nursing", de: "*Gynäkologie und Pflege" },
  "*Акушерство са негом": { en: "*Obstetrics and nursing", de: "*Geburtshilfe und Pflege" },
  "*Здравствена нега( Гинеколошко-акушерско одељење)": { en: "*Nursing (gynaecology and obstetrics ward)", de: "*Pflege (gynäkologisch-geburtshilfliche Abteilung)" },
  "Изборни предмети:": { en: "Elective subjects:", de: "Wahlfächer:" },
  "*Физика": { en: "*Physics", de: "*Physik" },
  "*Хемија": { en: "*Chemistry", de: "*Chemie" },
  "*Биологија": { en: "*Biology", de: "*Biologie" },
  "*Математика ГАС-Математика": { en: "*Mathematics: GAS Mathematics", de: "*Mathematik: GAS Mathematik" },
  "*Страни језик": { en: "*Foreign language", de: "*Fremdsprache" },
  "*Психологија": { en: "*Psychology", de: "*Psychologie" },
  "*Филозофија": { en: "*Philosophy", de: "*Philosophie" },
  "*Педијатрија са негом": { en: "*Paediatrics and nursing", de: "*Pädiatrie und Pflege" },
  "*Инфектологија са негом": { en: "*Infectious diseases and nursing", de: "*Infektiologie und Pflege" },
  "*Васпитање и нега деце( предшколска установа )": { en: "*Child education and care (preschool institution)", de: "*Erziehung und Pflege von Kindern (Vorschuleinrichtung)" },
  "*Педијатрија са негом( Педијатријско одељење )": { en: "*Paediatrics and nursing (paediatric ward)", de: "*Pädiatrie und Pflege (pädiatrische Abteilung)" },
  "*Математика MСВ Mатематика": { en: "*Mathematics: MSV Mathematics", de: "*Mathematik: MSV Mathematik" },
  "*Страни језик МСВ Немачки језик, МСВ Немачки језик-граматика МСВ Енглески језик": { en: "*Foreign language: MSV German, German grammar and English", de: "*Fremdsprache: MSV Deutsch, deutsche Grammatik und Englisch" },
  "*Психологија МСВ Психологија": { en: "*Psychology: MSV Psychology", de: "*Psychologie: MSV Psychologie" },
  "*Дечја психологија МСВ Дечја психологија": { en: "*Child psychology: MSV Child psychology", de: "*Kinderpsychologie: MSV Kinderpsychologie" },
  "*Филозофија МСВ Филозофија": { en: "*Philosophy: MSV Philosophy", de: "*Philosophie: MSV Philosophie" },
  "*Васпитање и нега деце МСВ Васпитање и нега деце-теорија": { en: "*Child education and care: MSV theory", de: "*Erziehung und Pflege von Kindern: MSV Theorie" },
  "*Предшколска педагогија МСВ Предшколска педагогија": { en: "*Preschool education: MSV Preschool education", de: "*Vorschulpädagogik: MSV Vorschulpädagogik" },
  "*Педијатрија са негом МСВ Педијатрија-теорија": { en: "*Paediatrics and nursing: MSV Paediatrics theory", de: "*Pädiatrie und Pflege: MSV Pädiatrie Theorie" },
  "*Област уметности МСВ-Ликовна култура МСВ-Музичка култура": { en: "*Arts: MSV Art and MSV Music", de: "*Künstlerischer Bereich: MSV Kunst und MSV Musik" },
  "Документ можете преузети једноставним кликом на плаво поље.": { en: "You can download a document by clicking its link.", de: "Sie können ein Dokument über den entsprechenden Link herunterladen." },
  "Тест знања( Здравствена нега I, II, III, IV; Хирургија; Интерна медицина; Инфектологија)": { en: "Knowledge test (Nursing I, II, III, IV; Surgery; Internal medicine; Infectious diseases)", de: "Wissenstest (Pflege I, II, III, IV; Chirurgie; Innere Medizin; Infektiologie)" },
  "Здравствена нега( Радни задаци- практични део испита)": { en: "Nursing (work assignments — practical part of the exam)", de: "Pflege (Arbeitsaufgaben — praktischer Prüfungsteil)" },
  "Приручник о полагању матурског испита можете преузети овде.": { en: "The graduation exam handbook can be downloaded here.", de: "Das Handbuch zur Abschlussprüfung kann hier heruntergeladen werden." },
  "Медицинска сестра-техничар приручник": { en: "Nursing technician handbook", de: "Handbuch für Pflegefachkräfte" },
};

export const examDocumentTitles: Record<string, Pair> = {
  "PREDŠKOLSKA PEDAGOGIJA": { en: "Preschool education", de: "Vorschulpädagogik" },
  "DEČIJA PSIHOLOGIJA": { en: "Child psychology", de: "Kinderpsychologie" },
  "KNJIŽEVNOST ZA DECU": { en: "Children's literature", de: "Kinderliteratur" },
  "PEDIJATRIJA SA NEGOM(teorija)": { en: "Paediatrics and nursing (theory)", de: "Pädiatrie und Pflege (Theorie)" },
  "PEDIJATRIJA SA NEGOM (teorija)": { en: "Paediatrics and nursing (theory)", de: "Pädiatrie und Pflege (Theorie)" },
  "PEDIJATRIJA SA NEGOM(vežbe)": { en: "Paediatrics and nursing (practice)", de: "Pädiatrie und Pflege (Übungen)" },
  "VASPITANJE I NEGA DECE(teorija)": { en: "Child education and care (theory)", de: "Erziehung und Pflege von Kindern (Theorie)" },
  "VASPITANJE I NEGA DECE(vežbe)": { en: "Child education and care (practice)", de: "Erziehung und Pflege von Kindern (Übungen)" },
  "PSIHOLOGIJA": { en: "Psychology", de: "Psychologie" },
  "ZDRAVSTVENA NEGA I": { en: "Nursing I", de: "Pflege I" },
  "ANATOMIJA": { en: "Anatomy", de: "Anatomie" },
  "GEOGRAFIJA": { en: "Geography", de: "Geografie" },
  "ISTORIJA": { en: "History", de: "Geschichte" },
  "LATINSKI JEZIK": { en: "Latin", de: "Latein" },
  "PRVA POMOC": { en: "First aid", de: "Erste Hilfe" },
  "ZDR. PSIHOLOGIJA": { en: "Health psychology", de: "Gesundheitspsychologie" },
  "BIOLOGIJA": { en: "Biology", de: "Biologie" },
  "FIZIKA": { en: "Physics", de: "Physik" },
  "MEDICINSKA ETIKA": { en: "Medical ethics", de: "Medizinethik" },
  "ZDR.NEGA II TEORIJA": { en: "Nursing II (theory)", de: "Pflege II (Theorie)" },
  "ZDR.NEGA II": { en: "Nursing II", de: "Pflege II" },
  "SOCIOLOGIJA I PRAVA GRAĐANA": { en: "Sociology and citizens' rights", de: "Soziologie und Bürgerrechte" },
  "KULTURA TELA": { en: "Physical culture", de: "Körperkultur" },
  "GINEKOLOGIJA(vežbe)": { en: "Gynaecology (practice)", de: "Gynäkologie (Übungen)" },
  "NEUROLOGIJA(vežbe)": { en: "Neurology (practice)", de: "Neurologie (Übungen)" },
  "ZD.NEGA U HIRURGIJI(vežbe)": { en: "Surgical nursing (practice)", de: "Chirurgische Pflege (Übungen)" },
  "ZDR.NEGA U INFEKTOLOGIJI(vežbe)": { en: "Infectious disease nursing (practice)", de: "Pflege in der Infektiologie (Übungen)" },
  "ZDR.NEGA U INTERNOJ MEDICINI(vežbe)": { en: "Nursing in internal medicine (practice)", de: "Pflege in der Inneren Medizin (Übungen)" },
  "ZDR. NEGA III TEORIJA": { en: "Nursing III (theory)", de: "Pflege III (Theorie)" },
  "PEDIJATRIJA(vežbe)": { en: "Paediatrics (practice)", de: "Pädiatrie (Übungen)" },
  "ZDRAVSTVENA NEGA": { en: "Nursing", de: "Pflege" },
  "PREDUZETNIŠTVO": { en: "Entrepreneurship", de: "Unternehmertum" },
  "IV-RAZRED-PEDIJATRIJA(teorija)": { en: "Year IV — Paediatrics (theory)", de: "IV. Jahrgang — Pädiatrie (Theorie)" },
  "ГАС-Математика": { en: "GAS Mathematics", de: "GAS Mathematik" },
  "MСВ Mатематика": { en: "MSV Mathematics", de: "MSV Mathematik" },
  "МСВ Немачки језик": { en: "MSV German", de: "MSV Deutsch" },
  "МСВ Немачки језик-граматика": { en: "MSV German grammar", de: "MSV deutsche Grammatik" },
  "МСВ Енглески језик": { en: "MSV English", de: "MSV Englisch" },
  "МСВ Психологија": { en: "MSV Psychology", de: "MSV Psychologie" },
  "МСВ Дечја психологија": { en: "MSV Child psychology", de: "MSV Kinderpsychologie" },
  "МСВ Филозофија": { en: "MSV Philosophy", de: "MSV Philosophie" },
  "МСВ Васпитање и нега деце-теорија": { en: "MSV Child education and care (theory)", de: "MSV Erziehung und Pflege von Kindern (Theorie)" },
  "МСВ Предшколска педагогија": { en: "MSV Preschool education", de: "MSV Vorschulpädagogik" },
  "МСВ Педијатрија-теорија": { en: "MSV Paediatrics (theory)", de: "MSV Pädiatrie (Theorie)" },
  "МСВ-Ликовна култура": { en: "MSV Art", de: "MSV Kunst" },
  "МСВ-Музичка култура": { en: "MSV Music", de: "MSV Musik" },
  "Медицинска сестра-техничар приручник": { en: "Nursing technician handbook", de: "Handbuch für Pflegefachkräfte" },
};
