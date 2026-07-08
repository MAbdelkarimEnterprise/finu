"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { mulberry32 } from "../finu/particleTargets";

/**
 * The living layers of the dive: rising bubbles that pop, drifting
 * plankton motes, swaying kelp silhouettes at the edges, and an
 * occasional jellyfish crossing far behind the content. Fixed,
 * pointer-transparent, aria-hidden; every layer parallaxes at its
 * own rate against scroll and (subtly) the pointer. Reduced motion
 * renders nothing — the static backdrop carries the scene.
 */
export default function OceanLayers() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Pointer drift: one listener writes CSS vars; layers translate by
     calc(var(--omx) * factor). No React state per move. */
  useEffect(() => {
    if (reduced || isMobile !== false) return;
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--omx", `${(e.clientX / innerWidth - 0.5) * 2}`);
        el.style.setProperty("--omy", `${(e.clientY / innerHeight - 0.5) * 2}`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, isMobile]);

  const rand = useMemo(() => mulberry32(777), []);
  const bubbles = useMemo(() => {
    const count = isMobile ? 7 : 14;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 4 + rand() * 92,
      size: 5 + rand() * 13,
      duration: 14 + rand() * 16,
      delay: -rand() * 26,
      drift: (rand() - 0.5) * 60,
    }));
  }, [rand, isMobile]);

  const plankton = useMemo(() => {
    const count = isMobile ? 10 : 26;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1.5 + rand() * 2.5,
      duration: 6 + rand() * 9,
      delay: -rand() * 12,
    }));
  }, [rand, isMobile]);

  if (reduced || isMobile === null) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: "calc(var(--z-backdrop) + 1)" }}
    >
      {/* Plankton — the slowest layer, barely drifting */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            "translate(calc(var(--omx, 0) * 6px), calc(var(--omy, 0) * 4px))",
          transition: "transform 1.2s var(--ease-out-expo)",
        }}
      >
        {plankton.map((m) => (
          <motion.span
            key={m.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
            }}
            animate={{ opacity: [0.05, 0.4, 0.05], y: [0, -14, 0] }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Bubbles — rise the full viewport, wobble, pop at the top */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            "translate(calc(var(--omx, 0) * 12px), calc(var(--omy, 0) * 8px))",
          transition: "transform 0.9s var(--ease-out-expo)",
        }}
      >
        {bubbles.map((b) => (
          <motion.span
            key={b.id}
            className="absolute block rounded-full"
            style={{
              left: `${b.left}%`,
              bottom: -24,
              width: b.size,
              height: b.size,
              border: "1px solid rgba(255,255,255,0.55)",
              background:
                "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 60%)",
            }}
            animate={{
              y: [0, "-108vh"],
              x: [0, b.drift],
              opacity: [0, 0.8, 0.8, 0],
              scale: [1, 1.15, 1.15, 1.6],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.92, 1],
            }}
          />
        ))}
      </div>

      {/* Kelp silhouettes swaying at the edges */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          transform:
            "translate(calc(var(--omx, 0) * 18px), calc(var(--omy, 0) * 6px))",
          transition: "transform 0.7s var(--ease-out-expo)",
        }}
      >
        <motion.svg
          viewBox="0 0 120 320"
          className="absolute bottom-0 left-[-1.5rem] w-24 origin-bottom md:w-32"
          style={{ color: "rgba(7, 33, 64, calc(0.05 + var(--ocean-depth, 0) * 0.13))" }}
          animate={{ rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M60 320 C 40 260, 78 230, 58 170 C 42 120, 74 90, 60 30 C 55 10, 62 4, 60 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M30 320 C 22 270, 44 240, 32 190 C 24 150, 40 120, 32 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 120 260"
          className="absolute bottom-0 right-[-1rem] w-20 origin-bottom md:w-28"
          style={{ color: "rgba(7, 33, 64, calc(0.04 + var(--ocean-depth, 0) * 0.12))" }}
          animate={{ rotate: [2, -2.5, 2] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: -4 }}
        >
          <path
            d="M60 260 C 76 210, 48 180, 64 130 C 76 90, 52 60, 62 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M90 260 C 98 220, 82 190, 92 150 C 99 118, 86 92, 92 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </motion.svg>
      </div>

      {/* A jellyfish drifts across, far away, every so often */}
      {!isMobile && (
        <motion.svg
          viewBox="0 0 80 100"
          className="absolute top-[30%] w-14"
          style={{ color: "rgba(233, 240, 252, 0.6)" }}
          initial={{ x: "-12vw" }}
          animate={{ x: "112vw", y: [0, -30, 8, -22, 0] }}
          transition={{
            x: { duration: 46, repeat: Infinity, repeatDelay: 18, ease: "linear" },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <path
            d="M40 14 C 18 14, 10 34, 12 44 C 22 40, 30 40, 40 44 C 50 40, 58 40, 68 44 C 70 34, 62 14, 40 14"
            fill="currentColor"
          />
          {[22, 32, 42, 52].map((x, i) => (
            <motion.path
              key={x}
              d={`M${x} 46 C ${x - 3} 62, ${x + 3} 74, ${x - 1} 92`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ pathOffset: [0, 0.06, 0] }}
              transition={{
                duration: 2.4 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.svg>
      )}
    </div>
  );
}
