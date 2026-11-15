"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/localization";

const slides = [
  {
    src: "/images/getty-images-Qz8F6d3pzEw-unsplash.jpg",
    alt: "Медицински радници мере крвни притисак пацијенту",
    caption: "Здравствена нега",
  },
  {
    src: "/images/markus-spiske-guffbc3-rFY-unsplash.jpg",
    alt: "Медицински преглед помоћу апарата",
    caption: "Преглед и нега",
  },
  {
    src: "/images/wesley-tingey-qT68mycMSG4-unsplash.jpg",
    alt: "Новорођенче и медицински радници у болници",
    caption: "Нега новорођенчета",
  },
];

const motionQuery = "(prefers-reduced-motion: reduce)";

type SlideState = { current: number; loaded: number[] };

function advanceSlide(state: SlideState, direction: number): SlideState {
  const current = (state.current + direction + slides.length) % slides.length;
  return { current, loaded: state.loaded.includes(current) ? state.loaded : [...state.loaded, current] };
}

function subscribeToMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function reducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

export function HeroSlider({ locale = "sr" }: { locale?: Locale }) {
  const text = locale === "en" ? {
    label: "Photographs", slider: "carousel", captions: ["Healthcare", "Examination and care", "Newborn care"],
    alts: ["Healthcare workers measure a patient's blood pressure", "Medical examination using equipment", "Newborn and healthcare workers in hospital"],
    previous: "Previous photograph", next: "Next photograph", play: "Start automatic slideshow", pause: "Pause automatic slideshow",
  } : locale === "de" ? {
    label: "Fotos", slider: "Karussell", captions: ["Gesundheitspflege", "Untersuchung und Pflege", "Neugeborenenpflege"],
    alts: ["Gesundheitsfachkräfte messen den Blutdruck eines Patienten", "Medizinische Untersuchung mit einem Gerät", "Neugeborenes und Gesundheitsfachkräfte im Krankenhaus"],
    previous: "Vorheriges Foto", next: "Nächstes Foto", play: "Automatischen Bildwechsel starten", pause: "Automatischen Bildwechsel anhalten",
  } : null;
  const [{ current, loaded }, setSlide] = useState<SlideState>({ current: 0, loaded: [0] });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(subscribeToMotion, reducedMotion, () => true);

  useEffect(() => {
    if (paused || hovered || focused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSlide((state) => advanceSlide(state, 1));
    }, 7000);
    return () => window.clearInterval(timer);
  }, [current, paused, hovered, focused, prefersReducedMotion]);

  function move(direction: number) {
    setSlide((state) => advanceSlide(state, direction));
  }

  return (
    <section
      className="hero__visual"
      aria-label={text?.label ?? "Фотографије"}
      aria-roledescription={text?.slider ?? "слајдер"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className="hero__image">
        {slides.map((slide, index) => (
          <div className={`hero__slide${index === current ? " hero__slide--active" : ""}`} key={slide.src} aria-hidden={index !== current}>
            {loaded.includes(index) && <Image src={slide.src} alt={text?.alts[index] ?? slide.alt} fill sizes="(max-width: 800px) 90vw, 45vw" priority={index === 0} loading={index === 0 ? undefined : "eager"} fetchPriority={index === 0 ? "high" : undefined} />}
          </div>
        ))}
      </div>
      <div className="hero__caption">
        <span>{text?.captions[current] ?? slides[current].caption}</span>
        <div className="hero__slider-controls">
          <button type="button" onClick={() => move(-1)} aria-label={text?.previous ?? "Претходна фотографија"}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.5 9h-11M8 4.5 3.5 9 8 13.5" />
            </svg>
          </button>
          <span className="hero__slider-count" aria-live={paused || focused || prefersReducedMotion ? "polite" : "off"}>{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(1)} aria-label={text?.next ?? "Следећа фотографија"}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3.5 9h11M10 4.5 14.5 9 10 13.5" />
            </svg>
          </button>
          {!prefersReducedMotion && (
            <button type="button" className="hero__slider-pause" onClick={() => setPaused(!paused)} aria-label={paused ? text?.play ?? "Покрени аутоматску смену фотографија" : text?.pause ?? "Паузирај аутоматску смену фотографија"}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                {paused ? <path d="M4 2.5v11L13 8z" fill="currentColor" /> : <path d="M4 2.5h3v11H4zm5 0h3v11H9z" fill="currentColor" />}
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
