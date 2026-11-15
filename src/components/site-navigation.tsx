"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { chromeText, type Locale } from "@/lib/localization";

const navigation = [
  { title: "О школи", href: "/o-skoli", related: ["/zaposleni", "/strucni-timovi"] },
  { title: "Образовни профили", href: "/obrazovni-profili" },
  { title: "Информације", href: "/ucenici-i-roditelji", related: ["/informacije", "/ispiti-i-materijali", "/dokumentacija"] },
  { title: "Erasmus+ пројекти", href: "/erasmus-projekti" },
  { title: "Архива вести", href: "/vesti" },
  { title: "Контакт", href: "/kontakt" },
];

export function SiteNavigation({ locale = "sr", selectedLocale = locale, showArchive = true }: { locale?: Locale; selectedLocale?: Locale; showArchive?: boolean }) {
  const pathname = usePathname();
  const originalPath = pathname.replace(/^\/(en|de)(?=\/|$)/, "");
  const menu = useRef<HTMLDetailsElement>(null);
  const text = chromeText[locale];

  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  function links() {
    return navigation.map((item, index) => {
      if (item.href === "/vesti" && !showArchive) return null;
      const current = originalPath === item.href;
      const within = originalPath.startsWith(`${item.href}/`) || item.related?.some((path) => originalPath === path || originalPath.startsWith(`${path}/`));
      const href = (item.href === "/o-skoli" || item.href === "/kontakt" || item.href === "/ucenici-i-roditelji" || item.href === "/erasmus-projekti" || item.href === "/obrazovni-profili") && locale !== "sr" ? `/${locale}${item.href}` : item.href;
      return (
        <Link key={item.href} href={href} className={item.href === "/kontakt" ? "nav-contact" : undefined}
          aria-current={current ? "page" : within ? "location" : undefined}
          onClick={closeMenu}>
          {text.nav[index]}
        </Link>
      );
    });
  }

  return (
    <>
      <nav className="primary-nav" aria-label={text.navigation}>{links()}</nav>
      <details className="mobile-nav" ref={menu} onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current?.open) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      }}>
        <summary aria-label={text.menu}><span /><span /><span /></summary>
        <nav aria-label={text.mobileNavigation}>{links()}<LanguageSwitcher locale={locale} selectedLocale={selectedLocale} onNavigate={closeMenu} /></nav>
      </details>
    </>
  );
}
