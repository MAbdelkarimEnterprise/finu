"use client";

import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import Eyebrow from "@/components/finu/Eyebrow";
import { TESTIMONIALS } from "@/lib/landing-content";

const TONES = [
  { bg: "var(--color-butter-soft)", accent: "var(--color-warning)" },
  { bg: "var(--color-surface-raised)", accent: "var(--color-accent)" },
  { bg: "var(--color-mint)", accent: "var(--color-positive)" },
] as const;

/**
 * Voice cards — clearly labelled as example voices until real
 * testimonials exist. No fake attribution, no invented ratings.
 */
export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">{TESTIMONIALS.eyebrow}</Eyebrow>
          <TextReveal as="h2" className="f-display mt-5 text-[length:var(--text-display)]">
            {TESTIMONIALS.headline}
          </TextReveal>
          <span id="testimonials-title" className="sr-only">
            {TESTIMONIALS.headline}
          </span>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:mt-16">
          {TESTIMONIALS.quotes.map((item, i) => {
            const tone = TONES[i % TONES.length];
            return (
              <Reveal key={item.name} delay={0.1 + i * 0.1}>
                <figure
                  className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] p-7"
                  style={{ background: tone.bg }}
                >
                  <blockquote className="text-[1.08rem] font-medium leading-relaxed text-[var(--color-text)]">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-full text-[0.8rem] font-semibold text-white"
                      style={{ background: tone.accent }}
                      aria-hidden
                    >
                      {item.initials}
                    </span>
                    <span>
                      <span className="block text-[0.85rem] font-semibold text-[var(--color-text)]">
                        {item.name}
                      </span>
                      <span className="block text-[0.7rem] text-[var(--color-text-muted)]">
                        {item.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-6 text-center text-[0.72rem] text-[var(--color-text-muted)]">
            {TESTIMONIALS.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
