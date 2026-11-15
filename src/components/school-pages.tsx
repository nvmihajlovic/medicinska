import Image from "next/image";
import Link from "next/link";
import staff from "@/data/staff.json";
import { DocumentList } from "@/components/document-list";
import { ContactForm, ContactMap } from "@/components/contact";
import { ContactLabel } from "@/components/contact-label";
import { LanguageBlock, LanguageInline, LanguageText } from "@/components/language-size";
import { documentGroups, documentPath, generalDocumentGroups } from "@/lib/academic";
import { aboutText, teamsText, type Locale } from "@/lib/localization";
import { contactText } from "@/lib/contact-text";
import { informationText } from "@/lib/information-text";
import { staffRoles, staffText } from "@/lib/staff-text";
import { documentGroupsText, documentText, documentTitles } from "@/lib/document-text";
import { schoolEmail } from "@/lib/school-contact";
import { programmeHeadings, programmeText } from "@/lib/program-text";
import { examPrograms } from "@/lib/exam-text";
import "./school-pages.css";

export const programs = [
  {
    id: "medicinska-sestra-tehnicar",
    number: "01",
    title: "Медицинска сестра – техничар",
    description: "Образовни профил усмерен на здравствену негу и рад са пацијентима.",
    overview: [
      "Медицинска сестра – техничар образује се за рад у здравственом тиму и пружање здравствене неге људима различитог узраста. Овај профил повезује знања о људском телу, здрављу и болести са бригом о потребама и достојанству пацијента.",
      "Поред општеобразовних предмета, ученици упознају различите области медицине и развијају одговоран приступ раду, комуникацију са пацијентима и сарадњу са другим здравственим радницима. Учење обухвата теоријску наставу и практичне вежбе.",
    ],
    learning: [
      "Анатомија и физиологија, здравствена нега и прва помоћ.",
      "Хигијена, микробиологија, фармакологија и медицинска етика.",
      "Основе интерне медицине, хирургије, педијатрије и других клиничких области.",
      "Пажљива комуникација, тимски рад и одговоран однос према пацијенту.",
    ],
    opportunities: "Знања стечена на профилу могу бити основа за рад у здравственим установама, попут болница и домова здравља, као и за наставак образовања у области здравства.",
    suitable: "Профил може одговарати онима које занимају медицина и рад са људима, који су спремни да уче, сарађују и приступају другима са стрпљењем и поштовањем.",
    exam: "Матурски испит обухвата српски језик, тест знања и практичне радне задатке из здравствене неге.",
    image: "/images/praktikum-5.jpg",
    alt: "Ученица на вежбама здравствене неге",
  },
  {
    id: "ginekolosko-akuserska-sestra",
    number: "02",
    title: "Гинеколошко-акушерска сестра",
    description: "Профил који обухвата области гинекологије, акушерства и здравствене неге.",
    overview: [
      "Гинеколошко-акушерска сестра стиче знања из здравствене неге са посебним освртом на здравље жене, трудноћу, порођај и негу новорођенчета. У средишту профила су стручност, пажљива комуникација и поштовање приватности.",
      "Учење повезује општеобразовне и медицинске предмете са практичним вежбама. Ученици упознају основе рада у здравственом тиму и значај подршке пацијенткињи и породици у осетљивим животним периодима.",
    ],
    learning: [
      "Анатомија и физиологија, здравствена нега и прва помоћ.",
      "Гинекологија са негом и акушерство са негом.",
      "Педијатрија са негом, хигијена и микробиологија.",
      "Комуникација, дискреција и сарадња у здравственом тиму.",
    ],
    opportunities: "Образовање може бити основа за рад у установама које пружају гинеколошку и акушерску здравствену заштиту, као и за даље школовање у области здравства.",
    suitable: "Профил може одговарати онима које занимају здравље жене и новорођенчета и који желе да развијају стрпљење, одговорност и осећај за потребе других.",
    exam: "Практични део матурског испита обухвата гинекологију, акушерство и здравствену негу.",
    image: "/images/praktikum-18.jpg",
    alt: "Вежбе неге новорођенчета",
  },
  {
    id: "medicinska-sestra-vaspitac",
    number: "03",
    title: "Медицинска сестра – васпитач",
    description: "Образовање за рад са децом, које повезује здравствену негу и васпитање.",
    overview: [
      "Медицинска сестра – васпитач повезује здравствену негу, васпитање и подршку развоју деце раног узраста. Профил је усмерен на разумевање дететових потреба, стварање подстицајног окружења и сарадњу са породицом и колегама.",
      "Ученици, уз општеобразовне предмете, изучавају и медицинске, психолошке и педагошке области. Теоријска знања повезују са вежбама и упознају значај игре, комуникације, неге и свакодневних навика у раном детињству.",
    ],
    learning: [
      "Здравствена нега деце раног узраста и педијатрија са негом.",
      "Дечја психологија, предшколска педагогија и васпитање деце.",
      "Књижевност за децу и музичко васпитање деце раног узраста.",
      "Комуникација са децом и породицом, пажљиво посматрање и тимски рад.",
    ],
    opportunities: "Профил пружа основу за рад са децом раног узраста у предшколским установама и за даље образовање у сродним областима.",
    suitable: "Профил може одговарати онима који воле рад са децом, имају стрпљења и креативности и занима их повезаност здравља, игре и развоја детета.",
    exam: "Практични део матурског испита укључује васпитање и негу деце и педијатрију са негом.",
    image: "/images/praktikum-20.jpg",
    alt: "Практична настава у школском кабинету",
  },
  {
    id: "zdravstveni-negovatelj",
    number: "04",
    title: "Здравствени неговатељ",
    description: "Профил посвећен основама здравствене неге и практичном раду.",
    overview: [
      "Здравствени неговатељ образује се за послове неге и подршке особама којима је потребна помоћ у свакодневном животу. Профил је усмерен на хуман однос, очување достојанства и сарадњу са другим члановима тима.",
      "Настава повезује општеобразовне предмете са основама здравствене неге, исхране и клиничке медицине. Ученици кроз теорију и вежбе упознају различите потребе особа о којима се брине, укључујући и негу у кући.",
    ],
    learning: [
      "Анатомија и физиологија, здравствена нега и хигијена.",
      "Исхрана, здравствена психологија и основи клиничке медицине.",
      "Здравствена нега у кући и основе медицинске рехабилитације.",
      "Одговорна комуникација, стрпљење и подршка у свакодневним активностима.",
    ],
    opportunities: "Знања са профила могу бити основа за послове неге и подршке у здравственим и установама социјалне заштите, као и у другим облицима организоване неге.",
    suitable: "Профил може одговарати онима који желе да помажу људима, цене практичан рад и спремни су да негу пружају пажљиво и са поштовањем.",
    exam: "Завршни испит обухвата практичну проверу знања кроз радне задатке.",
    image: "/images/praktikum-16.jpg",
    alt: "Ученица увежбава поступак здравствене неге",
  },
];

