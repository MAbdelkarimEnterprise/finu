"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./TextReveal";
import { IntentMock, RouteMock, SettleMock } from "./mockups";

const EASE = [0.16, 1, 0.3, 1] as const;

const TABS = [
  {
    label: "Understand",
    title: "Read the intent.",
    body: "Say what should happen — “pay these 42 suppliers by Friday.” Finu reads the goal, constraints, timing, and risk behind it.",
    Visual: IntentMock,
  },
  {
    label: "Route",
    title: "Choose the rail.",
    body: "Finu scores every available path — stablecoin or bank — on speed, cost, and risk, then locks the best one for each payment.",
    Visual: RouteMock,
  },
  {
    label: "Settle",
    title: "Complete the outcome.",
    body: "Value lands in seconds where rails allow, with the full transaction state visible from start to finish.",
    Visual: SettleMock,
  },
];

/**
 * The orchestration engine, explained in three switchable chapters —
 * a segmented pill control over a shared product card.
 */
export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tab = TABS[active];

  return (
    <section id="platform" className="scroll-mt-24 px-[var(--f-gutter)] py-[var(--f-gutter)]">
      <div className="f-scene f-scene-grain f-scene-sand !mx-0 flex min-h-[88svh] items-center py-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 md:px-10">
          <Reveal>
            <p className="f-eyebrow text-[var(--f-ink-dim)]">
              How Finu orchestrates money
            </p>
          </Reveal>

          {/* Segmented control */}
          <Reveal delay={0.1}>
            <div
              role="tablist"
              aria-label="Orchestration steps"
              className="mt-8 flex rounded-full border border-[rgba(33,29,25,0.12)] bg-white/50 p-1 backdrop-blur-md"
            >
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  role="tab"
                  id={`platform-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls="platform-panel"
                  onClick={() => setActive(i)}
                  className={`rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors duration-400 md:px-6 ${
                    active === i
                      ? "bg-[var(--f-ink)] text-[var(--f-cream)]"
                      : "text-[var(--f-ink-dim)] hover:text-[var(--f-ink)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Panel */}
          <div
            id="platform-panel"
            role="tabpanel"
            aria-labelledby={`platform-tab-${active}`}
            className="mt-12 grid w-full items-center gap-10 md:mt-16 md:grid-cols-2 md:gap-14"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.label + "-text"}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="md:justify-self-end md:text-right"
              >
                <p className="f-mono text-[0.62rem] text-[var(--f-ink-faint)]">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(TABS.length).padStart(2, "0")}
                </p>
                <h3 className="f-display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)]">
                  {tab.title}
                </h3>
                <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-[var(--f-ink-dim)] md:ml-auto">
                  {tab.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab.label + "-visual"}
                initial={reduced ? false : { opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 1.02, y: -12 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="flex justify-center md:justify-start"
              >
                <tab.Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
