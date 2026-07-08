"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MidnightIntelligenceShader } from "@/components/MidnightIntelligenceShader";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening breath: a full-viewport shader field with nothing but
 * the tagline and a scroll cue. Fades and lifts away as the visitor
 * scrolls into the hero proper.
 */
export default function IntroStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-30%"]);

  return (
    <section
      ref={ref}
      aria-label="Money talks. Finu talks back."
      className="relative h-[170svh]"
    >
      <div className="hero sticky top-0 h-[100svh]">
        <MidnightIntelligenceShader />

        <div className="hero-content flex h-full flex-col items-center justify-center px-5">
          <motion.h1
            style={reduced ? undefined : { opacity: textOpacity, y: textY }}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="f-display max-w-5xl text-center text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            Money talks. Finu talks back.
          </motion.h1>

          {/* Scroll cue */}
          <motion.div
            aria-hidden
            style={reduced ? undefined : { opacity: textOpacity }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
            className="absolute bottom-[14vh] flex items-center gap-2.5 text-[0.95rem] text-[var(--color-text-secondary)]"
          >
            Scroll
            <motion.span
              animate={reduced ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="grid grid-cols-3 gap-[3px]"
            >
              {[0.3, 0.6, 0.3, 0.6, 1, 0.6, 0.3, 0.6, 0.3].map((o, i) => (
                <span
                  key={i}
                  className="h-[3px] w-[3px] rounded-full bg-[var(--color-primary)]"
                  style={{ opacity: o }}
                />
              ))}
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