const parentHandbook = documentGroups.find((group) => group.path === "/dokumentacija/")?.links.find((link) => link.title === "Приручник-за-родитеље");
if (!parentHandbook) throw new Error("Недостаје приручник за родитеље.");

const studentGroups = [
  {
    number: "01",
    title: "Настава и распоред",
    description: "Информације о организацији школског дана.",
    links: [
      { title: "Распоред звоњења", href: "/informacije/raspored-zvonjenja" },
      { title: "План писмених провера", href: "/informacije/plan-pismenih-provera" },
      { title: "Дежурства наставника", href: "/informacije/dezurstva-nastavnika" },
    ],
  },
  {
    number: "02",
    title: "Испити и материјали",
    description: "Материјали за припрему испита и школски документи.",
    links: [
      { title: "Испитна питања", href: "/ispiti-i-materijali#ispitna-pitanja" },
      { title: "Матурска питања", href: "/ispiti-i-materijali#maturska-pitanja" },
      { title: "Документација школе", href: "/dokumentacija" },
    ],
  },
  {
    number: "03",
    title: "За родитеље",
    description: "Контакт са школом и доступна документа.",
    links: [
      { title: "Приручник за родитеље", href: documentPath(parentHandbook.url) },
      { title: "Контакт школе", href: "/kontakt" },
    ],
  },
];

const telephones = [
  ["Директор", "013/333-883", "+38113333883"],
  ["Секретар", "013/2511-772", "+381132511772"],
  ["Зборница", "013/331-390", "+38113331390"],
  ["Организатор наставе", "013/2156-306", "+381132156306"],
  ["Школски психолог", "013/2156-307", "+381132156307"],
  ["Библиотекар", "013/2156-308", "+381132156308"],
];

