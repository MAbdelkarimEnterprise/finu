"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Braces, Clock3, Route } from "lucide-react";
import { Reveal, SplitTextReveal } from "./TextReveal";

const BENEFITS = [
  {
    icon: Clock3,
    label: "Always on",
    copy: "No cutoffs, weekends, or banking windows.",
  },
  {
    icon: Route,
    label: "Internet-native",
    copy: "Value crosses borders on shared global rails.",
  },
  {
    icon: Braces,
    label: "Programmable",
    copy: "Every movement can carry rules, logic, and intent.",
  },
];

export default function WhyStablecoins() {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start end", "end start"],
  });
  const coinY = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const coinRotate = useTransform(scrollYProgress, [0, 1], [-12, 14]);

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-[1400px] overflow-hidden px-6 py-40 md:px-10 md:py-60"
    >
      <div className="grid items-start gap-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-28">
        <div className="lg:sticky lg:top-32">
          <Reveal>
            <p className="f-eyebrow mb-8">02 / The new rail</p>
          </Reveal>
          <SplitTextReveal className="f-display max-w-4xl text-[clamp(3.2rem,7.2vw,7.4rem)] leading-[0.91]">
            Why stablecoins change everything.
          </SplitTextReveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-lg text-base leading-relaxed text-[var(--f-ink-dim)] md:text-lg">
              Stablecoins give money the speed and composability of software.
              Finu gives that money intelligence.
            </p>
          </Reveal>
        </div>

        <div>
          <motion.div
            style={{ y: coinY, rotate: coinRotate }}
            className="f-coin-stage relative mx-auto mb-28 aspect-square w-[min(82vw,30rem)]"
            aria-hidden
          >
            <div className="f-coin-orbit absolute inset-[2%] rounded-full border border-white/10" />
            <div className="f-coin-orbit absolute inset-[13%] rounded-full border border-white/[0.07]" />
            <div className="absolute inset-[23%] grid place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.32),rgba(110,123,255,0.24)_34%,rgba(12,12,24,0.94)_72%)] shadow-[0_0_100px_rgba(110,123,255,0.28)]">
              <span className="f-display text-[clamp(4rem,10vw,7rem)] font-light tracking-[-0.08em]">
                $
              </span>
            </div>
            {["USDC", "USDT", "EURC"].map((token, index) => (
              <span
                key={token}
                className="f-glass absolute rounded-full px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-[var(--f-ink-dim)]"
                style={{
                  left: `${[2, 72, 7][index]}%`,
                  top: `${[55, 22, 15][index]}%`,
                }}
              >
                {token}
              </span>
            ))}
          </motion.div>

          <div className="space-y-4">
            {BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.label} delay={index * 0.08}>
                <div className="group grid grid-cols-[auto_1fr] gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:bg-white/[0.05] md:p-8">
                  <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[var(--f-lime)]">
                    <benefit.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="f-display text-xl">{benefit.label}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--f-ink-dim)]">
                      {benefit.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
