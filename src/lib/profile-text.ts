type Translation = { en: string; de: string };
type ProfileTranslation = {
  description: string;
  overview: readonly [string, string];
  learning: readonly [string, string, string, string];
  opportunities: string;
  suitable: string;
  exam: string;
};

export const profileText = {
  en: {
    profile: "Study programme", meet: "Discover the programme", skills: "Knowledge and skills", learn: "What will you learn?",
    learnIntro: "The programme combines general education with professional subjects and skills important for working with people.",
    future: "Looking ahead", after: "After your studies",
    disclaimer: "Employment and further education opportunities depend on applicable regulations and the requirements of each institution.",
    suitable: "Who might this programme suit?", subjects: "Subjects and teaching", years: "Subjects by year",
    curriculum: "This overview is based on a previously published school curriculum. For the current curriculum and admission requirements,",
    contact: "contact the school", materials: "Exams and materials for this programme", year: "year", notes: "Notes",
    completion: "Completing your studies", current: "For current requirements and materials,", examsLink: "see the exams for this programme",
    or: "or", all: "All study programmes",
  },
  de: {
    profile: "Bildungsprofil", meet: "Das Profil kennenlernen", skills: "Kenntnisse und Fähigkeiten", learn: "Was lernen Sie?",
    learnIntro: "Das Profil verbindet Allgemeinbildung mit Fachunterricht und Fähigkeiten, die für die Arbeit mit Menschen wichtig sind.",
    future: "Blick in die Zukunft", after: "Nach der Ausbildung",
    disclaimer: "Beschäftigungs- und Weiterbildungsmöglichkeiten hängen von den geltenden Vorschriften und den Anforderungen der jeweiligen Einrichtung ab.",
    suitable: "Für wen eignet sich dieses Profil?", subjects: "Fächer und Unterricht", years: "Unterricht nach Jahrgängen",
    curriculum: "Diese Übersicht basiert auf einem früher veröffentlichten Lehrplan. Für den aktuellen Lehrplan und die Aufnahmebedingungen",
    contact: "wenden Sie sich an die Schule", materials: "Prüfungen und Materialien für dieses Profil", year: "Jahrgang", notes: "Hinweise",
    completion: "Abschluss der Ausbildung", current: "Für aktuelle Bedingungen und Materialien", examsLink: "siehe Prüfungen für dieses Profil",
    or: "oder", all: "Alle Bildungsprofile",
  },
} as const;

export const profileImageAlts: Record<string, Translation> = {
  "medicinska-sestra-tehnicar": { en: "Healthcare workers measuring a patient's blood pressure", de: "Pflegekräfte messen den Blutdruck eines Patienten" },
  "ginekolosko-akuserska-sestra": { en: "A newborn in a hospital setting", de: "Ein Neugeborenes in einer klinischen Umgebung" },
  "medicinska-sestra-vaspitac": { en: "A baby sitting on the floor and playing with a wooden toy", de: "Ein Baby sitzt auf dem Boden und spielt mit einem Holzspielzeug" },
  "zdravstveni-negovatelj": { en: "A student practising a nursing procedure", de: "Eine Schülerin übt einen Pflegeschritt" },
};