type HeadingText = { section: string; title: string; description: string };

const schoolHeadings = {
  about: {
    sr: { section: "О школи", title: "Школа и њена историја", description: "Медицинска школа „Стевица Јовановић” део је образовног и здравственог живота Панчева од 1959. године." },
    en: aboutText.en, de: aboutText.de,
  },
  students: {
    sr: { section: "Информације", title: "Информације", description: "Распоред, испити, школска документа и корисне информације на једном месту." },
    en: informationText.en, de: informationText.de,
  },
  contact: contactText,
  documents: {
    sr: { section: "Документација", title: "Документација школе", description: "Приручници, правила и критеријуми оцењивања доступни за преглед и преузимање." },
    en: documentText.en, de: documentText.de,
  },
  staff: {
    sr: { section: "Запослени", title: "Запослени у школи", description: "Преглед управе, стручних сарадника, наставника и помоћног особља школе." },
    en: staffText.en, de: staffText.de,
  },
  teams: {
    sr: { section: "Стручни тимови", title: "Стручни тимови школе", description: "Преглед тимова који учествују у планирању рада школе и подршци ученицима." },
    en: teamsText.en, de: teamsText.de,
  },
} satisfies Record<string, Record<Locale, HeadingText>>;

export function PageHeading({ section, sectionHref, title, description, locale = "sr", variants }: HeadingText & { sectionHref?: string; locale?: Locale; variants?: Record<Locale, HeadingText> }) {
  const languages: Locale[] = variants ? ["sr", "en", "de"] : [locale];
  return (
    <header className="school-page-heading">
      {languages.map((language) => {
        const content = variants?.[language] ?? { section, title, description };
        const text = language === "sr" ? null : aboutText[language];
        const hidden = language !== locale;
        return <div className="shell school-page-heading__variant" key={language} lang={language} aria-hidden={hidden || undefined}>
          <nav className="school-page-heading__trail" aria-label={text?.breadcrumb ?? "Путања кроз сајт"}>
            {hidden ? <a>{text?.home ?? "Почетна"}</a> : <Link href={language === "sr" ? "/" : `/${language}`}>{text?.home ?? "Почетна"}</Link>}<span aria-hidden="true">/</span>
            {sectionHref ? <>{hidden ? <a>{content.section}</a> : <Link href={sectionHref}>{content.section}</Link>}<span aria-hidden="true">/</span><span aria-current={hidden ? undefined : "page"}>{content.title}</span></> : <span>{content.section}</span>}
          </nav>
          <div className="school-page-heading__content">
            <div><p className="eyebrow">{content.section} · {language === "en" ? "Medical School" : language === "de" ? "Medizinische Schule" : "Медицинска школа"}</p><h1>{content.title}</h1></div>
            <p>{content.description}</p>
          </div>
        </div>
      })}
    </header>
  );
}

