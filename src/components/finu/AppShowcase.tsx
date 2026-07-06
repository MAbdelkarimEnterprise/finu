"use client";

import { ArrowUpRight } from "lucide-react";
import { APP_URL } from "./links";
import AppMock from "./AppMock";
import Eyebrow from "./Eyebrow";
import MagneticButton from "./MagneticButton";
import { Reveal, TextReveal } from "./TextReveal";

/**
 * The Finu interface, shown at full size in its own scene — moved out
 * of the hero so the shader opening stays clean and the product gets
 * a dedicated moment.
 */
export default function AppShowcase() {
  return (
    <section
      id="app"
      aria-labelledby="app-title"
      className="relative scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="f-glow-violet pointer-events-none absolute inset-x-0 bottom-0 h-72" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow>The Finu app</Eyebrow>
          </Reveal>
          <TextReveal
            as="h2"
            className="f-display mt-5 text-[clamp(2rem,4.4vw,3.2rem)]"
          >
            Pay, transfer, save — with intelligence built in.
          </TextReveal>
          <span id="app-title" className="sr-only">
            The Finu app
          </span>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
              Finu analyzes spending, calls out bad habits, and makes you
              better at money — with your balance, transfers, and insights in
              one place.
            </p>
            <div className="mt-8">
              <MagneticButton href={APP_URL} className="f-btn f-btn-primary group">
                Try it out
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* The mock's satellite cards overhang above and below. */}
        <Reveal delay={0.1} className="pb-16 pt-10">
          <AppMock />
        </Reveal>
      </div>
    </section>
  );
}
