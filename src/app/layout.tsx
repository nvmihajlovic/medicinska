import type { Metadata } from "next";
import { BackToTop } from "@/components/back-to-top";
import { CookieConsent } from "@/components/cookie-consent";
import { DocumentLanguage } from "@/components/document-language";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Медицинска школа „Стевица Јовановић” — Панчево",
    template: "%s — Медицинска школа „Стевица Јовановић”",
  },
  description:
    "Медицинска школа „Стевица Јовановић” у Панчеву — стручно образовање, вежбе у кабинетима и болничким одељењима и хуман приступ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Cyrl" data-scroll-behavior="smooth">
      <body>{children}<DocumentLanguage /><BackToTop /><CookieConsent /></body>
    </html>
  );
}
