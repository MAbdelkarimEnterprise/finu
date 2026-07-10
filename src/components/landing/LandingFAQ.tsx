"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import { FAQ_ITEMS } from "@/lib/landing-content";

/**
 * Accessible accordion — real buttons, aria-expanded/controls wiring,
 * grid-rows height animation from the existing .f-faq-* styles.
 */
export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <TextReveal as="h2" className="f-display text-[length:var(--text-display)]">
            Fair questions.
          </TextReveal>
          <span id="faq-title" className="sr-only">
            Frequently asked questions
          </span>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-[var(--color-text-muted)]">
              The things people actually ask before letting an app anywhere near their money.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="border-t border-[var(--f-border-soft)]">
            {FAQ_ITEMS.map((item, i) => {
              const expanded = open === i;
              return (
                <div key={item.q} className="f-faq-item">
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={`${baseId}-q-${i}`}
                      className="f-faq-trigger"
                      aria-expanded={expanded}
                      aria-controls={`${baseId}-a-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                    >
                      {item.q}
                      <span
                        className="f-faq-icon grid h-9 w-9 place-items-center rounded-full border border-[var(--f-border-soft)] text-[var(--color-text-muted)]"
                        aria-hidden
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${baseId}-a-${i}`}
                    role="region"
                    aria-labelledby={`${baseId}-q-${i}`}
                    className="f-faq-panel"
                    data-open={expanded}
                  >
                    <div>
                      <p className="pb-6 pr-12 text-[0.92rem] leading-relaxed text-[var(--color-text-muted)]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
