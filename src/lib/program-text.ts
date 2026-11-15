export const programmeText = {
  sr: {
    title: "Образовни профили", description: "Упознајте профиле из области здравства и социјалне заштите и сазнајте више о настави и могућностима школовања.",
  },
  en: {
    title: "Study programmes", description: "Explore programmes in healthcare and social protection and learn more about study opportunities.",
    intro: "Programme overview", select: "Choose a programme to see its description.", profile: "Study programme",
    details: "Subjects and programme details (in Serbian)", notice: "Programme descriptions are available in Serbian.",
    current: "For current admission requirements and available places, contact the school or consult the official admissions notice.",
  },
  de: {
    title: "Bildungsprofile", description: "Lernen Sie die Bildungsprofile im Gesundheits- und Sozialwesen und die Ausbildungsmöglichkeiten kennen.",
    intro: "Überblick über die Profile", select: "Wählen Sie ein Profil, um die Beschreibung anzusehen.", profile: "Bildungsprofil",
    details: "Fächer und Profildetails (auf Serbisch)", notice: "Die Profilbeschreibungen sind auf Serbisch verfügbar.",
    current: "Für aktuelle Aufnahmebedingungen und verfügbare Plätze wenden Sie sich an die Schule oder lesen Sie die offizielle Aufnahmeausschreibung.",
  },
} as const;

export const programmeHeadings = {
  sr: { section: programmeText.sr.title, ...programmeText.sr },
  en: { section: programmeText.en.title, ...programmeText.en },
  de: { section: programmeText.de.title, ...programmeText.de },
};
