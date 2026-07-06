"use client";

import { useState } from "react";
import AnimatedValue from "./AnimatedValue";
import InteractiveSurface from "./InteractiveSurface";
import { Reveal, TextReveal } from "./TextReveal";

/* Figures published on meetfinu.com ("Trusted Worldwide").
   Counted through natural compact steps (412K → 1M), never "0M+". */
const METRICS = [
  { value: 1_000_000, suffix: "+", label: "Global users" },
  { value: 160, suffix: "+", label: "Countries" },
  { value: 5_000_000, suffix: "+", label: "Financial advice" },
];

export default function MetricsSection() {
  const [done, setDone] = useState<boolean[]>(() =>
    METRICS.map(() => false)
  );

  return (
    <section
      id="metrics"
      aria-labelledby="metrics-title"
      className="f-section-tone-raised relative scroll-mt-24 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="f-grid-texture" aria-hidden />
      <div className="f-glow-primary pointer-events-none absolute inset-x-0 top-0 h-64" />
      <div className="relative mx-auto max-w-[1200px]">
        <TextReveal
          as="h2"
          className="f-display text-center text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Trusted Worldwide
        </TextReveal>
        <span id="metrics-title" className="sr-only">
          Trusted worldwide
        </span>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.1}>
              <InteractiveSurface
                className={`f-card f-card-hover flex h-full flex-col items-center justify-center gap-2 p-10 text-center ${
                  done[i] ? "f-metric-done" : ""
                }`}
              >
                <p className="f-display text-4xl md:text-5xl">
                  <AnimatedValue
                    value={m.value}
                    format="compact"
                    suffix={m.suffix}
                    onComplete={() =>
                      setDone((prev) => {
                        if (prev[i]) return prev;
                        const next = [...prev];
                        next[i] = true;
                        return next;
                      })
                    }
                  />
                </p>
                <p className="text-[0.9rem] text-[var(--color-text-secondary)]">
                  {m.label}
                </p>
              </InteractiveSurface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
