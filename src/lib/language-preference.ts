import { cookies } from "next/headers";
import { languageCookie, type Locale } from "@/lib/localization";

export async function preferredLanguage(): Promise<Locale> {
  const value = (await cookies()).get(languageCookie)?.value;
  return value === "en" || value === "de" ? value : "sr";
}
