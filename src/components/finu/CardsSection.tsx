"use client";

import { ArrowUpRight } from "lucide-react";
import { LINKS } from "./links";
import Eyebrow from "./Eyebrow";
import FinuCard from "./FinuCard";
import InteractiveSurface from "./InteractiveSurface";
import { Reveal, TextReveal } from "./TextReveal";

const CARDS = [
  {
    id: "virtual",
    variant: "royal",
    tag: "Virtual Card",
    title: "Digital-First Spending, Made Simple",
    body: "Experience effortless, secure payments for subscriptions, travel, and everyday purchases.",
    href: LINKS.card,
  },
  {
    id: "physical",
    variant: "navy",
    tag: "Physical Card",
    title: "Tap Into Everyday Spending",
    body: "Shop, withdraw, and manage your funds globally with our stablecoin-based card.",
    href: LINKS.card,
  },
] as const;

export default function CardsSection() {
  return (
    <section
      id="cards"
      aria-labelledby="cards-title"
      className="relative scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="f-glow-primary pointer-events-none absolute inset-x-0 top-0 h-72" />
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow>Your Everyday Benefits</Eyebrow>
        </Reveal>
        <TextReveal
          as="h2"
          className="f-display mt-5 max-w-xl text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Our Cards
        </TextReveal>
        <span id="cards-title" className="sr-only">
          Our Cards
        </span>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          {CARDS.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.12} className="f-tilt">
              <InteractiveSurface
                as="article"
                className="f-card f-card-hover flex h-full flex-col gap-8 p-7 md:p-9"
              >
                <FinuCard
                  variant={card.variant}
                  className="mx-auto max-w-[19rem]"
                />
                <div>
                  <p className="f-mono text-[0.6rem] text-[var(--color-accent)]">
                    {card.tag}
                  </p>
                  <h3 className="f-display mt-3 text-xl md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--color-text-secondary)]">
                    {card.body}
                  </p>
                  <a
                    href={card.href}
                    className="group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-[0.9rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    Read more
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                </div>
              </InteractiveSurface>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
