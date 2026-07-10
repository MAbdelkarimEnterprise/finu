"use client";

import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import Eyebrow from "@/components/finu/Eyebrow";
import { FEATURES } from "@/lib/landing-content";
import FeatureVisual from "./FeatureVisuals";

/**
 * Five alternating feature bands: copy on one side, an original app
 * UI composition on the other. Odd bands flip; every visual sits on
 * a soft raised panel so the rhythm reads band → band, not card grid.
 */
export default function FeatureBands() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-24 px-5 pb-10 md:px-8"
    >
      <h2 id="features-title" className="sr-only">
        What Finu does
      </h2>
      <div className="mx-auto max-w-[1200px] space-y-20 md:space-y-28">
        {FEATURES.map((feature, i) => {
          const flipped = i % 2 === 1;
          return (
            <article
              key={feature.id}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <div className={flipped ? "lg:order-2" : ""}>
                <Eyebrow>{feature.eyebrow}</Eyebrow>
                <TextReveal
                  as="h3"
                  className="f-display mt-5 text-[clamp(1.8rem,3.6vw,2.6rem)]"
                >
                  {feature.headline}
                </TextReveal>
                <Reveal delay={0.15}>
                  <p className="mt-4 max-w-md text-[length:var(--text-body-lg)] leading-relaxed text-[var(--color-text-muted)]">
                    {feature.body}
                  </p>
                </Reveal>
              </div>
              <Reveal
                delay={0.1}
                className={`mx-auto w-full max-w-[26rem] ${flipped ? "lg:order-1" : ""}`}
              >
                <div
                  className={`rounded-[calc(var(--radius-lg)+10px)] p-4 sm:p-6 ${
                    flipped ? "bg-[var(--color-bg-alt)]" : "bg-[var(--color-surface-raised)]"
                  }`}
                >
                  <FeatureVisual id={feature.id} />
                </div>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
