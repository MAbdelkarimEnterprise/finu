"use client";

import { Reveal } from "./TextReveal";

/**
 * Wordmark-styled logo wall. Each partner gets a typographic treatment
 * rather than a raster logo — keeps the wall monochrome and premium.
 */
const ROW_A = [
  { name: "Tether", style: "font-semibold tracking-tight" },
  { name: "Circle", style: "font-medium tracking-[0.08em]" },
  { name: "Solana", style: "font-semibold italic tracking-tight" },
  { name: "Polygon", style: "font-medium tracking-tight" },
  { name: "Base", style: "font-bold tracking-[0.04em]" },
];

const ROW_B = [
  { name: "TON", style: "font-bold tracking-[0.18em]" },
  { name: "Arbitrum", style: "font-medium tracking-tight" },
  { name: "AWS", style: "font-bold tracking-[0.12em]" },
  { name: "Azure", style: "font-medium italic tracking-tight" },
  { name: "OpenAI", style: "font-semibold tracking-tight" },
];

function MarqueeRow({
  items,
  reverse = false,
  duration = 42,
}: {
  items: typeof ROW_A;
  reverse?: boolean;
  duration?: number;
}) {
  // Track is duplicated so the -50% translate loops seamlessly
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="f-marquee py-5">
      <div
        className="f-marquee-track items-center gap-24 pr-24"
        data-reverse={reverse}
        style={{ "--f-marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`f-display whitespace-nowrap text-2xl text-[var(--f-ink-faint)] transition-colors duration-500 hover:text-[var(--f-ink)] md:text-3xl ${item.style}`}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LogoWall() {
  return (
    <section className="relative py-28 md:py-36">
      <Reveal className="mb-14 text-center">
        <p className="f-eyebrow">
          Built on the rails the industry trusts
        </p>
      </Reveal>
      <MarqueeRow items={ROW_A} duration={46} />
      <MarqueeRow items={ROW_B} reverse duration={54} />
    </section>
  );
}
