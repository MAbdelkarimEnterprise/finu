"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MidnightIntelligenceShader } from "@/components/MidnightIntelligenceShader";
import { APP_URL, LINKS } from "./links";
import MagneticButton from "./MagneticButton";
import { TextReveal } from "./TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="hero" aria-label="Finu — AI financial assistant">
      <MidnightIntelligenceShader />

      <div className="hero-content mx-auto flex min-h-[inherit] max-w-[1360px] flex-col items-center justify-center px-5 pb-28 pt-32 text-center md:px-8 lg:pt-36">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="f-eyebrow"
          data-pulse="true"
        >
          AI-powered financial intelligence
        </motion.p>

        <TextReveal
          as="h1"
          delay={0.3}
          className="f-display mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,4.8rem)]"
        >
          The world’s first AI financial assistant
        </TextReveal>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.75 }}
          className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg"
        >
          Finu analyzes your spending, calls out bad habits, and helps you
          get better at money.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href={APP_URL} className="f-btn f-btn-primary group">
            Try it out
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </MagneticButton>
          <a href={LINKS.ai} className="f-btn f-btn-ghost">
            Explore Finu AI
          </a>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.15 }}
          className="mt-8 text-[0.8rem] text-[var(--f-text-faint)]"
        >
          Pay, transfer, save, and manage stablecoins with intelligence
          built in.
        </motion.p>
      </div>
    </section>
  );
}
