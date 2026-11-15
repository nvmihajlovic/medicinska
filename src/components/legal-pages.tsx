import Link from "next/link";
import { PageHeading } from "@/components/school-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { LanguageText } from "@/components/language-size";
import { schoolEmail } from "@/lib/school-contact";
import { legalHeadings, legalText, type LegalPageKind, type LegalSection } from "@/lib/legal-text";
import { cookieText, type Locale } from "@/lib/localization";
import "./legal-pages.css";

type LegalPage = LegalPageKind;

const paths: Record<LegalPage, string> = { terms: "/uslovi-koriscenja", privacy: "/privatnost", cookies: "/kolacici" };

function translatedSections(locale: "en" | "de", page: LegalPage): readonly LegalSection[] {
  return legalText[locale].pages[page].sections;
}

function Settings({ locale, hidden }: { locale: Locale; hidden: boolean }) {
  return hidden ? <button type="button" className="cookie-settings-link" disabled>{cookieText[locale].settings}</button> : <CookieSettingsButton />;
}

export function LegalLayout({ page, locale }: { page: LegalPage; locale: Locale }) {
  const headings = legalHeadings(page);
  const base = locale === "sr" ? "" : `/${locale}`;
  return <div className="shell legal-layout">
    <aside className="legal-layout__nav" aria-label={headings[locale].section}>
      <p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Информације", en: legalText.en.eyebrow, de: legalText.de.eyebrow }} /></p>
      {(Object.keys(paths) as LegalPage[]).map((kind) => {
        const titles = legalHeadings(kind);
        return <Link key={kind} href={`${base}${paths[kind]}`} aria-current={page === kind ? "page" : undefined}><LanguageText locale={locale} values={{ sr: titles.sr.title, en: titles.en.title, de: titles.de.title }} /></Link>;
      })}
    </aside>
    <div className="language-size-stack legal-variants">
      {(["sr", "en", "de"] as const).map((language) => <article key={language} className="legal-content" lang={language} aria-hidden={language !== locale || undefined}>
        {language === "sr" ? <OriginalLegalBody page={page} hidden={language !== locale} /> : <>
          <p className="legal-content__notice"><strong>{legalText[language].noticeLabel}</strong> {legalText[language].notice}</p>
          {translatedSections(language, page).map((section) => <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}{section.email && index === section.paragraphs.length - 1 && <> <a href={language === locale ? `mailto:${schoolEmail}` : undefined}>{schoolEmail}</a>.</>}</p>)}
            {section.contactLink && <p>{language === locale ? <Link href={`/${language}/kontakt`}>{section.contactLink}</Link> : <a>{section.contactLink}</a>}</p>}
            {section.settings && <Settings locale={language} hidden={language !== locale} />}
          </section>)}
        </>}
      </article>)}
    </div>
  </div>;
}

export function LegalPage({ page }: { page: LegalPage }) {
  const headings = legalHeadings(page);
  return <>
    <SiteHeader />
    <main id="main">
      <PageHeading {...headings.sr} variants={headings} />
      <LegalLayout page={page} locale="sr" />
    </main>
    <SiteFooter />
  </>;
}

