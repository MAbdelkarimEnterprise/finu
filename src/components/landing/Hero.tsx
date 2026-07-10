"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarClock, Wallet } from "lucide-react";
import { MidnightIntelligenceShader } from "@/components/MidnightIntelligenceShader";
import { APP_URL } from "@/components/finu/links";
import MagneticButton from "@/components/finu/MagneticButton";
import { TextReveal } from "@/components/finu/TextReveal";
import { HERO } from "@/lib/landing-content";
import { HomeScreen, PhoneFrame } from "./AppMockup";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero: shader field behind centered copy, with the app home screen
 * rising into the fold — cropped by the section edge so the trust
 * strip underneath always peeks into the first viewport. Floating
 * money cards orbit the phone on desktop.
 */
export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="hero hero-open" aria-label="Finu — your money companion">
      <MidnightIntelligenceShader />

      <div className="hero-content mx-auto flex max-w-[1360px] flex-col items-center px-5 pt-32 text-center md:px-8 lg:pt-36">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="f-eyebrow"
          data-pulse="true"
        >
          {HERO.eyebrow}
        </motion.p>

        <TextReveal
          as="h1"
          delay={0.25}
          className="f-display mt-6 max-w-5xl text-[length:var(--text-hero)]"
        >
          {HERO.headline}
        </TextReveal>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.65 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg"
        >
          {HERO.subhead}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href={APP_URL} className="f-btn f-btn-primary group">
            {HERO.primaryCta}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </MagneticButton>
          <a href="#product" className="f-btn f-btn-ghost">
            {HERO.secondaryCta}
          </a>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1 }}
          className="f-mono mt-7 text-[0.62rem] text-[var(--color-text-muted)]"
        >
          {HERO.trustCue}
        </motion.p>

        {/* Phone + floating cards. The phone is clipped by the section
            bottom, pulling the eye into the trust strip below. */}
        <div className="relative mt-12 w-full max-w-[22rem] md:mt-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
          >
            <PhoneFrame className="mx-auto -mb-40 md:-mb-32">
              <HomeScreen />
            </PhoneFrame>
          </motion.div>

          {/* Floating: upcoming bill */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -26, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.05 }}
            className="absolute -left-52 top-14 hidden w-56 rounded-2xl border border-[var(--color-border)] bg-white p-3.5 text-left shadow-[var(--shadow-raised)] lg:block"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[var(--color-butter-soft)]" aria-hidden>
                <CalendarClock className="h-4 w-4 text-[var(--color-warning)]" />
              </span>
              <div>
                <p className="text-[0.72rem] font-semibold text-[var(--color-text)]">
                  Electric bill Thursday
                </p>
                <p className="text-[0.62rem] text-[var(--color-text-muted)]">
                  $54 · already counted in your forecast
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating: subscription catch */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 26, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.2 }}
            className="absolute -right-56 top-40 hidden w-60 rounded-2xl border border-[var(--color-border)] bg-white p-3.5 text-left shadow-[var(--shadow-raised)] lg:block"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[var(--color-coral-soft)]" aria-hidden>
                <Wallet className="h-4 w-4 text-[var(--color-coral)]" />
              </span>
              <div>
                <p className="text-[0.72rem] font-semibold text-[var(--color-text)]">
                  StreamMax renews in 3 days
                </p>
                <p className="text-[0.62rem] text-[var(--color-text-muted)]">
                  Last watched: 74 days ago. Cancel?
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
