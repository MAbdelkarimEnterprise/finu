"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TextReveal, Reveal } from "./TextReveal";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function CompanyHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[85svh] items-end overflow-hidden pb-24"
    >
      <div className="absolute inset-0 opacity-70">
        <HeroScene variant="ambient" className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--f-bg))",
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10"
      >
        <Reveal delay={0.3} y={16}>
          <p className="f-eyebrow mb-8">Company</p>
        </Reveal>
        <h1 className="f-display text-[clamp(3rem,9vw,8rem)]">
          <TextReveal as="span" delay={0.45} className="block">
            Finu in
          </TextReveal>
          <span className="block overflow-hidden pb-[0.1em]">
            {/* Gradient must live on the transformed span itself —
                background-clip:text breaks with transformed descendants */}
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="f-serif f-gradient-text inline-block pr-[0.06em] will-change-transform"
            >
              numbers
            </motion.span>
          </span>
        </h1>
        <Reveal delay={0.9}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--f-ink-dim)]">
            The shift to programmable money isn&apos;t a thesis anymore —
            it&apos;s an industry. Here is the scale of what we&apos;re
            building on.
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
}
