"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TextReveal, Reveal } from "./TextReveal";

/**
 * Company page opener: a dawn scene card with the page's editorial
 * lead anchored to its lower-left.
 */
export default function CompanyHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="px-0 pt-[var(--f-gutter)]">
      <div className="f-scene f-scene-grain f-scene-dawn flex min-h-[82svh] items-end">
        <motion.div
          style={reduced ? undefined : { y, opacity }}
          className="relative z-10 w-full p-7 pb-14 md:p-14"
        >
          <Reveal delay={0.2} y={16}>
            <p className="f-eyebrow mb-7 text-[var(--f-ink-dim)]">Company</p>
          </Reveal>
          <h1 className="f-display text-[clamp(2.8rem,7vw,5.6rem)]">
            <TextReveal as="span" delay={0.35} className="block">
              Finu in numbers.
            </TextReveal>
          </h1>
          <Reveal delay={0.7}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--f-ink-dim)] md:text-lg">
              The shift to programmable money isn&apos;t a thesis anymore —
              it&apos;s an industry. Here is the scale of what we&apos;re
              building on.
            </p>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
