"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath } from "@/lib/localization";

export function BackToTop() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const stopScrolling = useRef<(() => void) | null>(null);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => () => stopScrolling.current?.(), [pathname]);

  function scrollToTop() {
    stopScrolling.current?.();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = window.scrollY;
    if (motion.matches || start === 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const duration = Math.min(1400, Math.max(650, Math.sqrt(start) * 20));
    const started = performance.now();
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", onKeyDown);
      motion.removeEventListener("change", onMotionChange);
      stopScrolling.current = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stop();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        stop();
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    const step = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      window.scrollTo({ top: start * (1 - progress) ** 3, behavior: "instant" });
      if (progress < 1) frame = requestAnimationFrame(step);
      else stop();
    };
    stopScrolling.current = stop;
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    motion.addEventListener("change", onMotionChange);
    frame = requestAnimationFrame(step);
  }

  const shown = visible || focused;

  return (
    <button
      type="button"
      className={`back-to-top${shown ? " back-to-top--visible" : ""}`}
      aria-label={locale === "en" ? "Back to top" : locale === "de" ? "Zurück nach oben" : "Повратак на врх странице"}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={(event) => {
        scrollToTop();
        if (event.detail === 0) document.querySelector<HTMLElement>(".skip-link")?.focus({ preventScroll: true });
      }}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
