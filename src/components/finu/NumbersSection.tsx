"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Reveal, TextReveal } from "./TextReveal";

type Stat = {
  value?: number;
  prefix?: string;
  suffix?: string;
  literal?: string;
  label: string;
  detail: string;
  footnote?: boolean;
};

const STATS: Stat[] = [
  {
    prefix: "$",
    value: 190,
    suffix: "T+",
    label: "Global payments, annually",
    detail:
      "The value already moving through the system Finu orchestrates — the largest market in the world.",
    footnote: true,
  },
  {
    prefix: "$",
    value: 230,
    suffix: "B+",
    label: "In stablecoins today",
    detail:
      "The new settlement rail is already at scale, growing faster than any payment network before it.",
    footnote: true,
  },
  {
    literal: "Seconds",
    label: "To final settlement",
    detail:
      "On stablecoin rails, finality is measured in seconds — not correspondent-banking days.",
  },
  {
    literal: "24/7",
    label: "Always-on rails",
    detail:
      "No cutoffs, weekends, or banking hours between you and your money. The network never closes.",
  },
];

/**
 * Count-up that renders the final value in markup and only animates as
 * a progressive enhancement — direct links, no-JS, and reduced-motion
 * all land on a complete, readable figure.
 */
function CountValue({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);
  const animate = inView && !reduced && stat.value !== undefined;

  useEffect(() => {
    if (!animate) return;
    let frame: number;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(stat.value! * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, stat.value]);

  if (stat.literal) return <span ref={ref}>{stat.literal}</span>;

  return (
    <span ref={ref}>
      {stat.prefix}
      {display ?? stat.value}
      <span className="text-[var(--f-ink-faint)]">{stat.suffix}</span>
    </span>
  );
}

/**
 * #numbers — the proof beat. Semantic stat cards that read completely
 * without animation, laid out as a white card row over a warm field.
 */
export default function NumbersSection() {
  return (
    <section
      id="numbers"
      aria-labelledby="numbers-title"
      className="scroll-mt-24 bg-[var(--f-bg-warm)] px-6 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="f-eyebrow justify-center text-[var(--f-ink-faint)]">
              Finu in numbers
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            className="f-display mt-6 text-balance text-[clamp(2.2rem,4.6vw,3.8rem)]"
          >
            The shift is already here.
          </TextReveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[var(--f-ink-dim)]">
              The rails Finu builds on aren&apos;t a thesis — they&apos;re an
              industry. Here is the scale of it.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-[1.6rem] border border-[rgba(33,29,25,0.06)] bg-[var(--f-card)] p-7 shadow-[0_10px_36px_-16px_rgba(33,29,25,0.18)]">
                <p className="f-display text-[clamp(2.6rem,3.6vw,3.4rem)] leading-none">
                  <CountValue stat={stat} />
                </p>
                <h3 className="f-mono mt-5 text-[0.62rem] text-[var(--f-ink-dim)]">
                  {stat.label}
                  {stat.footnote && (
                    <sup>
                      <a
                        href="#footnotes"
                        aria-label="See data source note"
                        className="ml-0.5 no-underline"
                      >
                        1
                      </a>
                    </sup>
                  )}
                </h3>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-[var(--f-ink-dim)]">
                  {stat.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
