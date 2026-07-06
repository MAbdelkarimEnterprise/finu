"use client";

import Image from "next/image";
import { ArrowUpRight, Nfc, Wifi } from "lucide-react";
import { LINKS } from "./links";
import Eyebrow from "./Eyebrow";
import InteractiveSurface from "./InteractiveSurface";
import { Reveal, TextReveal } from "./TextReveal";

const CARDS = [
  {
    id: "virtual",
    tag: "Virtual Card",
    title: "Digital-First Spending, Made Simple",
    body: "Experience effortless, secure payments for subscriptions, travel, and everyday purchases.",
    href: LINKS.card,
  },
  {
    id: "physical",
    tag: "Physical Card",
    title: "Tap Into Everyday Spending",
    body: "Shop, withdraw, and manage your funds globally with our stablecoin-based card.",
    href: LINKS.card,
  },
] as const;

/** A Finu card drawn in CSS — no stock photography. */
function CardVisual({ variant }: { variant: "virtual" | "physical" }) {
  const physical = variant === "physical";
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[1.586] w-full max-w-[19rem] overflow-hidden rounded-2xl border p-5"
      style={{
        borderColor: "rgba(247,249,255,0.14)",
        background: physical
          ? "linear-gradient(135deg, #141f3a 0%, #0d1428 55%, #16264d 100%)"
          : "linear-gradient(135deg, #1b2a55 0%, #0d1428 50%, #251d4d 100%)",
        boxShadow: "0 30px 70px -28px rgba(2,4,12,0.9)",
      }}
    >
      <div
        className="absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-40"
        style={{
          background: physical
            ? "radial-gradient(closest-side, rgba(79,124,255,0.5), transparent)"
            : "radial-gradient(closest-side, rgba(134,104,255,0.5), transparent)",
        }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Image
            src="/images/finu-logo.png"
            alt=""
            width={64}
            height={20}
            className="h-4 w-auto opacity-90"
          />
          {physical ? (
            <Nfc className="h-5 w-5 text-[rgba(247,249,255,0.6)]" />
          ) : (
            <Wifi className="h-5 w-5 rotate-90 text-[rgba(247,249,255,0.6)]" />
          )}
        </div>
        <div>
          {physical && (
            <div
              className="mb-3 h-7 w-9 rounded-md border border-[rgba(247,249,255,0.25)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,196,81,0.85), rgba(245,196,81,0.5))",
              }}
            />
          )}
          <p className="f-mono text-[0.66rem] tracking-[0.3em] text-[rgba(247,249,255,0.82)]">
            •••• •••• •••• 4021
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="f-mono text-[0.5rem] text-[rgba(247,249,255,0.5)]">
              {physical ? "Physical · Stablecoin" : "Virtual · Instant issue"}
            </p>
            <p className="f-mono text-[0.55rem] text-[rgba(247,249,255,0.65)]">
              USDC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
                <CardVisual variant={card.id} />
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
