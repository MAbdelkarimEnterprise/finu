"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { TextReveal, Reveal } from "./TextReveal";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The hero recedes as you scroll — content sinks, blurs, and dims
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(14px)"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[110svh] items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
        <HeroScene className="absolute inset-0 h-full w-full" />
        {/* Bottom fade into the page body */}
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--f-bg))",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y, opacity, filter: blur, scale }}
        className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-20 text-center md:px-10"
      >
        <Reveal delay={0.35} y={16}>
          <p className="f-eyebrow mx-auto mb-7 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-xl">
            <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
            The AI-native money network
          </p>
        </Reveal>

        <h1 className="f-display text-[clamp(4rem,11.2vw,10.8rem)] leading-[0.82]">
          <TextReveal as="span" delay={0.5} className="block">
            Money moves.
          </TextReveal>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.72 }}
              className="f-gradient-text inline-block pr-[0.06em] font-light tracking-[-0.075em] will-change-transform"
            >
              Finu thinks.
            </motion.span>
          </span>
        </h1>

        <Reveal delay={1} y={24}>
          <p className="mx-auto mt-9 max-w-lg text-balance text-base leading-relaxed text-[var(--f-ink-dim)] md:text-lg">
            One intelligent layer to route, settle, and optimize money globally.
          </p>
        </Reveal>

        <Reveal delay={1.15} y={24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a
                href="https://app.meetfinu.com"
                className="f-btn f-btn-primary group"
              >
                Enter Finu
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#thesis" className="f-btn f-btn-ghost group">
                Read the thesis
                <ArrowDownRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 1, ease: EASE }}
        style={{ opacity }}
        className="f-glass absolute right-[5vw] top-[27%] z-10 hidden rounded-2xl px-4 py-3 text-left xl:block"
      >
        <p className="font-mono text-[0.58rem] tracking-[0.18em] text-[var(--f-ink-faint)]">ROUTE / 0X82A</p>
        <p className="mt-1 text-sm text-[var(--f-ink)]">USDC → AED</p>
        <p className="mt-1 font-mono text-[0.65rem] text-[var(--f-lime)]">SETTLED · 0.8s</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.65, duration: 1, ease: EASE }}
        style={{ opacity }}
        className="f-glass absolute bottom-[22%] left-[5vw] z-10 hidden rounded-2xl px-4 py-3 text-left xl:block"
      >
        <p className="font-mono text-[0.58rem] tracking-[0.18em] text-[var(--f-ink-faint)]">AI ROUTING</p>
        <p className="mt-1 text-sm">Best rail selected</p>
        <p className="mt-1 font-mono text-[0.65rem] text-[var(--f-lime)]">–2.3% COST</p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-[rgba(245,245,248,0.2)] p-2 backdrop-blur-md">
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-[3px] rounded-full bg-[var(--f-ink-dim)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