function OriginalLegalBody({ page, hidden }: { page: LegalPage; hidden: boolean }) {
  return <>
          <p className="legal-content__notice"><strong>Напомена:</strong> Овај текст је нацрт. Школа треба да потврди податке и рокове чувања и обезбеди правну проверу пре објављивања.</p>
          {page === "terms" && <>
            <section><h2>О сајту</h2><p>Сајт Медицинске школе „Стевица Јовановић” у Панчеву намењен је информисању ученика, родитеља и других посетилаца о раду школе.</p></section>
            <section><h2>Информације и документи</h2><p>Садржај се објављује ради информисања. За актуелне рокове, услове и званичне информације обратите се школи путем {hidden ? <a>контакт странице</a> : <Link href="/kontakt">контакт странице</Link>}. Школа може изменити или ажурирати садржај.</p></section>
            <section><h2>Коришћење садржаја</h2><p>Поштујте права аутора и других носилаца права на текстовима, фотографијама и документима. За употребу која превазилази оно што је дозвољено законом обратите се школи или одговарајућем носиоцу права.</p></section>
            <section><h2>Спољни линкови</h2><p>Сајт може садржати линкове ка услугама трећих страна. Приликом одласка на те сајтове примењују се њихови услови и правила приватности.</p></section>
          </>}
          {page === "privacy" && <>
            <section><h2>Контакт школе</h2><p>Медицинска школа „Стевица Јовановић”, Пастерова 2, 26101 Панчево. Питања у вези са приватношћу можете упутити секретаријату на <a href={hidden ? undefined : `mailto:${schoolEmail}`}>{schoolEmail}</a>.</p></section>
            <section><h2>Поруке преко контакт форме</h2><p>Када пошаљете поруку, унето име, имејл адреса, опциони број телефона, тема и садржај поруке прослеђују се школи путем подешеног сервиса електронске поште ради одговора. На унету имејл адресу шаље се и аутоматска потврда, са наведеним именом, без садржаја поруке. Не уносите осетљиве личне или здравствене податке. Школа треба да утврди сервис и рокове чувања порука пре објављивања.</p><p>Ради заштите од аутоматизованих порука потребна је hCaptcha провера. Она се учитава тек када је покренете; тада се ваш прегледач повезује са hCaptcha услугом, која може обрађивати податке о прегледачу и користити колачиће у складу са својим правилима. Без провере можете контактирати школу директно имејлом или телефоном.</p></section>
            <section><h2>Подаци о интеракцијама</h2><p>Ако дозволите прегледе и лајкове, сајт користи насумични идентификатор у прегледачу ради бројања прегледа и памћења лајкова. Записи о интеракцијама чувају се у бази Supabase када је она повезана. Рок чувања ових записа школа још треба да одреди.</p><p>Повлачење избора брише идентификатор из прегледача, али не брише аутоматски раније сачуване записе у бази. За захтеве у вези са подацима обратите се школи.</p></section>
            <section><h2>YouTube и спољне услуге</h2><p>Ако дозволите YouTube садржај, ваш прегледач се повезује са YouTube-ом и та услуга може обрађивати податке у складу са својим правилима. Мапа на контакт страници учитава се са Google Maps-а тек када то изаберете; тада се ваш прегледач повезује са Google-ом, који може обрађивати податке и користити колачиће у складу са својим правилима. Спољни линкови се отварају тек када их изаберете.</p></section>
            <section><h2>Ваш избор и питања</h2><p>Избор за интеракције и YouTube можете променити у сваком тренутку. За питања о приступу, исправци или брисању података обратите се школи; о сваком захтеву одлучује се у складу са важећим прописима.</p><Settings locale="sr" hidden={hidden} /></section>
          </>}
          {page === "cookies" && <>
            <section><h2>Шта су колачићи?</h2><p>Колачићи су мали записи које прегледач чува за сајт. Неопходни записи омогућавају основне функције, а додатне функције се активирају само уз ваш избор.</p></section>
            <section><h2>Неопходни колачићи</h2><p><strong>school-cookie-preferences</strong> памти ваше поставке 180 дана. <strong>school-language</strong> памти избор језика до годину дана. Администраторска пријава користи колачиће сесије за безбедну пријаву. Они нису намењени праћењу посетилаца.</p></section>
            <section><h2>Прегледи и лајкови</h2><p>Уз сагласност, <strong>school-news-visitor</strong> чува насумични идентификатор до годину дана за бележење прегледа и памћење лајкова. Повлачење сагласности уклања овај колачић; раније сачувани записи не бришу се аутоматски.</p></section>
            <section><h2>YouTube садржај</h2><p>Уграђени снимци учитавају се само када дозволите YouTube. Након учитавања, YouTube може користити сопствене колачиће или сличне технологије у складу са својим правилима.</p></section>
            <section><h2>Google Maps</h2><p>Мапа на контакт страници учитава се тек на ваш избор. Google може користити своје колачиће или сличне технологије у складу са својим правилима.</p></section>
            <section><h2>hCaptcha провера</h2><p>Провера за контакт форму учитава се тек када је покренете. hCaptcha може користити колачиће или сличне технологије у складу са својим правилима.</p></section>
            <section><h2>Промените избор</h2><p>Можете прихватити све, одбити непотребне или одабрати појединачне функције. Избор можете променити у било ком тренутку.</p><Settings locale="sr" hidden={hidden} /></section>
          </>}
  </>;
}