export function AboutSchool({ locale = "sr" }: { locale?: Locale }) {
  const text = locale === "sr" ? null : aboutText[locale];
  const history = [
    { year: "1959.", title: "Оснивање школе", text: "Школа је основана у марту, одлуком Народног одбора Среза Панчево. Др Бора Дрндарски покренуо је и организовао њено отварање." },
    { year: "1960.", title: "Четворогодишња школа", text: "Отворена је прва четворогодишња Медицинска школа. Практична настава одвијала се у Општој болници у Панчеву." },
    { year: "1971.", title: "Образовање одраслих", text: "Отворена су истурена одељења у Ковину и Вршцу." },
    { year: "1997.", title: "Нови образовни профил", text: "Поред општег смера уведен је профил гинеколошко-акушерска сестра." },
    { year: "2003.", title: "Здравствени неговатељ", text: "Школа се укључила у ЦАРДС програм за увођење огледног профила здравствени неговатељ." },
  ];
  if (text && text.timeline.length !== history.length) throw new Error("Превод историјата школе није потпун.");

  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.about[locale]} variants={schoolHeadings.about} />
      <section className="school-profile section">
        <div className="shell school-profile__intro">
          <div><LanguageBlock locale={locale}>{(language) => <><p className="eyebrow">{language === "sr" ? "Историјат" : aboutText[language].history}</p><h2>{language === "sr" ? "Почеци медицинског образовања у Панчеву" : aboutText[language].beginnings}</h2></>}</LanguageBlock><span className="school-profile__intro-year" aria-hidden="true">1959.</span></div>
          <LanguageBlock locale={locale}>{(language) => <>
            <p>{language === "sr" ? "Потреба за школом настала је развојем здравствене службе и болнице у Панчеву. Оснивање школе омогућило је да се будуће медицинске сестре образују у свом граду." : aboutText[language].intro[0]}</p>
            <p>{language === "sr" ? "Први директор и предавач био је др Бора Дрндарски, а практични рад водила је главна сестра болнице Олга Рапајић." : aboutText[language].intro[1]}</p>
          </>}</LanguageBlock>
        </div>
        <div className="shell school-profile__history">
          <div className="school-profile__history-label">
            <LanguageBlock locale={locale}>{(language) => <>
              <p className="eyebrow">{language === "sr" ? "Историјат" : aboutText[language].history}</p>
              <h2>{language === "sr" ? "Развој школе" : aboutText[language].development}</h2>
              <p>{language === "sr" ? "Кључни тренуци у развоју наше школе." : aboutText[language].milestones}</p>
              <span>{language === "sr" ? "1959 — данас" : aboutText[language].today}</span>
            </>}</LanguageBlock>
          </div>
          <ol className="history-list">
            {history.map((item, index) => <li key={item.year}><article><span>{item.year}</span><div className="language-size-stack">
              {(["sr", "en", "de"] as const).map((language) => <div key={language} lang={language} aria-hidden={language !== locale || undefined}>
                <h3>{language === "sr" ? item.title : aboutText[language].timeline[index][0]}</h3>
                <p>{language === "sr" ? item.text : aboutText[language].timeline[index][1]}</p>
              </div>)}
            </div></article></li>)}
          </ol>
        </div>
      </section>
      <section className="school-profile__learning">
        <div className="shell school-profile__learning-grid">
          <LanguageBlock locale={locale}>{(language) => <><p className="eyebrow">{language === "sr" ? "Настава и пракса" : aboutText[language].training}</p><h2>{language === "sr" ? "Учење у школи и здравственим установама" : aboutText[language].learning}</h2></>}</LanguageBlock>
          <LanguageBlock locale={locale}>{(language) => <>
            <p>{language === "sr" ? "Настава обухвата теоријски рад, вежбе у кабинетима и практичне вежбе у наставним базама. Међу њима су Општа болница и Дом здравља у Панчеву." : aboutText[language].practice}</p>
            {language === locale ? <Link href={locale === "sr" ? "/obrazovni-profili" : `/${locale}/obrazovni-profili`} className="school-page-link school-page-link--light">{language === "sr" ? "Образовни профили" : aboutText[language].programmes} <span aria-hidden="true">→</span></Link> : <a className="school-page-link school-page-link--light">{language === "sr" ? "Образовни профили" : aboutText[language].programmes} <span aria-hidden="true">→</span></a>}
          </>}</LanguageBlock>
        </div>
      </section>
      <section className="section school-profile__more">
        <div className="shell"><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Упознајте школу", en: aboutText.en.discover, de: aboutText.de.discover }} /></p><div className="related-links">{["/zaposleni", "/strucni-timovi", "/kontakt"].map((path, index) => <Link key={path} href={locale === "sr" ? path : `/${locale}${path}`}><LanguageText locale={locale} values={{ sr: ["Запослени", "Стручни тимови", "Контакт"][index], en: aboutText.en.links[index], de: aboutText.de.links[index] }} /> <span>→</span></Link>)}</div></div>
      </section>
    </>
  );
}

