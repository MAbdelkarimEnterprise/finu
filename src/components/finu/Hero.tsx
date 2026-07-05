"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { RoutingConsole } from "./mockups";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic opening scene: a painted sky inside a full-bleed rounded
 * card, with the Finu console rising through it as you scroll. The
 * scene is pure DOM + CSS — no WebGL — so it renders instantly and
 * degrades to a static composition under reduced motion.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const consoleY = useTransform(scrollYProgress, [0, 0.85], ["16vh", "-6vh"]);
  const consoleScale = useTransform(scrollYProgress, [0, 0.85], [0.94, 1.02]);
  const skyShift = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section ref={ref} aria-label="Finu in action" className="relative h-[190svh]">
      <div className="sticky top-0 h-[100svh] pt-[var(--f-gutter)]">
        <div className="f-scene f-scene-sky f-scene-grain h-[calc(100%-var(--f-gutter))]">
          {/* Drifting clouds */}
          <motion.div
            aria-hidden
            style={reduced ? undefined : { y: skyShift }}
            className="absolute inset-0"
          >
            <div className="f-cloud left-[-10%] top-[8%] h-[22vh] w-[55vw] opacity-70" />
            <div
              className="f-cloud right-[-15%] top-[30%] h-[26vh] w-[60vw] opacity-50"
              style={{ animationDelay: "-9s", animationDuration: "34s" }}
            />
            <div
              className="f-cloud bottom-[10%] left-[15%] h-[24vh] w-[50vw] opacity-60"
              style={{ animationDelay: "-18s", animationDuration: "42s" }}
            />
            {/* Low sun */}
            <div
              className="absolute bottom-[-12%] left-1/2 h-[46vh] w-[46vh] -translate-x-1/2 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,236,200,0.9), rgba(255,214,170,0.35) 55%, transparent 72%)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>

          {/* Console rising through the sky */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.div
              style={
                reduced ? undefined : { y: consoleY, scale: consoleScale }
              }
              className="will-change-transform"
            >
              <RoutingConsole />
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            aria-hidden
            style={reduced ? undefined : { opacity: cueOpacity }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-11 w-7 items-start justify-center rounded-full border border-[rgba(33,29,25,0.25)] p-2">
              <motion.div
                animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-[3px] rounded-full bg-[rgba(33,29,25,0.45)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
