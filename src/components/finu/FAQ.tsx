"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, TextReveal } from "./TextReveal";

/* Answers published on meetfinu.com, paired with the questions they
   actually answer (the live page currently shuffles them). */
const QA = [
  {
    q: "How do I get started with Finu?",
    a: "Download the app, register an account, and follow the onboarding instructions to start using Finu.",
  },
  {
    q: "Is Finu safe?",
    a: "Yes, Finu uses advanced security measures to protect your funds and personal information.",
  },
  {
    q: "Can I use Finu for business transactions?",
    a: "Yes, our platform supports both personal and business transactions. Businesses can benefit from our secure and efficient transfer options tailored to their needs.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="f-scrim scroll-mt-24 f-section"
    >
      <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <TextReveal
          as="h2"
          className="f-display text-[clamp(2rem,4.4vw,3.2rem)] lg:sticky lg:top-32 lg:self-start"
        >
          Frequently Asked Questions
        </TextReveal>
        <span id="faq-title" className="sr-only">
          Frequently asked questions
        </span>

        <Reveal>
          <div className="border-t border-[var(--f-border-soft)]">
            {QA.map((item, i) => {
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
                        className="f-faq-icon grid h-9 w-9 place-items-center rounded-full border border-[var(--f-border-soft)] text-[var(--color-text-secondary)]"
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
                      <p className="pb-6 pr-12 text-[0.92rem] leading-relaxed text-[var(--color-text-secondary)]">
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
