"use client";

// → src/components/finu/ParticleStat.tsx

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import AnimatedValue from "./AnimatedValue";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./TextReveal";
import { mulberry32 } from "./particleTargets";

const TAU = Math.PI * 2;

/**
 * Full-viewport stat moment: a loose, breathing ring of tiny square
 * particles around one giant verified figure (5M+ financial advice,
 * published on meetfinu.com). Canvas is decorative; the number and
 * copy are real DOM. Pauses offscreen/hidden; reduced motion gets a
 * static ring frame.
 */
export default function ParticleStat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 260 : 520;
    const rand = mulberry32(5900000);
    const parts = Array.from({ length: COUNT }, () => ({
      angle: rand() * TAU,
      /* Loose band: most sit near the ring, some scatter inward/outward */
      radial: 0.78 + (rand() - 0.5) * 0.34 * (rand() < 0.82 ? 1 : 2.4),
      size: 1.2 + rand() * 2.4,
      drift: 0.02 + rand() * 0.05,
      phase: rand() * TAU,
      tone:
        rand() < 0.55
          ? "rgba(29, 59, 255, 0.55)"
          : rand() < 0.8
            ? "rgba(7, 21, 47, 0.35)"
            : "rgba(109, 75, 255, 0.45)",
    }));

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      if (reduced) draw(0);
    };

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      for (const p of parts) {
        const a = p.angle + time * p.drift;
        const breathe = reduced ? 0 : Math.sin(time * 0.5 + p.phase) * 4;
        const r = R * p.radial + breathe;
        ctx.fillStyle = p.tone;
        ctx.fillRect(
          cx + Math.cos(a) * r - p.size / 2,
          cy + Math.sin(a) * r * 0.92 - p.size / 2,
          p.size,
          p.size
        );
      }
      ctx.restore();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduced) {
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    let visible = false;
    const render = (now: number) => {
      if (!running) return;
      draw(now / 1000);
      raf = requestAnimationFrame(render);
    };
    const setRunning = () => {
      const next = visible && !document.hidden;
      if (next && !running) {
        running = true;
        raf = requestAnimationFrame(render);
      } else if (!next && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        setRunning();
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);
    const onVis = () => setRunning();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return (
    <section
      aria-labelledby="particle-stat-title"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-24 md:px-8"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="relative z-10 text-center">
        <Reveal>
          <Eyebrow className="justify-center">Trusted worldwide</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            id="particle-stat-title"
            className="f-display mt-5 text-[1.1rem] text-[var(--color-text-secondary)] md:text-[1.35rem]"
          >
            Financial advice, delivered:
          </h2>
        </Reveal>
        <p className="f-display mt-2 text-[clamp(4.5rem,16vw,11rem)] leading-none text-[var(--color-text-primary)]">
          <AnimatedValue value={5_000_000} format="compact" suffix="+" duration={2} />
        </p>
      </div>
    </section>
  );
}
