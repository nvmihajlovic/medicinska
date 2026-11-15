import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { SiteNavigation } from "@/components/site-navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { chromeText, type Locale } from "@/lib/localization";
import { schoolEmail } from "@/lib/school-contact";
import { preferredLanguage } from "@/lib/language-preference";

export async function SiteHeader({ locale = "sr" }: { locale?: Locale }) {
  const preference = await preferredLanguage();
  const selectedLocale = locale === "sr" ? preference : locale;
  locale = selectedLocale;
  const showArchive = selectedLocale === "sr";
  const text = chromeText[locale];
  const name = locale === "sr" ? "Стевица Јовановић" : "Stevica Jovanović";
  return (
    <>
      <a className="skip-link" href="#main" lang={locale === "sr" ? "sr-Cyrl" : locale}>{text.skip}</a>
      <div className="topline" role="region" lang={locale === "sr" ? "sr-Cyrl" : locale} aria-label={text.schoolInfo}>
        <div className="shell topline__inner">
          <span>{text.school} „{name}” · {text.city}</span>
          <div className="topline__contact">
            <a className="topline__contact-item" href="tel:+381132511772">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M5.1 2.8c.5-.5 1.3-.6 1.9-.3l2.1 1.1c.7.4 1 1.2.7 1.9l-1 2.3a1 1 0 0 0 .1 1c1.4 2.3 3.1 4 5.4 5.4a1 1 0 0 0 1 .1l2.3-1c.7-.3 1.5 0 1.9.7l1.1 2.1c.3.6.2 1.4-.3 1.9l-1.5 1.5c-.7.7-1.7 1-2.7.7A19.6 19.6 0 0 1 3.8 7c-.3-1 0-2 .7-2.7l.6-1.5Z" />
              </svg>
              013/2511-772
            </a>
            <span className="topline__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v4.8l3.2 1.8" />
              </svg>
              {text.hours}
            </span>
            <div className="topline__language"><LanguageSwitcher locale={locale} selectedLocale={selectedLocale} /></div>
          </div>
        </div>
      </div>
      <header className="site-header" lang={locale === "sr" ? "sr-Cyrl" : locale}>
        <div className="shell header__inner">
          <Link className="brand" href={locale === "sr" ? "/" : `/${locale}`}>
            <Image className="brand__logo" src="/images/school-logo.png" alt="" width={106} height={81} priority />
            <span className="brand__text">
              <strong>{text.school}</strong>
              <small>„{name}” · {text.city}</small>
            </span>
          </Link>
          <SiteNavigation locale={locale} selectedLocale={selectedLocale} showArchive={showArchive} />
        </div>
      </header>
    </>
  );
}

export async function SiteFooter({ locale = "sr" }: { locale?: Locale }) {
  if (locale === "sr") locale = await preferredLanguage();
  const showArchive = locale === "sr";
  const text = chromeText[locale];
  const name = locale === "sr" ? "Стевица Јовановић" : "Stevica Jovanović";
  const aboutHref = locale === "sr" ? "/o-skoli" : `/${locale}/o-skoli`;
  const teamsHref = locale === "sr" ? "/strucni-timovi" : `/${locale}/strucni-timovi`;
  const staffHref = locale === "sr" ? "/zaposleni" : `/${locale}/zaposleni`;
  const contactHref = locale === "sr" ? "/kontakt" : `/${locale}/kontakt`;
  const informationHref = locale === "sr" ? "/ucenici-i-roditelji" : `/${locale}/ucenici-i-roditelji`;
  const documentsHref = locale === "sr" ? "/dokumentacija" : `/${locale}/dokumentacija`;
  return (
    <footer className="site-footer" lang={locale === "sr" ? "sr-Cyrl" : locale}>
      <div className="shell footer-main">
        <div className="footer-brand">
          <Link className="brand brand--footer" href={locale === "sr" ? "/" : `/${locale}`}>
            <Image className="brand__logo" src="/images/school-logo.png" alt="" width={106} height={81} />
            <span className="brand__text">
              <strong>{text.school}</strong>
              <small>„{name}” · {text.city}</small>
            </span>
          </Link>
          <p>{text.footerIntro}</p>
          <address className="footer-contact">
            <Link href={contactHref}>{locale === "sr" ? "Пастерова 2" : "Pasterova 2"}, 26101 {text.city}</Link>
            <a href="tel:+381132511772">013/2511-772</a>
            <a href={`mailto:${schoolEmail}`}>{schoolEmail}</a>
          </address>
        </div>
        <div className="footer-column">
          <h2>{text.footerTitles[0]}</h2>
          <Link href={aboutHref}>{text.footerLinks[0]}</Link>
          <Link href={staffHref}>{text.footerLinks[1]}</Link>
          <Link href={teamsHref}>{text.footerLinks[2]}</Link>
          <Link href={locale === "sr" ? "/erasmus-projekti" : `/${locale}/erasmus-projekti`}>{text.footerLinks[3]}</Link>
        </div>
        <div className="footer-column">
          <h2>{text.footerTitles[1]}</h2>
          <Link href={locale === "sr" ? "/obrazovni-profili" : `/${locale}/obrazovni-profili`}>{text.footerLinks[4]}</Link>
          <Link href={informationHref}>{text.footerLinks[5]}</Link>
          <Link href={locale === "sr" ? "/ispiti-i-materijali" : `/${locale}/ispiti-i-materijali`}>{text.footerLinks[6]}</Link>
          <Link href={documentsHref}>{text.footerLinks[7]}</Link>
        </div>
        <div className="footer-column">
          <h2>{text.footerTitles[2]}</h2>
          <Link href={contactHref}>{text.footerLinks[8]}</Link>
          {showArchive && <Link href="/vesti">{text.footerLinks[9]}</Link>}
          <Link href={locale === "sr" ? "/uslovi-koriscenja" : `/${locale}/uslovi-koriscenja`}>{text.footerLinks[10]}</Link>
          <Link href={locale === "sr" ? "/privatnost" : `/${locale}/privatnost`}>{text.footerLinks[11]}</Link>
          <Link href={locale === "sr" ? "/kolacici" : `/${locale}/kolacici`}>{text.footerLinks[12]}</Link>
          <CookieSettingsButton locale={locale} />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="shell footer-bottom__inner">
          <span>© 2026 {text.school} „{name}” {text.city}</span>
        </div>
      </div>
    </footer>
  );
}
