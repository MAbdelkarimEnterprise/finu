"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  makeFormations,
  makeParticles,
  type Particle,
  type Pt,
} from "./particleTargets";

gsap.registerPlugin(ScrollTrigger);

/* Grounded in existing Finu positioning — no new product claims. */
const STORY = [
  {
    title: "Money moves everywhere.",
    body: "Payments, transfers, swaps — activity scattered across rails and borders.",
  },
  {
    title: "Finu reads the signal.",
    body: "AI-powered financial intelligence built into every account.",
  },
  {
    title: "Routes the right path.",
    body: "Send crypto, receive local currency — every recipient moments away.",
  },
  {
    title: "Settles with confidence.",
    body: "Swift. Seamless. Secure.",
  },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Draws one particle glyph. */
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  x: number,
  y: number
) {
  ctx.fillStyle = p.tone;
  const s = p.size;
  switch (p.glyph) {
    case 0:
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 1:
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
      break;
    case 2:
      ctx.fillRect(x - s * 1.4, y - s * 0.45, s * 2.8, s * 0.9);
      ctx.fillRect(x - s * 0.45, y - s * 1.4, s * 0.9, s * 2.8);
      break;
    default:
      ctx.fillRect(x - s * 1.6, y - s * 0.5, s * 3.2, s);
  }
}

/**
 * Scroll-driven particle story: scattered activity → global network →
 * AI pulse → settlement ring. Desktop pins ~280vh via a sticky stage
 * with ScrollTrigger progress; mobile advances by section reveals;
 * reduced motion shows the final formation and the full copy.
 */
export default function ParticleNarrative() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const formationRef = useRef(0); // mobile: discrete target formation
  const [step, setStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Canvas engine (shared by desktop + mobile paths) ─────── */
  useEffect(() => {
    if (reduced || isDesktop === null) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const count = isDesktop ? 640 : 240;
    const particles = makeParticles(count);
    let formations: Pt[][] = [];
    let seeded = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      formations = makeFormations(rect.width, rect.height, count);
      if (!seeded) {
        particles.forEach((p, i) => {
          p.x = formations[0][i].x;
          p.y = formations[0][i].y;
        });
        seeded = true;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const pointer = { x: -9999, y: -9999 };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    if (!isTouch) {
      wrap.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    let running = false;
    let visible = false;

    /* Desktop: ScrollTrigger maps the 280vh wrapper to progress. */
    let trigger: ScrollTrigger | null = null;
    if (isDesktop) {
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const idx = Math.min(3, Math.floor(self.progress * 4));
          setStep((s) => (s === idx ? s : idx));
        },
      });
    }

    const render = (now: number) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (formations.length === 0) {
        raf = requestAnimationFrame(render);
        return;
      }

      /* Continuous segment position (0..3). */
      const seg = isDesktop
        ? Math.min(progressRef.current, 0.999) * 3.75 // reach ring by ~80%
        : formationRef.current;
      const base = Math.min(3, Math.floor(seg));
      const next = Math.min(3, base + 1);
      const frac = Math.min(1, seg - base);
      const time = now / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const from = formations[base][i];
        const to = formations[next][i];
        const f = smooth(
          Math.min(1, Math.max(0, (frac - p.stagger * 0.25) / 0.75))
        );
        let tx = from.x + (to.x - from.x) * f;
        let ty = from.y + (to.y - from.y) * f;

        /* tiny independent drift */
        tx += Math.sin(time * 0.6 + p.phase) * 1.6;
        ty += Math.cos(time * 0.5 + p.phase) * 1.6;

        /* gentle pointer repulsion (desktop only) */
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 110 * 110 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = ((110 - d) / 110) * 14;
          tx += (dx / d) * push;
          ty += (dy / d) * push;
        }

        p.x += (tx - p.x) * 0.09;
        p.y += (ty - p.y) * 0.09;

        if (p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20) {
          drawGlyph(ctx, p, p.x, p.y);
        }
      }

      ctx.restore();
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
      ([entry]) => {
        visible = entry.isIntersecting;
        setRunning();
      },
      { rootMargin: "60px" }
    );
    io.observe(canvas);

    const onVisibility = () => setRunning();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      trigger?.kill();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!isTouch) {
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, [reduced, isDesktop]);

  /* Mobile step trigger: advance the formation as each block reveals. */
  const StepBlock = ({ index }: { index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { margin: "-42% 0px -42% 0px" });
    useEffect(() => {
      if (inView) {
        formationRef.current = index;
        setStep(index);
      }
    }, [inView, index]);
    return (
      <div ref={ref} className="py-14 text-center">
        <p className="f-display text-2xl text-[var(--color-text-primary)]">
          {STORY[index].title}
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[0.9rem] leading-relaxed text-[var(--color-text-secondary)]">
          {STORY[index].body}
        </p>
      </div>
    );
  };

  /* ── Reduced motion: static formation + complete semantic copy ── */
  if (reduced) {
    return (
      <section
        aria-labelledby="narrative-title"
        className="relative f-section"
      >
        <h2 id="narrative-title" className="sr-only">
          How Finu moves money
        </h2>
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-2 md:items-center">
          <StaticRing />
          <div className="space-y-8">
            {STORY.map((s) => (
              <div key={s.title}>
                <p className="f-display text-2xl">{s.title}</p>
                <p className="mt-2 text-[0.92rem] text-[var(--color-text-secondary)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="narrative-title" className="relative">
      <h2 id="narrative-title" className="sr-only">
        How Finu moves money
      </h2>

      {isDesktop !== false ? (
        /* Desktop: 280vh scroll stage with a sticky viewport. */
        <div ref={wrapRef} className="relative hidden lg:block" style={{ height: "280vh" }}>
          <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            <div className="relative z-10 px-8 text-center">
              {STORY.map((s, i) => (
                <div
                  key={s.title}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-700"
                  style={{
                    opacity: step === i ? 1 : 0,
                    transform: `translateY(${step === i ? "-50%" : step > i ? "-58%" : "-42%"})`,
                    pointerEvents: "none",
                  }}
                  aria-hidden={step !== i}
                >
                  <p className="f-display text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--color-text-primary)]">
                    {s.title}
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-base text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>
                </div>
              ))}
              {/* Reserve space for the tallest state */}
              <div className="invisible">
                <p className="f-display text-[clamp(2rem,4.5vw,3.4rem)]">
                  {STORY[0].title}
                </p>
                <p className="mx-auto mt-4 max-w-md text-base">{STORY[0].body}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile / tablet: sticky canvas, formations advance on reveal. */}
      <div ref={isDesktop === false ? wrapRef : undefined} className="lg:hidden">
        <div className="sticky top-16 z-0 mx-auto h-[44vh] max-w-md px-5">
          <canvas ref={isDesktop === false ? canvasRef : undefined} className="h-full w-full" aria-hidden />
        </div>
        <div className="relative z-10 px-5 pb-10">
          {STORY.map((_, i) => (
            <StepBlock key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Static settlement-ring frame for reduced motion. */
function StaticRing() {
  return (
    <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-sm" aria-hidden>
      <circle
        cx="160"
        cy="160"
        r="112"
        fill="none"
        stroke="rgba(79,124,255,0.5)"
        strokeWidth="2"
        strokeDasharray="2 7"
      />
      <circle
        cx="160"
        cy="160"
        r="88"
        fill="none"
        stroke="rgba(56,221,248,0.35)"
        strokeWidth="1.4"
        strokeDasharray="1.5 9"
      />
      <circle cx="160" cy="160" r="5" fill="#4F7CFF" />
    </svg>
  );
}
