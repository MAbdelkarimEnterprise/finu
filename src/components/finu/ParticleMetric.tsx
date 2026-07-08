"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { mulberry32 } from "./particleTargets";

const TAU = Math.PI * 2;
const MAX_PARTICLES = 150;

export type RingConfig = {
  /** Visible particles (≤ 150). */
  count: number;
  /** Ring radius as a fraction of the largest safe radius. */
  radius: number;
};

type RingParticle = {
  angle: number;
  speed: number;
  jitter: number;
  size: number;
  glyph: number; // 0 dot · 1 square
  tone: string;
  phase: number;
  alpha: number;
  radiusPush: number; // pointer disturbance, decays
};

/**
 * Orbital particle ring around the central metric. Particles breathe
 * and drift at rest, reconfigure (density + radius) when the selected
 * metric changes, and yield a restrained local disturbance near the
 * pointer. The center stays clear for the DOM value. Pauses offscreen
 * and in hidden tabs; reduced motion renders one static frame.
 */
export default function ParticleMetric({ config }: { config: RingConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = mulberry32(4114);
    const particles: RingParticle[] = Array.from(
      { length: MAX_PARTICLES },
      (): RingParticle => {
        const t = rand();
        return {
          angle: rand() * TAU,
          speed: 0.05 + rand() * 0.09,
          jitter: 0.86 + rand() * 0.24,
          size: 1.3 + rand() * 1.7,
          glyph: rand() < 0.72 ? 0 : 1,
          tone:
            t < 0.68
              ? "rgba(30, 94, 255, 0.85)"
              : t < 0.88
                ? "rgba(90, 168, 255, 0.9)"
                : "rgba(77, 124, 255, 0.85)",
          phase: rand() * TAU,
          alpha: 0,
          radiusPush: 0,
        };
      }
    );

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawFrame(performance.now(), 1);
    });
    ro.observe(canvas);
    resize();

    /* The canvas sits behind the tile content, so pointer events land
       on the overlay — listen on the shared parent instead. */
    const host = canvas.parentElement ?? canvas;
    const pointer = { x: -9999, y: -9999 };
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
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

    let radiusScale = configRef.current.radius;

    /** Paints one frame; `snap` = 1 jumps straight to targets. */
    const drawFrame = (now: number, snap = 0) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;
      const cfg = configRef.current;
      const time = now / 1000;

      radiusScale += (cfg.radius - radiusScale) * (snap ? 1 : 0.06);
      const R = maxR * radiusScale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      /* Faint guide orbits */
      ctx.strokeStyle = "rgba(17, 24, 39, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 7]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([1.5, 10]);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.8, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const targetAlpha = i < cfg.count ? 1 : 0;
        p.alpha += (targetAlpha - p.alpha) * (snap ? 1 : 0.07);
        if (p.alpha < 0.02) continue;

        if (!snap) {
          p.angle += p.speed / 60;
          p.radiusPush *= 0.92;
        }

        const breathe = snap ? 0 : Math.sin(time * 0.7 + p.phase) * 2.2;
        const r = R * p.jitter + breathe + p.radiusPush;
        let x = cx + Math.cos(p.angle) * r;
        let y = cy + Math.sin(p.angle) * r;

        /* Restrained pointer disturbance */
        if (!snap) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 90 * 90 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = ((90 - d) / 90) * 10;
            x += (dx / d) * push;
            y += (dy / d) * push;
            p.radiusPush = Math.min(p.radiusPush + 0.35, 8);
          }
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.tone;
        if (p.glyph === 0) {
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillRect(x - p.size, y - p.size, p.size * 2, p.size * 2);
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    if (reduced) {
      /* Static frame now and whenever the config changes. */
      drawFrame(performance.now(), 1);
      let last = configRef.current;
      const poll = setInterval(() => {
        if (configRef.current !== last) {
          last = configRef.current;
          drawFrame(performance.now(), 1);
        }
      }, 300);
      return () => {
        clearInterval(poll);
        ro.disconnect();
      };
    }

    if (!isTouch) {
      host.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);
    }

    let raf = 0;
    let running = false;
    let visible = false;

    const render = (now: number) => {
      if (!running) return;
      drawFrame(now);
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
      document.removeEventListener("visibilitychange", onVisibility);
      if (!isTouch) {
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
