export type LegalPageKind = "terms" | "privacy" | "cookies";

export type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  contactLink?: string;
  email?: boolean;
  settings?: boolean;
};

type LegalTranslation = {
  section: string;
  eyebrow: string;
  noticeLabel: string;
  notice: string;
  pages: Record<LegalPageKind, {
    title: string;
    description: string;
    sections: readonly LegalSection[];
  }>;
};

export const legalText = {
  en: {
    section: "Website information", eyebrow: "Information", noticeLabel: "Note:",
    notice: "This text is a draft. The school must confirm the information and retention periods and arrange a legal review before publication.",
    pages: {
      terms: {
        title: "Terms of use", description: "Information about using the content and services on the school website.",
        sections: [
          { heading: "About the website", paragraphs: ["The website of Medical School “Stevica Jovanović” in Pančevo is intended to inform students, parents and other visitors about the school's work."] },
          { heading: "Information and documents", paragraphs: ["Content is published for information. For current deadlines, conditions and official information, contact the school via the contact page. The school may change or update the content."], contactLink: "Contact page" },
          { heading: "Use of content", paragraphs: ["Respect the rights of authors and other rights holders in texts, photographs and documents. For uses beyond those permitted by law, contact the school or the relevant rights holder."] },
          { heading: "External links", paragraphs: ["The website may contain links to third-party services. When you visit those websites, their terms and privacy policies apply."] },
        ],
      },
      privacy: {
        title: "Privacy policy", description: "How data related to use of the website is processed and whom you can contact.",
        sections: [
          { heading: "Contact the school", paragraphs: ["Medical School “Stevica Jovanović”, Pasterova 2, 26101 Pančevo. You can send privacy questions to the school secretariat at:"], email: true },
          { heading: "Messages through the contact form", paragraphs: [
            "When you send a message, the name, email address, optional phone number, subject and message you enter are forwarded to the school through the configured email service so that it can respond. An automatic confirmation containing your name, but not the message content, is also sent to the email address you entered. Do not enter sensitive personal or health information. The school must determine the service and message retention periods before publication.",
            "An hCaptcha check is required to protect against automated messages. It loads only when you start it; at that point your browser connects to the hCaptcha service, which may process browser data and use cookies in accordance with its policies. Without the check, you can contact the school directly by email or telephone.",
          ] },
          { heading: "Interaction data", paragraphs: [
            "If you allow views and likes, the website uses a random identifier in your browser to count views and remember likes. Interaction records are stored in the Supabase database when it is connected. The school has yet to determine the retention period for these records.",
            "Withdrawing your choice removes the identifier from the browser, but does not automatically delete records previously saved in the database. Contact the school with requests concerning your data.",
          ] },
          { heading: "YouTube and external services", paragraphs: ["If you allow YouTube content, your browser connects to YouTube and the service may process data in accordance with its policies. The map on the contact page loads from Google Maps only when you choose to load it; your browser then connects to Google, which may process data and use cookies in accordance with its policies. External links open only when you select them."] },
          { heading: "Your choices and questions", paragraphs: ["You can change your choice for interactions and YouTube at any time. Contact the school with questions about accessing, correcting or deleting data; each request is considered in accordance with applicable regulations."], settings: true },
        ],
      },
      cookies: {
        title: "Cookie policy", description: "Information about cookies, video content and the choices you control.",
        sections: [
          { heading: "What are cookies?", paragraphs: ["Cookies are small records your browser stores for a website. Essential records enable basic functions; additional functions are activated only according to your choices."] },
          { heading: "Essential cookies", paragraphs: ["school-cookie-preferences remembers your settings for 180 days. school-language remembers your language choice for up to one year. Administrator sign-in uses session cookies for secure sign-in. These are not intended to track visitors."] },
          { heading: "Views and likes", paragraphs: ["With consent, school-news-visitor stores a random identifier for up to one year to record views and remember likes. Withdrawing consent removes this cookie; previously stored records are not deleted automatically."] },
          { heading: "YouTube content", paragraphs: ["Embedded videos load only when you allow YouTube. Once loaded, YouTube may use its own cookies or similar technologies in accordance with its policies."] },
          { heading: "Google Maps", paragraphs: ["The map on the contact page loads only when you choose to load it. Google may use its own cookies or similar technologies in accordance with its policies."] },
          { heading: "hCaptcha check", paragraphs: ["The contact form check loads only when you start it. hCaptcha may use cookies or similar technologies in accordance with its policies."] },
          { heading: "Change your choices", paragraphs: ["You can accept all, reject optional functions or select individual functions. You can change your choices at any time."], settings: true },
        ],
      },
    },
  },
  de: {
    section: "Informationen zur Website", eyebrow: "Informationen", noticeLabel: "Hinweis:",
    notice: "Dieser Text ist ein Entwurf. Die Schule muss die Angaben und Aufbewahrungsfristen bestätigen und vor der Veröffentlichung eine rechtliche Prüfung veranlassen.",
    pages: {
      terms: {
        title: "Nutzungsbedingungen", description: "Informationen zur Nutzung der Inhalte und Dienste auf der Schulwebsite.",
        sections: [
          { heading: "Über die Website", paragraphs: ["Die Website der Medizinischen Schule „Stevica Jovanović“ in Pančevo dient dazu, Schülerinnen und Schüler, Eltern und andere Besucherinnen und Besucher über die Arbeit der Schule zu informieren."] },
          { heading: "Informationen und Dokumente", paragraphs: ["Die Inhalte werden zur Information veröffentlicht. Für aktuelle Fristen, Bedingungen und offizielle Informationen wenden Sie sich über die Kontaktseite an die Schule. Die Schule kann die Inhalte ändern oder aktualisieren."], contactLink: "Kontaktseite" },
          { heading: "Nutzung der Inhalte", paragraphs: ["Beachten Sie die Rechte der Urheberinnen und Urheber und anderer Rechteinhaber an Texten, Fotografien und Dokumenten. Für Nutzungen, die über das gesetzlich Erlaubte hinausgehen, wenden Sie sich an die Schule oder den jeweiligen Rechteinhaber."] },
          { heading: "Externe Links", paragraphs: ["Die Website kann Links zu Diensten Dritter enthalten. Beim Besuch dieser Websites gelten deren Bedingungen und Datenschutzrichtlinien."] },
        ],
      },
      privacy: {
        title: "Datenschutzerklärung", description: "Wie Daten im Zusammenhang mit der Nutzung der Website verarbeitet werden und an wen Sie sich wenden können.",
        sections: [
          { heading: "Kontakt zur Schule", paragraphs: ["Medizinische Schule „Stevica Jovanović“, Pasterova 2, 26101 Pančevo. Fragen zum Datenschutz können Sie an das Schulsekretariat richten:"], email: true },
          { heading: "Nachrichten über das Kontaktformular", paragraphs: [
            "Wenn Sie eine Nachricht senden, werden der eingegebene Name, die E-Mail-Adresse, die optionale Telefonnummer, der Betreff und der Inhalt der Nachricht über den eingerichteten E-Mail-Dienst an die Schule weitergeleitet, damit diese antworten kann. An die angegebene E-Mail-Adresse wird außerdem eine automatische Bestätigung mit Ihrem Namen, aber ohne den Nachrichteninhalt gesendet. Geben Sie keine sensiblen personenbezogenen oder Gesundheitsdaten ein. Die Schule muss den Dienst und die Aufbewahrungsfristen für Nachrichten vor der Veröffentlichung festlegen.",
            "Zum Schutz vor automatisierten Nachrichten ist eine hCaptcha-Prüfung erforderlich. Sie wird erst geladen, wenn Sie sie starten; dann verbindet sich Ihr Browser mit dem hCaptcha-Dienst, der Browserdaten verarbeiten und Cookies gemäß seinen Richtlinien verwenden kann. Ohne diese Prüfung können Sie die Schule direkt per E-Mail oder Telefon kontaktieren.",
          ] },
          { heading: "Interaktionsdaten", paragraphs: [
            "Wenn Sie Aufrufe und „Gefällt mir“ erlauben, verwendet die Website eine zufällige Kennung in Ihrem Browser, um Aufrufe zu zählen und „Gefällt mir“-Angaben zu speichern. Interaktionsdaten werden in der Supabase-Datenbank gespeichert, wenn diese verbunden ist. Die Aufbewahrungsfrist für diese Daten muss die Schule noch festlegen.",
            "Wenn Sie Ihre Auswahl zurückziehen, wird die Kennung aus dem Browser entfernt; zuvor in der Datenbank gespeicherte Datensätze werden jedoch nicht automatisch gelöscht. Wenden Sie sich bei Anfragen zu Ihren Daten an die Schule.",
          ] },
          { heading: "YouTube und externe Dienste", paragraphs: ["Wenn Sie YouTube-Inhalte erlauben, verbindet sich Ihr Browser mit YouTube; der Dienst kann Daten gemäß seinen Richtlinien verarbeiten. Die Karte auf der Kontaktseite wird erst dann von Google Maps geladen, wenn Sie dies auswählen; Ihr Browser verbindet sich dann mit Google, das Daten verarbeiten und Cookies gemäß seinen Richtlinien verwenden kann. Externe Links werden erst geöffnet, wenn Sie sie auswählen."] },
          { heading: "Ihre Auswahl und Fragen", paragraphs: ["Sie können Ihre Auswahl für Interaktionen und YouTube jederzeit ändern. Bei Fragen zum Zugriff auf, zur Berichtigung oder zur Löschung von Daten wenden Sie sich an die Schule; über jede Anfrage wird gemäß den geltenden Vorschriften entschieden."], settings: true },
        ],
      },
      cookies: {
        title: "Cookie-Richtlinie", description: "Informationen über Cookies, Videoinhalte und die Auswahlmöglichkeiten, die Sie steuern.",
        sections: [
          { heading: "Was sind Cookies?", paragraphs: ["Cookies sind kleine Datensätze, die Ihr Browser für eine Website speichert. Notwendige Datensätze ermöglichen grundlegende Funktionen; zusätzliche Funktionen werden nur entsprechend Ihrer Auswahl aktiviert."] },
          { heading: "Notwendige Cookies", paragraphs: ["school-cookie-preferences speichert Ihre Einstellungen für 180 Tage. school-language speichert Ihre Sprachauswahl für bis zu ein Jahr. Die Administratoranmeldung verwendet Sitzungscookies für eine sichere Anmeldung. Sie dienen nicht der Nachverfolgung von Besucherinnen und Besuchern."] },
          { heading: "Aufrufe und „Gefällt mir“", paragraphs: ["Mit Ihrer Einwilligung speichert school-news-visitor eine zufällige Kennung für bis zu ein Jahr, um Aufrufe zu erfassen und „Gefällt mir“-Angaben zu speichern. Der Widerruf der Einwilligung entfernt dieses Cookie; zuvor gespeicherte Datensätze werden nicht automatisch gelöscht."] },
          { heading: "YouTube-Inhalte", paragraphs: ["Eingebettete Videos werden nur geladen, wenn Sie YouTube erlauben. Nach dem Laden kann YouTube eigene Cookies oder ähnliche Technologien gemäß seinen Richtlinien verwenden."] },
          { heading: "Google Maps", paragraphs: ["Die Karte auf der Kontaktseite wird erst geladen, wenn Sie dies auswählen. Google kann eigene Cookies oder ähnliche Technologien gemäß seinen Richtlinien verwenden."] },
          { heading: "hCaptcha-Prüfung", paragraphs: ["Die Prüfung für das Kontaktformular wird erst geladen, wenn Sie sie starten. hCaptcha kann Cookies oder ähnliche Technologien gemäß seinen Richtlinien verwenden."] },
          { heading: "Auswahl ändern", paragraphs: ["Sie können alle akzeptieren, optionale Funktionen ablehnen oder einzelne Funktionen auswählen. Sie können Ihre Auswahl jederzeit ändern."], settings: true },
        ],
      },
    },
  },
} satisfies Record<"en" | "de", LegalTranslation>;

const originalHeadings = {
  terms: ["Услови коришћења", "Информације о коришћењу садржаја и услуга на сајту школе."],
  privacy: ["Политика приватности", "Како се подаци повезани са коришћењем сајта обрађују и коме се можете обратити."],
  cookies: ["Политика колачића", "Информације о колачићима, видео-садржајима и изборима којима управљате."],
} as const;

export function legalHeadings(page: LegalPageKind) {
  return {
    sr: { section: "Информације о сајту", title: originalHeadings[page][0], description: originalHeadings[page][1] },
    en: { section: legalText.en.section, ...legalText.en.pages[page] },
    de: { section: legalText.de.section, ...legalText.de.pages[page] },
  };
}