export function Programs({ locale = "sr" }: { locale?: Locale }) {
  const text = programmeText[locale];
  return (
    <>
      <PageHeading locale={locale} {...programmeHeadings[locale]} variants={programmeHeadings} />
      <section className="programs-directory section">
        <div className="shell">
          <div className="directory-intro"><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Преглед профила", en: programmeText.en.intro, de: programmeText.de.intro }} /></p><p><LanguageText locale={locale} values={{ sr: "Изаберите профил да бисте прешли на његов опис.", en: `${programmeText.en.select} ${programmeText.en.notice}`, de: `${programmeText.de.select} ${programmeText.de.notice}` }} /></p></div>
          <nav className="program-index" aria-label={text.title}>
            {programs.map((program) => {
              const names = examPrograms[program.id];
              if (!names) throw new Error(`Недостаје превод назива профила: ${program.id}`);
              return <a href={`#${program.id}`} key={program.id}><span>{program.number}</span><LanguageText locale={locale} values={{ sr: program.title, ...names }} /><span aria-hidden="true">↓</span></a>;
            })}
          </nav>
          <div className="program-details">
            {programs.map((program) => {
              const names = examPrograms[program.id];
              if (!names) throw new Error(`Недостаје превод назива профила: ${program.id}`);
              return <article className="program-detail" id={program.id} key={program.id}>
                <div className="program-detail__image"><Image src={program.image} alt={locale === "sr" ? program.alt : ""} width={760} height={520} /></div>
                <div className="program-detail__content">
                  <LanguageBlock locale={locale}>{(language) => <>
                    <p className="eyebrow">{language === "sr" ? "Образовни профил" : programmeText[language].profile} / {program.number}</p>
                    <h2>{language === "sr" ? program.title : names[language]}</h2>
                    <p lang="sr-Cyrl">{program.overview[0]}</p>
                    {language === locale ? <Link className="school-page-link" href={`/obrazovni-profili/${program.id}`}>{language === "sr" ? "Предмети и детаљи профила" : programmeText[language].details} <span aria-hidden="true">→</span></Link> : <a className="school-page-link">{language === "sr" ? "Предмети и детаљи профила" : programmeText[language].details} <span aria-hidden="true">→</span></a>}
                  </>}</LanguageBlock>
                </div>
              </article>;
            })}
          </div>
          <p className="programs-note"><LanguageText locale={locale} values={{ sr: "За актуелне услове уписа и расположива места обратите се школи или погледајте званични конкурс за упис.", en: programmeText.en.current, de: programmeText.de.current }} /></p>
        </div>
      </section>
    </>
  );
}

export function Students({ locale = "sr" }: { locale?: Locale }) {
  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.students[locale]} variants={schoolHeadings.students} />
      <section className="student-directory section">
        <div className="shell student-directory__layout">
          <aside><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Брзи преглед", en: informationText.en.overview, de: informationText.de.overview }} /></p><h2><LanguageText locale={locale} values={{ sr: "Шта вам је потребно?", en: informationText.en.need, de: informationText.de.need }} /></h2><p><LanguageText locale={locale} values={{ sr: "Изаберите област и отворите информацију која вам је потребна.", en: informationText.en.choose, de: informationText.de.choose }} /></p></aside>
          <div className="student-groups">
            {studentGroups.map((group, groupIndex) => (
              <section className="student-group" key={group.number}>
                <div><span className="student-group__number">{group.number}</span><h2><LanguageText locale={locale} values={{ sr: group.title, en: informationText.en.groups[groupIndex].title, de: informationText.de.groups[groupIndex].title }} /></h2><p><LanguageText locale={locale} values={{ sr: group.description, en: informationText.en.groups[groupIndex].description, de: informationText.de.groups[groupIndex].description }} /></p></div>
                <div className="student-group__links">
                  {group.links.map((link, linkIndex) => {
                    const translated = link.href.startsWith("/informacije/") || link.href.startsWith("/ispiti-i-materijali#") || link.href === "/kontakt" || link.href === "/dokumentacija";
                    const href = locale !== "sr" && translated ? `/${locale}${link.href}` : link.href;
                    return <a href={href} key={link.title}><LanguageText locale={locale} values={{ sr: link.title, en: informationText.en.groups[groupIndex].links[linkIndex], de: informationText.de.groups[groupIndex].links[linkIndex] }} /><span aria-hidden="true">↗</span></a>;
                  })}
                </div>
              </section>
            ))}
            <p className="source-note"><LanguageText locale={locale} values={{ sr: "За актуелне информације обратите се школи.", en: informationText.en.current, de: informationText.de.current }} /></p>
          </div>
        </div>
      </section>
    </>
  );
}

