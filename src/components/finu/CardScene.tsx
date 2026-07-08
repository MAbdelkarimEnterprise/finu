"use client";

// → src/components/finu/CardScene.tsx

import { ArrowUpRight } from "lucide-react";
import { LINKS } from "./links";
import Eyebrow from "./Eyebrow";
import FinuCard from "./FinuCard";
import { Reveal, TextReveal } from "./TextReveal";

/* Approved card copy from meetfinu.com — nothing invented. */
const COLUMNS = [
  {
    title: "Digital-first spending",
    body: "Effortless, secure payments for subscriptions, travel, and everyday purchases.",
  },
  {
    title: "Tap into everyday spending",
    body: "Shop, withdraw, and manage your funds globally with our stablecoin-based card.",
  },
  {
    title: "Virtual and physical",
    body: "Pay with stablecoins — one card for online and in-person, wherever you are.",
  },
];

/**
 * Full-bleed card moment: the FinuCard huge and tilted in a royal-
 * tinted field, with three supporting columns beneath — the premium
 * single-product scene.
 */
export default function CardScene() {
  return (
    <section
      id="cards"
      aria-labelledby="card-scene-title"
      className="f-scene f-scene-royal relative flex min-h-[100svh] flex-col justify-center overflow-hidden f-section scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <Eyebrow>The Finu Card</Eyebrow>
        </Reveal>
        <TextReveal
          as="h2"
          className="f-display mt-6 max-w-2xl text-[clamp(2.2rem,4.8vw,3.6rem)]"
        >
          Your everyday benefits, on one card.
        </TextReveal>
        <span id="card-scene-title" className="sr-only">
          The Finu Card
        </span>

        {/* The card, oversized and slightly rotated */}
        <Reveal delay={0.15} className="f-tilt my-14 md:my-16">
          <div className="mx-auto w-[min(34rem,92vw)] -rotate-3 transition-transform duration-700 hover:rotate-0">
            <FinuCard variant="royal" />
          </div>
        </Reveal>

        <div className="grid gap-8 border-t border-[var(--color-border)] pt-10 md:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.1}>
              <h3 className="text-[1.05rem] font-medium text-[var(--color-text-primary)]">
                {col.title}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--color-text-secondary)]">
                {col.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10">
          <a
            href={LINKS.card}
            className="group inline-flex min-h-[44px] items-center gap-1.5 text-[0.95rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-deep)]"
          >
            Read more about the card
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
