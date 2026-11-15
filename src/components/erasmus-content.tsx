import { PageHeading } from "@/components/school-pages";
import { ConsentVideo } from "@/components/consent-video";
import { LanguageBlock, LanguageText } from "@/components/language-size";
import stories from "@/data/erasmus-stories.json";
import erasmus from "@/data/erasmus.json";
import { ErasmusGallery } from "@/app/erasmus-projekti/erasmus-gallery";
import { erasmusText, type ErasmusTranslation } from "@/lib/erasmus-text";
import type { Locale } from "@/lib/localization";
import "@/app/erasmus-projekti/erasmus.css";

const storyOrder = [
  { name: "Obilazak Lajpciga", title: "Обилазак Лајпцига", id: "lajpcig" },
  { name: "Naši učenici u prvoj radnoj nedelji", title: "Прва радна недеља", id: "prva-nedelja" },
  { name: "Prvi vikend u Lajpcigu i Drezdenu", title: "Први викенд у Лајпцигу и Дрездену", id: "prvi-vikend" },
  { name: "U radnom ambijentu", title: "У радном амбијенту", id: "radni-ambijent" },
  { name: "Prvi maj u Berlinu", title: "Први мај у Берлину", id: "berlin" },
  { name: "Hale", title: "Хале", id: "hale" },
  { name: "Rođendani u kampusu", title: "Рођендани у кампусу", id: "rodjendani" },
  { name: "Podela sertifikata", title: "Додела сертификата", id: "sertifikati" },
  { name: "Lajpcig, mesto na kome rastu lipe", title: "Лајпциг, место на коме расту липе", id: "grad-lajpcig" },
  { name: "Prezentacija projekta i evaluacija", title: "Презентација пројекта и евалуација", id: "evaluacija" },
  { name: "Promo za kraj", title: "Промоција пројекта", id: "promocija" },
];
const translations: Record<"en" | "de", ErasmusTranslation> = erasmusText;

function getSection(name: string) {
  const section = stories.sections.find((item) => item.name === name);
  if (!section) throw new Error(`Недостаје Erasmus+ целина: ${name}`);
  return section;
}

function readableText(text: string) {
  return text
    .replace("Друга радна недеља у ЛајпцигуУ другој", "Друга радна недеља у Лајпцигу\nУ другој")
    .replace(/([.!?])(?=[А-ЯA-Z])/g, "$1 ");
}

function Documents({ documents, locale, en, de }: { documents: { name: string; paragraphs: string[] }[]; locale: Locale; en: string[]; de: string[] }) {
  return (
    <div className="erasmus-story__text">
      <LanguageBlock locale={locale}>{(language) => (language === "sr" ? documents.flatMap((document) => document.paragraphs) : language === "en" ? en : de).map((paragraph, index) => <p key={index}>{readableText(paragraph)}</p>)}</LanguageBlock>
    </div>
  );
}

