"use client";

// → src/components/finu/ImmersiveScene.tsx  (also exports StatementBand)

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { Reveal, TextReveal } from "./TextReveal";

type Tone = "mist" | "sky" | "royal" | "sand";
type Squared = "bl" | "br";

/**
 * Full-viewport immersive product scene: soft tinted full-bleed field,
 * eyebrow, oversized heading, short body, one CTA, one visual slot.
 * The Cleo-scale scene rhythm, painted entirely in Finu's light palette.
 */
export default function ImmersiveScene({
  tone = "mist",
  eyebrow,
  title,
  body,
  href,
  cta = "Learn more",
  visual,
  reverse = false,
  squared,
}: {
  tone?: Tone;
  eyebrow: string;
  title: string;
  body?: string;
  href?: string;
  cta?: string;
  visual?: ReactNode;
  reverse?: boolean;
  squared?: Squared;
}) {
  return (
    <section
      aria-label={eyebrow}
      className={`f-scene f-scene-${tone} relative mx-[var(--gutter-slim)] flex min-h-[100svh] items-center overflow-hidden rounded-[var(--radius-large)] f-section ${squared === "bl" ? "rounded-bl-none" : squared === "br" ? "rounded-br-none" : ""}`}
    >
      <div
        className={`mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-10 ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        <div className="max-w-xl lg:[direction:ltr]">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <TextReveal
            as="h2"
            className="f-display mt-6 text-[clamp(2.2rem,4.8vw,3.6rem)]"
          >
            {title}
          </TextReveal>
          {body && (
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
                {body}
              </p>
            </Reveal>
          )}
          {href && (
            <Reveal delay={0.22}>
              <a
                href={href}
                className="group mt-8 inline-flex min-h-[44px] items-center gap-1.5 text-[0.95rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-deep)]"
              >
                {cta}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </Reveal>
          )}
        </div>

        {visual && (
          <Reveal delay={0.12} className="lg:[direction:ltr]">
            {visual}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Oversized centered statement between scenes — the breathing room. */
export function StatementBand({
  children,
  size = "lg",
}: {
  children: string;
  size?: "lg" | "md";
}) {
  return (
    <section className="f-section-loose">
      <TextReveal
        as="h2"
        className={`f-display mx-auto max-w-4xl text-center ${
          size === "lg"
            ? "text-[clamp(2.4rem,6vw,4.6rem)]"
            : "text-[clamp(1.9rem,4vw,3rem)]"
        }`}
      >
        {children}
      </TextReveal>
    </section>
  );
}
