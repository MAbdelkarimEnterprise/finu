"use client";

import { useEffect, useRef } from "react";

/**
 * A single page-level ambient light that trails the cursor — very low
 * alpha, damped, desktop-only. The native cursor is untouched. Writes
 * CSS variables from a rAF loop; no React state per frame.
 */
export default function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const pos = {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.4,
      tx: window.innerWidth / 2,
      ty: window.innerHeight * 0.4,
    };

    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.09;
      pos.y += (pos.ty - pos.y) * 0.09;
      el.style.setProperty("--gx", `${pos.x.toFixed(1)}px`);
      el.style.setProperty("--gy", `${pos.y.toFixed(1)}px`);

      if (Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.6) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pos.tx = event.clientX;
      pos.ty = event.clientY;
      el.dataset.on = "true";
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      el.dataset.on = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="f-pointer-glow" />;
}
