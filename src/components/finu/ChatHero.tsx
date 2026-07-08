"use client";

// → src/components/finu/ChatHero.tsx

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, AudioLines, Sparkles } from "lucide-react";
import { MidnightIntelligenceShader } from "@/components/MidnightIntelligenceShader";
import { APP_URL, LINKS } from "./links";
import MagneticButton from "./MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Illustrative conversation — reuses the approved Finu AI example
   from the dashboard mock; no new product claims. */
const CHAT = [
  { from: "user", text: "Be honest — how bad was this week?" },
  { from: "finu", text: "Delivery spending is up 38%. Want me to set a dining cap?" },
] as const;

/**
 * Scroll-driven opening scene: a full-viewport light field with the
 * Finu chat phone rising through it. The conversation reveals with
 * scroll progress; the copy block hands off to the statement band
 * below. Everything is real DOM — no video, no canvas text.
 */
export default function ChatHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 0.7], ["4vh", "-7vh"]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.7], [0.97, 1.02]);
  const bubble1 = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  const bubble2 = useTransform(scrollYProgress, [0.26, 0.4], [0, 1]);
  const chips = useTransform(scrollYProgress, [0.44, 0.55], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Finu — AI financial assistant"
      className="relative h-[240svh]"
    >
      <div className="hero sticky top-0 h-[100svh]">
        <MidnightIntelligenceShader />

        <div className="hero-content mx-auto flex h-full max-w-[1360px] flex-col items-center justify-center px-5 pt-24 md:px-8">
          {/* Eyebrow + headline above the phone, Cleo-scale but Finu voice */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="f-eyebrow"
            data-pulse="true"
          >
            AI-powered financial intelligence
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="f-display mt-4 max-w-3xl text-center text-[clamp(2.2rem,5vw,3.6rem)]"
          >
            The world’s first AI financial assistant
          </motion.h1>

          {/* Phone */}
          <motion.div
            style={reduced ? undefined : { y: phoneY, scale: phoneScale }}
            initial={reduced ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
            className="f-phone relative mt-8 w-[min(21rem,86vw)]"
          >
            <div className="f-phone-notch" aria-hidden />
            <div className="flex h-full flex-col px-4 pb-5 pt-12">
              <p className="text-center text-[1.35rem] font-medium text-[var(--app-ink)]">
                Hey, Maria
              </p>

              <div className="mt-5 flex-1 space-y-3">
                <motion.div
                  style={reduced ? undefined : { opacity: bubble1 }}
                  className="f-bubble f-bubble-user"
                >
                  {CHAT[0].text}
                </motion.div>
                <motion.div
                  style={reduced ? undefined : { opacity: bubble2 }}
                  className="f-bubble f-bubble-finu"
                >
                  <span className="f-mono mb-1 flex items-center gap-1 text-[0.5rem] text-[var(--color-secondary)]">
                    <Sparkles className="h-3 w-3" aria-hidden /> Finu AI
                  </span>
                  {CHAT[1].text}
                </motion.div>
                <motion.div
                  style={reduced ? undefined : { opacity: chips }}
                  className="flex gap-2 pl-2"
                >
                  <span className="f-chip f-chip-success">Set cap</span>
                  <span className="f-chip f-chip-warning">Remind me</span>
                </motion.div>
              </div>

              {/* Ask bar */}
              <div className="mt-4 flex items-center gap-2 rounded-full border px-4 py-3 text-[0.8rem] text-[var(--app-muted)]"
                style={{ borderColor: "var(--app-border)", background: "var(--app-surface)" }}>
                Ask Finu anything…
                <AudioLines className="ml-auto h-4 w-4 text-[var(--color-primary)]" aria-hidden />
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton href={APP_URL} className="f-btn f-btn-primary group">
              Try it out
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </MagneticButton>
            <a href={LINKS.ai} className="f-btn f-btn-ghost">
              Explore Finu AI
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            aria-hidden
            style={reduced ? undefined : { opacity: cueOpacity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--color-border)] p-1.5">
              <motion.div
                animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-[3px] rounded-full bg-[var(--color-primary)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
