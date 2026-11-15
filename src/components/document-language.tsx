"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { languageCookie, localeFromPath } from "@/lib/localization";

export function DocumentLanguage() {
  const locale = localeFromPath(usePathname());
  useEffect(() => {
    document.documentElement.lang = locale === "sr" ? "sr-Cyrl" : locale;
    if (locale !== "sr") document.cookie = `${languageCookie}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [locale]);
  return null;
}
