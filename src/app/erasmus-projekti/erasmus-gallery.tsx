"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { erasmusText } from "@/lib/erasmus-text";
import { LanguageText } from "@/components/language-size";
import type { Locale } from "@/lib/localization";

type Photo = { name: string; src: string; width: number; height: number };

export function ErasmusGallery({ title, titles, images, locale = "sr" }: { title: string; titles: Record<Locale, string>; images: Photo[]; locale?: Locale }) {
  const text = locale === "sr" ? null : erasmusText[locale];
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(0);
  const gridId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = expanded ? images : images.slice(0, 6);

  function open(index: number) {
    setSelected(index);
    dialog.current?.showModal();
  }

  function move(direction: number) {
    setSelected((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div className="erasmus-gallery">
      <div className="erasmus-gallery__header"><h3><LanguageText locale={locale} values={titles} /></h3><span><LanguageText locale={locale} values={{ sr: `${images.length} фотографија`, en: `${images.length} ${erasmusText.en.photos}`, de: `${images.length} ${erasmusText.de.photos}` }} /></span></div>
      <div className="erasmus-gallery__grid" id={gridId}>
        {shown.map((image, index) => (
          <button type="button" className="erasmus-gallery__thumb" key={image.src} onClick={() => open(index)} aria-label={text?.openPhoto(index + 1, images.length, title) ?? `Отвори фотографију ${index + 1} од ${images.length}: ${title}`}>
            <Image src={image.src} alt="" fill sizes="(max-width: 560px) 28vw, (max-width: 800px) 30vw, 25vw" />
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {images.length > 6 && <button className="erasmus-gallery__more" type="button" aria-expanded={expanded} aria-controls={gridId} onClick={() => setExpanded(!expanded)}><LanguageText locale={locale} values={{ sr: expanded ? "Прикажи мање" : `Прикажи све фотографије (${images.length})`, en: expanded ? erasmusText.en.showLess : `${erasmusText.en.showAll} (${images.length})`, de: expanded ? erasmusText.de.showLess : `${erasmusText.de.showAll} (${images.length})` }} /> <span aria-hidden="true">{expanded ? "−" : "+"}</span></button>}
      <dialog ref={dialog} className="erasmus-lightbox" aria-label={`${text?.gallery ?? "Галерија"}: ${title}`} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
        <div className="erasmus-lightbox__top"><span>{title} · {selected + 1} / {images.length}</span><button type="button" onClick={() => dialog.current?.close()} aria-label={text?.close ?? "Затвори галерију"}>×</button></div>
        <div className="erasmus-lightbox__stage">
          <button type="button" onClick={() => move(-1)} aria-label={text?.previous ?? "Претходна фотографија"}>‹</button>
          <Image src={images[selected].src} alt={text?.photoAlt(title, selected + 1, images.length) ?? `${title}, фотографија ${selected + 1} од ${images.length}`} width={images[selected].width} height={images[selected].height} sizes="90vw" />
          <button type="button" onClick={() => move(1)} aria-label={text?.next ?? "Следећа фотографија"}>›</button>
        </div>
      </dialog>
    </div>
  );
}
