"use client";

/* eslint-disable @next/next/no-img-element */

import Eyebrow from "./Eyebrow";
import { Reveal, TextReveal } from "./TextReveal";

/* Logo assets mirrored from meetfinu.com. */
const INVESTORS = [
  "zentara-capital",
  "orvion-ventures",
  "kryos-labs",
  "velaris-partners",
  "nexora-capital",
  "altaris-ventures",
  "solvex-group",
  "arqon-capital",
  "mythos-ventures",
];

const PARTNERS = [
  "tether",
  "solana",
  "monad",
  "tron",
  "binance",
  "ton",
  "openai",
  "azure",
  "circle",
  "sumsub",
  "crossmint",
  "polygon",
  "sui",
  "arbitrum",
  "base",
  "aws",
];

function prettify(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function LogoMarquee({
  slugs,
  kind,
  duration,
  label,
}: {
  slugs: string[];
  kind: "investors" | "partners";
  duration: string;
  label: string;
}) {
  const tiles = slugs.map((slug) => (
    <li key={slug} className="f-logo-tile flex-none">
      <img
        src={`/images/brand/brand-${kind}-${slug}.webp`}
        alt={prettify(slug)}
        loading="lazy"
        className="max-h-9 w-auto max-w-[9.5rem] object-contain"
      />
    </li>
  ));

  return (
    <div className="f-marquee" role="group" aria-label={label}>
      <ul
        className="f-marquee-track list-none"
        style={{ "--f-pan-duration": duration } as React.CSSProperties}
      >
        {tiles}
        {/* Duplicate run for the seamless loop — hidden from readers. */}
        {slugs.map((slug) => (
          <li key={`${slug}-dup`} aria-hidden className="f-logo-tile flex-none">
            <img
              src={`/images/brand/brand-${kind}-${slug}.webp`}
              alt=""
              loading="lazy"
              className="max-h-9 w-auto max-w-[9.5rem] object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="f-section-tone-deep relative scroll-mt-24 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="text-center">
          <Eyebrow className="justify-center">Backed and integrated</Eyebrow>
        </Reveal>
        <TextReveal
          as="h2"
          className="f-display mt-5 text-center text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Our Investors & Partners
        </TextReveal>
        <span id="partners-title" className="sr-only">
          Our investors and partners
        </span>

        <div className="mt-14 space-y-4">
          <p className="f-mono text-center text-[0.6rem] text-[var(--f-text-faint)]">
            Our Investors
          </p>
          <LogoMarquee
            slugs={INVESTORS}
            kind="investors"
            duration="44s"
            label="Finu investors"
          />
          <p className="f-mono pt-8 text-center text-[0.6rem] text-[var(--f-text-faint)]">
            Our Partners
          </p>
          <LogoMarquee
            slugs={PARTNERS}
            kind="partners"
            duration="58s"
            label="Finu partners and supported ecosystems"
          />
        </div>
      </div>
    </section>
  );
}