export function Contact({ locale = "sr" }: { locale?: Locale }) {
  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.contact[locale]} variants={schoolHeadings.contact} />
      <section className="contact-directory section">
        <div className="shell contact-directory__layout">
          <aside className="contact-address">
            <p className="eyebrow"><ContactLabel locale={locale} name="addressLabel" /></p>
            <h2><ContactLabel locale={locale} name="address" /></h2>
            <p><LanguageText locale={locale} values={{ sr: `26101 ${contactText.sr.city}`, en: `26101 ${contactText.en.city}`, de: `26101 ${contactText.de.city}` }} /><ContactLabel locale={locale} name="country" /></p>
            <a className="school-page-link" href="https://www.google.com/maps/search/?api=1&amp;query=Medicinska+skola+Stevica+Jovanovic+Pasterova+2+Pancevo"><ContactLabel locale={locale} name="showMap" /> <span aria-hidden="true">↗</span></a>
          </aside>
          <div className="contact-directory__details">
            <section><p className="eyebrow"><ContactLabel locale={locale} name="phones" /></p><h2><ContactLabel locale={locale} name="contactSchool" /></h2><div className="contact-list">
              {telephones.map(([label, number, href], index) => <div key={label}><span><LanguageText locale={locale} values={{ sr: contactText.sr.roles[index], en: contactText.en.roles[index], de: contactText.de.roles[index] }} /></span><a href={`tel:${href}`}>{number}</a></div>)}
            </div></section>
          </div>
        </div>
      </section>
      <ContactExtras locale={locale} />
    </>
  );
}

export function ContactExtras({ locale = "sr" }: { locale?: Locale }) {
  return <>
      <section id="kontakt-forma" className="contact-message section">
        <div className="shell contact-message__layout">
          <div className="contact-message__intro">
            <p className="eyebrow"><ContactLabel locale={locale} name="write" /></p>
            <h2><ContactLabel locale={locale} name="help" /></h2>
            <p><ContactLabel locale={locale} name="intro" /></p>
            <div className="contact-message__aside">
              <p><ContactLabel locale={locale} name="direct" /></p>
              <a href={`mailto:${schoolEmail}`}>{schoolEmail} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <ContactForm locale={locale} />
          <section className="contact-location" aria-labelledby="contact-location-title">
            <div className="contact-location__heading">
              <p className="eyebrow"><ContactLabel locale={locale} name="visit" /></p>
              <h3 id="contact-location-title"><ContactLabel locale={locale} name="find" /></h3>
              <p><LanguageText locale={locale} values={{ sr: `${contactText.sr.address}, 26101 ${contactText.sr.city}`, en: `${contactText.en.address}, 26101 ${contactText.en.city}`, de: `${contactText.de.address}, 26101 ${contactText.de.city}` }} /></p>
            </div>
            <ContactMap locale={locale} />
          </section>
        </div>
      </section>
    </>;
}

