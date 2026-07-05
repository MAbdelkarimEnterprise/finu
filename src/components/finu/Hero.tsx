"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
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
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(8px)"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
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
        style={{ y, opacity, filter: blur }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center"
      >
        <Reveal delay={0.35} y={16}>
          <p className="f-eyebrow mb-8">
            AI-native stablecoin infrastructure
          </p>
        </Reveal>

        <h1 className="f-display text-[clamp(3rem,9vw,7.5rem)]">
          <TextReveal as="span" delay={0.5} className="block">
            Where AI meets
          </TextReveal>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.72 }}
              className="f-serif f-gradient-text inline-block pr-[0.06em] will-change-transform"
            >
              stablecoins
            </motion.span>
          </span>
        </h1>

        <Reveal delay={1} y={24}>
          <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-[var(--f-ink-dim)]">
            Intelligent global payments powered by AI, programmable finance,
            and stablecoin infrastructure.
          </p>
        </Reveal>

        <Reveal delay={1.15} y={24}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="#" className="f-btn f-btn-primary group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#platform" className="f-btn f-btn-ghost">
                Explore Platform
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-[rgba(245,245,248,0.2)] p-2">
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
