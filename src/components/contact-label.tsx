import { LanguageText } from "@/components/language-size";
import { contactText } from "@/lib/contact-text";
import type { Locale } from "@/lib/localization";

type ContactLabelKey = Exclude<keyof typeof contactText.sr, "roles" | "apiErrors">;

export function ContactLabel({ locale, name }: { locale: Locale; name: ContactLabelKey }) {
  return <LanguageText locale={locale} values={{ sr: contactText.sr[name], en: contactText.en[name], de: contactText.de[name] }} />;
}
