"use client";

import { AlarmClock, CloudFog, Gavel, Repeat } from "lucide-react";
import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import Eyebrow from "@/components/finu/Eyebrow";
import { PROBLEM } from "@/lib/landing-content";

const ICONS = [AlarmClock, Repeat, CloudFog, Gavel] as const;

/**
 * The pain section — warm paper band so the page breathes between
 * the navy trust strip and the white product demo.
 */
export default function Problem() {
  return (
    <section
      id="why"
      aria-labelledby="problem-title"
      className="scroll-mt-24 bg-[var(--color-bg-alt)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <Eyebrow>{PROBLEM.eyebrow}</Eyebrow>
          <TextReveal
            as="h2"
            className="f-display mt-5 text-[length:var(--text-display)]"
          >
            {PROBLEM.headline}
          </TextReveal>
          <span id="problem-title" className="sr-only">
            {PROBLEM.headline}
          </span>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-md text-[length:var(--text-body-lg)] leading-relaxed text-[var(--color-text-muted)]">
              {PROBLEM.subhead}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PROBLEM.pains.map((pain, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={pain.title} delay={0.1 + i * 0.08}>
                <div className="f-card f-card-hover h-full rounded-[var(--radius-lg)] border-[rgba(7,21,47,0.07)] bg-white/85 p-6">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-coral-soft)]"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-[var(--color-coral)]" />
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-medium text-[var(--color-text)]">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--color-text-muted)]">
                    {pain.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