export function Documents({ locale = "sr", showArchive = locale === "sr" }: { locale?: Locale; showArchive?: boolean }) {
  const canShowArchive = locale === "sr" && showArchive;
  const hasUntranslated = generalDocumentGroups.some((group) =>
    !Object.prototype.hasOwnProperty.call(documentGroupsText, group.id) ||
    group.links.some((link) => !Object.prototype.hasOwnProperty.call(documentTitles, link.title)));
  const contactHref = locale === "sr" ? "/kontakt" : `/${locale}/kontakt`;
  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.documents[locale]} variants={schoolHeadings.documents} />
      <section className="documents-directory section">
        <div className="shell documents-directory__layout">
          <aside><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Информације и обрасци", en: documentText.en.eyebrow, de: documentText.de.eyebrow }} /></p><h2><LanguageText locale={locale} values={{ sr: "Школска документа", en: documentText.en.heading, de: documentText.de.heading }} /></h2><p><LanguageText locale={locale} values={{ sr: "Документа су доступна за преглед и преузимање. Поједина документа односе се на раније школске године.", en: documentText.en.intro, de: documentText.de.intro }} /></p><p><LanguageText locale={locale} values={{ sr: "", en: documentText.en.language, de: documentText.de.language }} /></p><Link className="school-page-link" href={contactHref}><LanguageText locale={locale} values={{ sr: "Контакт школе", en: documentText.en.contact, de: documentText.de.contact }} /> <span aria-hidden="true">→</span></Link></aside>
          <div className="document-groups">
            {generalDocumentGroups.map((group, index) => {
              const title = Object.prototype.hasOwnProperty.call(documentGroupsText, group.id) ? documentGroupsText[group.id] : null;
              return (
                <details className="document-group" key={group.id} open={index === 0 ? true : undefined}>
                  <summary><span lang={locale !== "sr" && title ? undefined : "sr"}><LanguageText locale={locale} values={{ sr: group.title, en: title?.en ?? group.title, de: title?.de ?? group.title }} languages={title ? undefined : { en: "sr", de: "sr" }} /></span><span>{group.links.length} <span aria-hidden="true">+</span></span></summary>
                  <DocumentList documents={group.links} locale={locale} matchLanguages />
                </details>
              );
            })}
            {hasUntranslated && <p className="source-note"><LanguageText locale={locale} values={{ sr: "", en: documentText.en.untranslated, de: documentText.de.untranslated }} /></p>}
            <p className="source-note"><LanguageInline locale={locale}>{(language) => {
              const before = language === "sr" ? "Испитна и матурска питања налазе се на страници " : documentText[language].examsBefore;
              const label = language === "sr" ? "Испити и материјали" : documentText[language].exams;
              const after = language === "sr" ? "." : documentText[language].examsAfter;
              return <>{before}{language === locale ? <Link href={locale === "sr" ? "/ispiti-i-materijali" : `/${locale}/ispiti-i-materijali`}>{label}</Link> : <a>{label}</a>}{after}</>;
            }}</LanguageInline></p>
            <p className={`source-note${canShowArchive ? "" : " source-note--archive-hidden"}`} aria-hidden={!canShowArchive || undefined}><LanguageInline locale={locale}>{(language) => {
              const before = language === "sr" ? "Документи из ранијих вести налазе се у " : documentText[language].archiveBefore;
              const label = language === "sr" ? "архиви школских прилога" : documentText[language].archive;
              const after = language === "sr" ? "." : documentText[language].archiveAfter;
              return <>{before}{canShowArchive && language === locale ? <Link href="/dokumentacija/arhiva">{label}</Link> : <a>{label}</a>}{after}</>;
            }}</LanguageInline></p>
          </div>
        </div>
      </section>
    </>
  );
}

export function Staff({ locale = "sr" }: { locale?: Locale }) {
  const text = locale === "sr" ? null : staffText[locale];
  const originalGroups = ["Управа и администрација", "Стручни сарадници", "Наставници", "Помоћно особље"];
  const groups = [
    { id: "uprava", title: text?.groups[0] ?? "Управа и администрација", entries: staff.groups.uprava },
    { id: "saradnici", title: text?.groups[1] ?? "Стручни сарадници", entries: staff.groups["strucni-saradnici"] },
    { id: "nastavnici", title: text?.groups[2] ?? "Наставници", entries: staff.groups.predavaci },
    { id: "osoblje", title: text?.groups[3] ?? "Помоћно особље", entries: staff.groups["pomocno-osoblje"] },
  ];
  const hasUntranslated = groups.some((group) => group.entries.some((entry) => !Object.prototype.hasOwnProperty.call(staffRoles, entry.role)));

  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.staff[locale]} variants={schoolHeadings.staff} />
      <section className="staff-directory section">
        <div className="shell staff-directory__layout">
          <aside>
            <p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Именик школе", en: staffText.en.eyebrow, de: staffText.de.eyebrow }} /></p>
            <h2><LanguageText locale={locale} values={{ sr: "Људи наше школе", en: staffText.en.heading, de: staffText.de.heading }} /></h2>
            <p><LanguageText locale={locale} values={{ sr: "Изаберите групу за преглед објављеног списка.", en: staffText.en.intro, de: staffText.de.intro }} /></p>
            <nav className="staff-directory__nav" aria-label={text?.navigation ?? "Групе запослених"}>
              {groups.map((group, index) => <a key={group.id} href={`#${group.id}`}><LanguageText locale={locale} values={{ sr: originalGroups[index], en: staffText.en.groups[index], de: staffText.de.groups[index] }} /> <span aria-hidden="true">↓</span></a>)}
            </nav>
          </aside>
          <div className="staff-groups">
            {groups.map((group, index) => (
              <details className="staff-group" key={group.id} open={index < 2 ? true : undefined}>
                <summary><span><span className="staff-group__number">{String(index + 1).padStart(2, "0")}</span><LanguageText locale={locale} values={{ sr: originalGroups[index], en: staffText.en.groups[index], de: staffText.de.groups[index] }} /></span><span aria-hidden="true">+</span></summary>
                <div className="staff-group__entries" id={group.id}>
                  {group.entries.map((entry, entryIndex) => {
                    const role = Object.prototype.hasOwnProperty.call(staffRoles, entry.role) ? staffRoles[entry.role] : null;
                    return <div className="staff-entry" key={`${entry.name}-${entry.role}-${entryIndex}`}><strong lang="sr-Cyrl">{entry.name}</strong><span lang={locale === "sr" || !role ? "sr-Cyrl" : undefined}><LanguageText locale={locale} values={{ sr: entry.role, en: role?.en ?? entry.role, de: role?.de ?? entry.role }} /></span></div>;
                  })}
                </div>
              </details>
            ))}
            {hasUntranslated && <p className="source-note"><LanguageText locale={locale} values={{ sr: "", en: staffText.en.untranslated, de: staffText.de.untranslated }} /></p>}
            <p className="source-note"><LanguageText locale={locale} values={{ sr: "За актуелне податке о запосленима обратите се школи.", en: staffText.en.current, de: staffText.de.current }} /></p>
          </div>
        </div>
      </section>
    </>
  );
}

