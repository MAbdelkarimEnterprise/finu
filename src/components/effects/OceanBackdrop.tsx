"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * The dive controller. A fixed backdrop of three gradient sheets —
 * surface, open water, depth — crossfaded by page scroll progress so
 * the whole site reads as one continuous descent. Opacity-only
 * animation (compositor-friendly), driven by a single rAF-throttled
 * scroll listener that also publishes --ocean-depth for any CSS that
 * wants to react (kelp opacity, scrims, sections).
 *
 * Reduced motion pins the dive at the surface.
 */
const SURFACE =
  "linear-gradient(180deg, #ffffff 0%, #f8fafd 55%, #eef4ff 100%)";
const OPEN_WATER =
  "linear-gradient(180deg, #d9ecff 0%, #9cc6f5 55%, #5aa8ff 100%)";
const DEPTH =
  "linear-gradient(180deg, #2f5fb8 0%, #14294f 55%, #0b1220 100%)";

export default function OceanBackdrop() {
  const reduced = useReducedMotion();
  const midRef = useRef<HTMLDivElement>(null);
  const deepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const f = Math.min(1, Math.max(0, window.scrollY / max));
      /* Ease the descent: stay near the surface through the hero,
         reach open water mid-page, seabed by the final CTA. */
      const depth =
        f < 0.18 ? f * 0.55 : 0.1 + Math.pow((f - 0.18) / 0.82, 1.25) * 0.9;
      if (midRef.current)
        midRef.current.style.opacity = String(Math.min(1, depth * 2.2));
      if (deepRef.current)
        deepRef.current.style.opacity = String(
          Math.max(0, (depth - 0.45) / 0.55)
        );
      document.documentElement.style.setProperty(
        "--ocean-depth",
        depth.toFixed(3)
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.style.removeProperty("--ocean-depth");
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-backdrop)" }}
    >
      <div className="absolute inset-0" style={{ background: SURFACE }} />
      <div
        ref={midRef}
        className="absolute inset-0 opacity-0 transition-none"
        style={{ background: OPEN_WATER }}
      />
      <div
        ref={deepRef}
        className="absolute inset-0 opacity-0 transition-none"
        style={{ background: DEPTH }}
      />
    </div>
  );
}