export function ErasmusContent({ locale = "sr" }: { locale?: Locale }) {
  const text: ErasmusTranslation | null = locale === "sr" ? null : erasmusText[locale];
  const intro = getSection("Erazmus uvod");
  const introduction = intro.documents[0];
  if (!introduction || introduction.paragraphs.length < 2) throw new Error("Недостаје увод Erasmus+ пројекта.");
  const videos = erasmus.blocks.filter((block) => block.type === "video");
  const headings = {
    sr: { section: "Erasmus+ пројекти", title: "Erasmus+ пројекти", description: "Међународна сарадња, мобилност ученика и искуства из пројеката наше школе." },
    en: { section: "Erasmus+ projects", title: "Erasmus+ projects", description: erasmusText.en.description },
    de: { section: "Erasmus+-Projekte", title: "Erasmus+-Projekte", description: erasmusText.de.description },
  };

  return (
    <>
        <PageHeading locale={locale} {...headings[locale]} variants={headings} />
        <article className="erasmus-project">
          <section className="erasmus-intro section">
            <div className="shell">
              <div className="erasmus-intro__heading">
                <div>
                  <p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Међународна сарадња", en: erasmusText.en.cooperation, de: erasmusText.de.cooperation }} /> · 2023/2024</p>
                  <h2><LanguageText locale={locale} values={{ sr: introduction.paragraphs[1], en: erasmusText.en.project, de: erasmusText.de.project }} /></h2>
                </div>
                <div className="erasmus-intro__meta"><span><LanguageText locale={locale} values={{ sr: "Еразмус+ пројекат", en: "Erasmus+", de: "Erasmus+" }} /></span><strong><LanguageText locale={locale} values={{ sr: "Панчево — Лајпциг", en: erasmusText.en.location, de: erasmusText.de.location }} /></strong><span><LanguageText locale={locale} values={{ sr: "Медицинска школа „Стевица Јовановић”", en: erasmusText.en.school, de: erasmusText.de.school }} /></span></div>
              </div>
              <div className="erasmus-intro__body">
                <Documents documents={[{ ...introduction, paragraphs: introduction.paragraphs.slice(2) }]} locale={locale} en={erasmusText.en.intro} de={erasmusText.de.intro} />
                <aside className="erasmus-intro__aside">
                  <p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Пројектни материјал", en: erasmusText.en.material, de: erasmusText.de.material }} /></p>
                  <p><LanguageText locale={locale} values={{ sr: "Презентација пројекта „Бонтон неге – (од)растимо заједно”.", en: erasmusText.en.presentation, de: erasmusText.de.presentation }} /></p>
                  <a className="erasmus-file" href="/erasmus/bonton-nege-prezentacija.pptx" download><LanguageText locale={locale} values={{ sr: "Преузми презентацију", en: erasmusText.en.download, de: erasmusText.de.download }} /> <span aria-hidden="true">↓</span></a>
                </aside>
              </div>
            </div>
          </section>

          <nav className="erasmus-index" aria-label={text?.index ?? "Целине пројекта"}>
            <div className="shell erasmus-index__inner">
              <div><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Пројектни дневник", en: erasmusText.en.diary, de: erasmusText.de.diary }} /></p><h2><LanguageText locale={locale} values={{ sr: "Приче и фотографије", en: erasmusText.en.stories, de: erasmusText.de.stories }} /></h2></div>
              <div className="erasmus-index__links">{storyOrder.map((story, index) => <a href={`#${story.id}`} key={story.id}><span>{String(index + 1).padStart(2, "0")}</span><LanguageText locale={locale} values={{ sr: story.title, en: erasmusText.en.titles[index], de: erasmusText.de.titles[index] }} /><span aria-hidden="true">↗</span></a>)}<a href="#tv"><span>12</span><LanguageText locale={locale} values={{ sr: "Гостовање на ТВ Панчево", en: erasmusText.en.tv, de: erasmusText.de.tv }} /><span aria-hidden="true">↗</span></a></div>
            </div>
          </nav>

          <div className="shell erasmus-stories">
            {storyOrder.map((story, index) => {
              const section = getSection(story.name);
              const groups = [...section.childGroups].sort((a, b) => a.name === "Zoo vrt, Lajpcig" ? -1 : b.name === "Zoo vrt, Lajpcig" ? 1 : 0);
              const title = text?.titles[index] ?? story.title;
              const titles = { sr: story.title, en: erasmusText.en.titles[index], de: erasmusText.de.titles[index] };
              const enParagraphs = translations.en.paragraphs[story.id];
              const deParagraphs = translations.de.paragraphs[story.id];
              if (section.documents.length > 0 && (!enParagraphs || !deParagraphs)) throw new Error(`Недостаје превод Erasmus+ целине: ${story.id}`);
              return (
                <section className="erasmus-story" id={story.id} key={story.id}>
                  <div className="erasmus-story__heading"><div><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Пројектни дневник", en: erasmusText.en.diary, de: erasmusText.de.diary }} /> <span> / {String(index + 1).padStart(2, "0")}</span></p><h2><LanguageText locale={locale} values={titles} /></h2></div><span className="erasmus-story__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
                  {section.documents.length > 0 && <Documents documents={section.documents} locale={locale} en={enParagraphs} de={deParagraphs} />}
                  {section.images.length > 0 && <ErasmusGallery title={title} titles={titles} images={section.images} locale={locale} />}
                  {groups.map((group) => {
                    const title = group.name === "Drezden" ? text?.dresden ?? "Дрезден" : group.name === "Zoo vrt, Lajpcig" ? text?.zoo ?? "Зоо врт, Лајпциг" : group.name;
                    const titles = group.name === "Drezden" ? { sr: "Дрезден", en: erasmusText.en.dresden, de: erasmusText.de.dresden } : group.name === "Zoo vrt, Lajpcig" ? { sr: "Зоо врт, Лајпциг", en: erasmusText.en.zoo, de: erasmusText.de.zoo } : { sr: group.name, en: group.name, de: group.name };
                    return <ErasmusGallery key={group.name} title={title} titles={titles} images={group.images} locale={locale} />;
                  })}
                </section>
              );
            })}
            <section className="erasmus-story" id="tv">
              <div className="erasmus-story__heading"><div><p className="eyebrow"><LanguageText locale={locale} values={{ sr: "Пројектни дневник", en: erasmusText.en.diary, de: erasmusText.de.diary }} /> <span> / 12</span></p><h2><LanguageText locale={locale} values={{ sr: "Гостовање на ТВ Панчево", en: erasmusText.en.tv, de: erasmusText.de.tv }} /></h2></div><span className="erasmus-story__number" aria-hidden="true">12</span></div>
              <p className="erasmus-video-note"><LanguageText locale={locale} values={{ sr: "Видео-прилози о учешћу школе у пројекту.", en: erasmusText.en.videoNote, de: erasmusText.de.videoNote }} /></p>
              <div className="erasmus-videos">{videos.map((video, index) => {
                if (!video.url || !video.title) throw new Error("Недостају подаци о Erasmus+ видео-прилогу.");
                return <div className="erasmus-video" key={video.url}><ConsentVideo src={video.url} title={text ? `${text.originalVideo} ${index + 1}` : video.title} locale={locale} /></div>;
              })}</div>
            </section>
          </div>
        </article>
    </>
  );
}