const teams = [
  "Тим за развојно планирање",
  "Тим за школски програм",
  "Тим за самовредновање и вредновање рада школе",
  "Тим за инклузивно образовање",
  "Тим за борбу против насиља, злостављања и занемаривања",
  "Тим за подршку ученицима који имају потешкоће у савладавању градива прописаног планом и програмом",
  "Тим овлашћен за покретање поступка за заштиту од злостављања",
  "Тим за сарадњу са Црвеним крстом и хуманитарним организацијама",
  "Тим за израду Годишњег плана рада школе и Извештаја о реализацији Годишњег плана рада за протеклу школску годину",
  "Тим за каријерно вођење",
  "Тим за планирање и организацију екскурзија, излета и посета",
  "Тим за бригу о уређењу школског простора",
  "Тим за промоцију школе и сарадњу са медијима",
  "Тим за стручно усавршавање",
  "Вршњачки тим за борбу против насиља",
  "Тим за наставна средства и опрему",
  "Тим за подршку Ђачком парламенту",
];

export function Teams({ locale = "sr" }: { locale?: Locale }) {
  const text = locale === "sr" ? null : teamsText[locale];
  if (text && text.items.length !== teams.length) throw new Error("Превод стручних тимова није потпун.");
  return (
    <>
      <PageHeading locale={locale} {...schoolHeadings.teams[locale]} variants={schoolHeadings.teams} />
      <section className="teams-directory section">
        <div className="shell">
          <div className="teams-directory__intro"><LanguageBlock locale={locale}>{(language) => <><p className="eyebrow">{language === "sr" ? "Организација рада" : teamsText[language].eyebrow}</p><h2>{language === "sr" ? "Тимови у школи" : teamsText[language].heading}</h2></>}</LanguageBlock><p><LanguageText locale={locale} values={{ sr: "Тимови покривају области од школског програма и развојног планирања до подршке ученицима и школској заједници.", en: teamsText.en.intro, de: teamsText.de.intro }} /></p></div>
          <ol className="teams-list">
            {teams.map((team, index) => <li key={team}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3 className="language-size-stack">
              {(["sr", "en", "de"] as const).map((language) => <span key={language} lang={language} aria-hidden={language !== locale || undefined}>{language === "sr" ? team : teamsText[language].items[index]}</span>)}
            </h3></li>)}
          </ol>
        </div>
      </section>
    </>
  );
}

export function SchoolPage({ slug, showArchive = true }: { slug: string; showArchive?: boolean }) {
  switch (slug) {
    case "o-skoli": return <AboutSchool />;
    case "obrazovni-profili": return <Programs />;
    case "ucenici-i-roditelji": return <Students />;
    case "kontakt": return <Contact />;
    case "dokumentacija": return <Documents showArchive={showArchive} />;
    case "zaposleni": return <Staff />;
    case "strucni-timovi": return <Teams />;
    default: return null;
  }
}

export const customSchoolPageSlugs = ["o-skoli", "obrazovni-profili", "ucenici-i-roditelji", "kontakt", "dokumentacija", "zaposleni", "strucni-timovi"];