export const profileTranslations: Record<string, Record<"en" | "de", ProfileTranslation>> = {
  "medicinska-sestra-tehnicar": {
    en: {
      description: "A programme focused on nursing care and working with patients.",
      overview: [
        "Nursing technicians are educated to work in healthcare teams and provide nursing care to people of different ages. The programme connects knowledge of the human body, health and illness with care for patients' needs and dignity.",
        "Alongside general subjects, students explore different fields of medicine and develop a responsible approach to work, communication with patients and cooperation with other healthcare professionals. Learning includes theory and practical exercises.",
      ],
      learning: ["Anatomy and physiology, nursing care and first aid.", "Hygiene, microbiology, pharmacology and medical ethics.", "Basics of internal medicine, surgery, paediatrics and other clinical fields.", "Considerate communication, teamwork and a responsible approach to patients."],
      opportunities: "The knowledge gained can provide a basis for work in healthcare institutions, such as hospitals and health centres, or for further healthcare education.",
      suitable: "The programme may suit people interested in medicine and working with others who are willing to learn, cooperate and treat others with patience and respect.",
      exam: "The graduation exam includes Serbian language, a knowledge test and practical nursing tasks.",
    },
    de: {
      description: "Ein Profil mit Schwerpunkt auf Pflege und der Arbeit mit Patientinnen und Patienten.",
      overview: [
        "Pflegefachkräfte werden für die Arbeit im Gesundheitsteam und die Pflege von Menschen unterschiedlichen Alters ausgebildet. Das Profil verbindet Kenntnisse über den menschlichen Körper, Gesundheit und Krankheit mit der Sorge um die Bedürfnisse und Würde der Patientinnen und Patienten.",
        "Neben allgemeinbildenden Fächern lernen die Schülerinnen und Schüler verschiedene medizinische Bereiche kennen und entwickeln einen verantwortungsvollen Umgang mit ihrer Arbeit, die Kommunikation mit Patienten und die Zusammenarbeit mit anderen Gesundheitsfachkräften. Die Ausbildung umfasst Theorie und praktische Übungen.",
      ],
      learning: ["Anatomie und Physiologie, Pflege und Erste Hilfe.", "Hygiene, Mikrobiologie, Pharmakologie und medizinische Ethik.", "Grundlagen der Inneren Medizin, Chirurgie, Pädiatrie und weiterer klinischer Bereiche.", "Einfühlsame Kommunikation, Teamarbeit und verantwortungsvoller Umgang mit Patienten."],
      opportunities: "Die erworbenen Kenntnisse können eine Grundlage für die Arbeit in Gesundheitseinrichtungen wie Krankenhäusern und Gesundheitszentren sowie für eine weitere Ausbildung im Gesundheitswesen sein.",
      suitable: "Das Profil kann für Menschen geeignet sein, die sich für Medizin und die Arbeit mit anderen interessieren und bereit sind, zu lernen, zusammenzuarbeiten und anderen mit Geduld und Respekt zu begegnen.",
      exam: "Die Abschlussprüfung umfasst Serbisch, einen Wissenstest und praktische Aufgaben aus der Pflege.",
    },
  },
  "ginekolosko-akuserska-sestra": {
    en: {
      description: "A programme covering gynaecology, obstetrics and nursing care.",
      overview: [
        "Gynaecological and obstetric nurses acquire nursing knowledge with a particular focus on women's health, pregnancy, childbirth and newborn care. Professional competence, sensitive communication and respect for privacy are central to the programme.",
        "Learning combines general and medical subjects with practical exercises. Students explore the basics of working in a healthcare team and the importance of supporting patients and families during sensitive periods of life.",
      ],
      learning: ["Anatomy and physiology, nursing care and first aid.", "Gynaecology and obstetrics with nursing care.", "Paediatrics with nursing care, hygiene and microbiology.", "Communication, discretion and cooperation in a healthcare team."],
      opportunities: "The programme can provide a basis for work in institutions providing gynaecological and obstetric care, as well as for further healthcare education.",
      suitable: "The programme may suit people interested in the health of women and newborns who wish to develop patience, responsibility and awareness of others' needs.",
      exam: "The practical part of the graduation exam covers gynaecology, obstetrics and nursing care.",
    },
    de: {
      description: "Ein Profil aus den Bereichen Gynäkologie, Geburtshilfe und Pflege.",
      overview: [
        "Gynäkologische und geburtshilfliche Pflegekräfte erwerben Pflegekenntnisse mit besonderem Blick auf die Gesundheit von Frauen, Schwangerschaft, Geburt und die Versorgung von Neugeborenen. Fachkompetenz, einfühlsame Kommunikation und die Achtung der Privatsphäre stehen im Mittelpunkt.",
        "Die Ausbildung verbindet allgemeinbildende und medizinische Fächer mit praktischen Übungen. Die Lernenden erkunden die Grundlagen der Arbeit im Gesundheitsteam und die Bedeutung der Unterstützung von Patientinnen und Familien in sensiblen Lebensphasen.",
      ],
      learning: ["Anatomie und Physiologie, Pflege und Erste Hilfe.", "Gynäkologie und Geburtshilfe mit Pflege.", "Pädiatrie mit Pflege, Hygiene und Mikrobiologie.", "Kommunikation, Diskretion und Zusammenarbeit im Gesundheitsteam."],
      opportunities: "Die Ausbildung kann eine Grundlage für die Arbeit in Einrichtungen der gynäkologischen und geburtshilflichen Versorgung sowie für eine weitere Ausbildung im Gesundheitswesen sein.",
      suitable: "Das Profil kann für Menschen geeignet sein, die sich für die Gesundheit von Frauen und Neugeborenen interessieren und Geduld, Verantwortung und Gespür für die Bedürfnisse anderer entwickeln möchten.",
      exam: "Der praktische Teil der Abschlussprüfung umfasst Gynäkologie, Geburtshilfe und Pflege.",
    },
  },
  "medicinska-sestra-vaspitac": {
    en: {
      description: "Education for working with children, combining nursing care and early childhood education.",
      overview: [
        "The nurse educator programme combines nursing care, education and support for early childhood development. It focuses on understanding children's needs, creating a stimulating environment and cooperating with families and colleagues.",
        "Alongside general subjects, students study medical, psychological and educational topics. They connect theory with exercises and explore the importance of play, communication, care and daily routines in early childhood.",
      ],
      learning: ["Nursing care in early childhood and paediatrics with nursing care.", "Child psychology, preschool pedagogy and early childhood education.", "Children's literature and music education in early childhood.", "Communication with children and families, careful observation and teamwork."],
      opportunities: "The programme provides a basis for work with young children in preschool institutions and for further education in related fields.",
      suitable: "The programme may suit people who enjoy working with children, have patience and creativity and are interested in the connection between health, play and development.",
      exam: "The practical part of the graduation exam includes early childhood education and care and paediatrics with nursing care.",
    },
    de: {
      description: "Eine Ausbildung für die Arbeit mit Kindern, die Pflege und Erziehung verbindet.",
      overview: [
        "Das Profil verbindet Pflege, Erziehung und die Unterstützung der frühkindlichen Entwicklung. Es konzentriert sich darauf, die Bedürfnisse des Kindes zu verstehen, eine fördernde Umgebung zu schaffen und mit Familien und Kolleginnen und Kollegen zusammenzuarbeiten.",
        "Neben allgemeinbildenden Fächern lernen die Schülerinnen und Schüler medizinische, psychologische und pädagogische Bereiche kennen. Sie verbinden theoretisches Wissen mit Übungen und erkunden die Bedeutung von Spiel, Kommunikation, Pflege und Alltagsgewohnheiten in der frühen Kindheit.",
      ],
      learning: ["Pflege von Kindern im frühen Alter und Pädiatrie mit Pflege.", "Kinderpsychologie, Vorschulpädagogik und frühkindliche Erziehung.", "Kinderliteratur und musikalische Erziehung im frühen Kindesalter.", "Kommunikation mit Kindern und Familien, aufmerksame Beobachtung und Teamarbeit."],
      opportunities: "Das Profil bietet eine Grundlage für die Arbeit mit Kleinkindern in Vorschuleinrichtungen und für eine weitere Ausbildung in verwandten Bereichen.",
      suitable: "Das Profil kann für Menschen geeignet sein, die gern mit Kindern arbeiten, Geduld und Kreativität mitbringen und sich für den Zusammenhang zwischen Gesundheit, Spiel und Entwicklung interessieren.",
      exam: "Der praktische Teil der Abschlussprüfung umfasst die Erziehung und Pflege von Kindern sowie Pädiatrie mit Pflege.",
    },
  },
  "zdravstveni-negovatelj": {
    en: {
      description: "A programme dedicated to the foundations of healthcare and practical work.",
      overview: [
        "Healthcare caregivers are educated to provide care and support to people who need assistance in daily life. The programme emphasises humane treatment, preserving dignity and cooperation with other team members.",
        "Teaching combines general subjects with the foundations of healthcare, nutrition and clinical medicine. Through theory and exercises, students explore the different needs of people receiving care, including care at home.",
      ],
      learning: ["Anatomy and physiology, nursing care and hygiene.", "Nutrition, health psychology and the basics of clinical medicine.", "Home healthcare and the foundations of medical rehabilitation.", "Responsible communication, patience and support in daily activities."],
      opportunities: "The knowledge gained can provide a basis for care and support work in healthcare and social care institutions and in other forms of organised care.",
      suitable: "The programme may suit people who wish to help others, value practical work and are willing to provide attentive and respectful care.",
      exam: "The final exam includes a practical assessment through work assignments.",
    },
    de: {
      description: "Ein Profil zu den Grundlagen der Pflege und zur praktischen Arbeit.",
      overview: [
        "Pflegeassistenzkräfte werden für Pflege und Unterstützung von Menschen ausgebildet, die im Alltag Hilfe benötigen. Das Profil betont einen menschlichen Umgang, die Wahrung der Würde und die Zusammenarbeit mit anderen Teammitgliedern.",
        "Der Unterricht verbindet allgemeinbildende Fächer mit Grundlagen der Pflege, Ernährung und klinischen Medizin. In Theorie und Übungen lernen die Schülerinnen und Schüler unterschiedliche Bedürfnisse pflegebedürftiger Menschen kennen, auch in der häuslichen Pflege.",
      ],
      learning: ["Anatomie und Physiologie, Pflege und Hygiene.", "Ernährung, Gesundheitspsychologie und Grundlagen der klinischen Medizin.", "Häusliche Pflege und Grundlagen der medizinischen Rehabilitation.", "Verantwortungsvolle Kommunikation, Geduld und Unterstützung bei alltäglichen Tätigkeiten."],
      opportunities: "Die erworbenen Kenntnisse können eine Grundlage für Pflege- und Unterstützungsaufgaben in Gesundheits- und Sozialeinrichtungen sowie in anderen Formen organisierter Pflege sein.",
      suitable: "Das Profil kann für Menschen geeignet sein, die anderen helfen möchten, praktische Arbeit schätzen und bereit sind, aufmerksam und respektvoll zu pflegen.",
      exam: "Die Abschlussprüfung umfasst eine praktische Überprüfung der Kenntnisse anhand von Arbeitsaufgaben.",
    },
  },
};

