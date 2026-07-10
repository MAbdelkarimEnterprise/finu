"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import Eyebrow from "@/components/finu/Eyebrow";
import { PRODUCT_CHAT } from "@/lib/landing-content";
import { PhoneFrame } from "./AppMockup";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Message cadence: each entry appears after its delay; Finu replies
   are preceded by a typing indicator. */
const STEP_MS = 1450;

/**
 * The product moment: a Finu chat that plays itself when scrolled
 * into view. Reduced motion (or no JS timing) shows the finished
 * conversation immediately.
 */
export default function ProductChat() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const observed = useInView(hostRef, { once: true, margin: "-20% 0px" });
  /* Same safety net as TextReveal: if IntersectionObserver never
     fires (stale in-app WebViews), the conversation must still play. */
  const [forced, setForced] = useState(false);
  useEffect(() => {
    if (observed) return;
    const timer = setTimeout(() => setForced(true), 1600);
    return () => clearTimeout(timer);
  }, [observed]);
  const inView = observed || forced;
  const [step, setStep] = useState(0);
  const total = PRODUCT_CHAT.conversation.length;
  const done = reduced ? total : step;

  useEffect(() => {
    if (!inView || reduced || step >= total) return;
    const timer = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : STEP_MS);
    return () => clearTimeout(timer);
  }, [inView, reduced, step, total]);

  const typing = !reduced && inView && step < total &&
    PRODUCT_CHAT.conversation[step].from === "finu" && step > 0;

  return (
    <section
      id="product"
      aria-labelledby="product-title"
      className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>{PRODUCT_CHAT.eyebrow}</Eyebrow>
          <TextReveal
            as="h2"
            className="f-display mt-5 text-[length:var(--text-display)]"
          >
            {PRODUCT_CHAT.headline}
          </TextReveal>
          <span id="product-title" className="sr-only">
            {PRODUCT_CHAT.headline}
          </span>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-md text-[length:var(--text-body-lg)] leading-relaxed text-[var(--color-text-muted)]">
              {PRODUCT_CHAT.subhead}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Things you can ask Finu">
              {PRODUCT_CHAT.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[0.82rem] font-medium text-[var(--color-text-muted)]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div ref={hostRef} className="mx-auto w-full max-w-[22.5rem]">
          <PhoneFrame>
            <div className="flex min-h-[480px] flex-col px-4 pb-5 pt-6">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-accent)]" aria-hidden>
                  <Sparkles className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-[0.82rem] font-semibold text-[var(--color-text)]">Finu</p>
                  <p className="text-[0.6rem] text-[var(--color-positive)]">
                    knows your numbers
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-1 flex-col gap-3" aria-live="polite">
                {PRODUCT_CHAT.conversation.slice(0, done).map((message, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={
                      message.from === "you"
                        ? "self-end rounded-2xl rounded-br-md bg-[var(--color-accent)] px-4 py-2.5 text-[0.85rem] leading-relaxed text-white"
                        : "self-start rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-[0.85rem] leading-relaxed text-[var(--color-text)] shadow-[var(--shadow-card)]"
                    }
                    style={{ maxWidth: "85%" }}
                  >
                    {message.text}
                  </motion.div>
                ))}

                <AnimatePresence>
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-1.5 self-start rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-white px-4 py-3"
                      aria-hidden
                    >
                      <span className="f-typing-dot" />
                      <span className="f-typing-dot [animation-delay:0.15s]" />
                      <span className="f-typing-dot [animation-delay:0.3s]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Insight card lands with the first Finu answer */}
                {done >= 2 && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                    className="self-start rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3.5"
                    style={{ maxWidth: "85%" }}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[var(--color-positive)]" aria-hidden />
                      <p className="f-mono text-[0.54rem] text-[var(--color-text-muted)]">
                        Safe to spend
                      </p>
                    </div>
                    <p className="mt-1 text-[1.35rem] font-semibold leading-none text-[var(--color-text)]">
                      $86
                    </p>
                    <p className="mt-1 text-[0.62rem] text-[var(--color-text-muted)]">
                      until payday Friday · electric bill $54 already counted
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Composer (decorative) */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5" aria-hidden>
                <span className="text-[0.8rem] text-[var(--color-text-muted)]">
                  Ask about your money…
                </span>
              </div>
            </div>
          </PhoneFrame>
          <p className="f-mono mt-4 text-center text-[0.55rem] text-[var(--color-text-muted)]">
            Illustrative conversation
          </p>
        </div>
      </div>
    </section>
  );
}