export const profileSubjects: Record<string, Translation> = {
  "Српски језик и књижевност": { en: "Serbian language and literature", de: "Serbische Sprache und Literatur" },
  "Српски језики књижевност": { en: "Serbian language and literature", de: "Serbische Sprache und Literatur" },
  "Страни језик": { en: "Foreign language", de: "Fremdsprache" },
  "Историја": { en: "History", de: "Geschichte" },
  "Музичка уметност": { en: "Music", de: "Musik" },
  "Музичка култура": { en: "Music", de: "Musik" },
  "Ликовна култура": { en: "Visual arts", de: "Bildende Kunst" },
  "Физичко васпитање": { en: "Physical education", de: "Sportunterricht" },
  "Физичко": { en: "Physical education", de: "Sportunterricht" },
  "Математика": { en: "Mathematics", de: "Mathematik" },
  "Рачунарство и информатика": { en: "Computing and IT", de: "Informatik" },
  "Географија": { en: "Geography", de: "Geografie" },
  "Физика": { en: "Physics", de: "Physik" },
  "Хемија": { en: "Chemistry", de: "Chemie" },
  "Биологија": { en: "Biology", de: "Biologie" },
  "Билогија": { en: "Biology", de: "Biologie" },
  "Анатомија и физиологија": { en: "Anatomy and physiology", de: "Anatomie und Physiologie" },
  "Латински језик": { en: "Latin", de: "Latein" },
  "Здравствена нега": { en: "Nursing care", de: "Pflege" },
  "Прва помоћ": { en: "First aid", de: "Erste Hilfe" },
  "Изборни предмет": { en: "Elective subject", de: "Wahlfach" },
  "Изборни": { en: "Elective", de: "Wahlfach" },
  "Хигијена са здравственим": { en: "Hygiene and health education", de: "Hygiene und Gesundheitserziehung" },
  "Хигијена са здравственим васпитањем": { en: "Hygiene and health education", de: "Hygiene und Gesundheitserziehung" },
  "Хигијена и здравствено васпитање": { en: "Hygiene and health education", de: "Hygiene und Gesundheitserziehung" },
  "Микробиологија са епидемиологијом": { en: "Microbiology and epidemiology", de: "Mikrobiologie und Epidemiologie" },
  "Патологија": { en: "Pathology", de: "Pathologie" },
  "Фармакологија": { en: "Pharmacology", de: "Pharmakologie" },
  "Психологија": { en: "Psychology", de: "Psychologie" },
  "Социологија": { en: "Sociology", de: "Soziologie" },
  "Педијатрија са негом": { en: "Paediatrics with nursing care", de: "Pädiatrie mit Pflege" },
  "Акушерство са негом": { en: "Obstetrics with nursing care", de: "Geburtshilfe mit Pflege" },
  "Хирургија са негом": { en: "Surgery with nursing care", de: "Chirurgie mit Pflege" },
  "Филозофија": { en: "Philosophy", de: "Philosophie" },
  "Устав и права грађана": { en: "Constitution and citizens' rights", de: "Verfassung und Bürgerrechte" },
  "Медицинска биохемија": { en: "Medical biochemistry", de: "Medizinische Biochemie" },
  "Интерна медицина": { en: "Internal medicine", de: "Innere Medizin" },
  "Гинекологија са негом": { en: "Gynaecology with nursing care", de: "Gynäkologie mit Pflege" },
  "Инфектологија са негом": { en: "Infectious diseases with nursing care", de: "Infektiologie mit Pflege" },
  "Исхрана": { en: "Nutrition", de: "Ernährung" },
  "Здравствена психологија": { en: "Health psychology", de: "Gesundheitspsychologie" },
  "Социологија са правима грађана": { en: "Sociology and citizens' rights", de: "Soziologie und Bürgerrechte" },
  "Основи клиничке медицине": { en: "Foundations of clinical medicine", de: "Grundlagen der klinischen Medizin" },
  "Инфектологија": { en: "Infectious diseases", de: "Infektiologie" },
  "Медицинска рехабилитација": { en: "Medical rehabilitation", de: "Medizinische Rehabilitation" },
  "Неуропсихијатрија": { en: "Neuropsychiatry", de: "Neuropsychiatrie" },
  "Здравствена нега у кући": { en: "Home healthcare", de: "Häusliche Pflege" },
  "Предузетништво": { en: "Entrepreneurship", de: "Unternehmertum" },
  "Здравствена нега деце раног узраста": { en: "Nursing care in early childhood", de: "Pflege von Kindern im frühen Alter" },
  "Предшколска педагогија": { en: "Preschool pedagogy", de: "Vorschulpädagogik" },
  "Дечја психологија": { en: "Child psychology", de: "Kinderpsychologie" },
  "Васпитање и неге деце": { en: "Child education and care", de: "Erziehung und Pflege von Kindern" },
  "Васпитање и нега деце": { en: "Child education and care", de: "Erziehung und Pflege von Kindern" },
  "Књижевност за децу": { en: "Children's literature", de: "Kinderliteratur" },
  "Музичко васпитање деце раног узраста": { en: "Music education in early childhood", de: "Musikalische Erziehung im frühen Kindesalter" },
  "Медицинска етика": { en: "Medical ethics", de: "Medizinische Ethik" },
  "Гинекологија и акушерство": { en: "Gynaecology and obstetrics", de: "Gynäkologie und Geburtshilfe" },
  "Хирургија": { en: "Surgery", de: "Chirurgie" },
  "Неурологија": { en: "Neurology", de: "Neurologie" },
  "Педијатрија": { en: "Paediatrics", de: "Pädiatrie" },
  "Психијатрија": { en: "Psychiatry", de: "Psychiatrie" },
};

export const profileNotes: Record<string, Translation> = {
  "*Енглески језик, Немачки језик, Руски језик, Француски језик": { en: "*English, German, Russian, French", de: "*Englisch, Deutsch, Russisch, Französisch" },
  "**Грађанско васпитање,Верска настава": { en: "**Civic education, religious education", de: "**Bürgerkunde, Religionsunterricht" },
  "***Изборни предмет према програму образовног профила": { en: "***Elective subject according to the programme curriculum", de: "***Wahlfach gemäß dem Lehrplan des Bildungsprofils" },
};

export function translatedProfileSubject(subject: string, locale: "en" | "de") {
  const match = /^(.*?)\s*(\*+)?$/.exec(subject);
  if (!match) throw new Error(`Непознат предмет: ${subject}`);
  const translated = profileSubjects[match[1]];
  if (!translated) throw new Error(`Недостаје превод предмета: ${subject}`);
  return `${translated[locale]}${match[2] ? ` ${match[2]}` : ""}`;
}

export function translatedProfileNote(note: string, locale: "en" | "de") {
  const translated = profileNotes[note];
  if (!translated) throw new Error(`Недостаје превод напомене: ${note}`);
  return translated[locale];
}
