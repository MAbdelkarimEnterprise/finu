"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, AudioLines, Sparkles } from "lucide-react";
import { APP_URL, LINKS } from "./links";
import MagneticButton from "./MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Illustrative conversation — original Finu voice: the assistant
   calls out a habit with a wink, the user jokes back, Finu lands a
   comeback and a concrete action. No new product claims. */
const CHAT = [
  {
    from: "finu",
    text: "I count 7 food deliveries this week. Your kitchen misses you 🍳",
  },
  { from: "user", text: "Me and the stove are on a break 💔" },
  {
    from: "finu",
    text: "Fair. But your savings shouldn’t be — want me to tuck away $20 before the weekend gets ideas? 🛟",
  },
] as const;

/* Canned punchlines for each choice — the visitor gets to steer the
   joke, which is the interaction, not a real transaction. */
const REPLIES: Record<"save" | "spend", string> = {
  save: "Done. $20 tucked away before it could become tacos 🌮✨",
  spend: "Respect. I’ll just quietly judge from over here 👀",
};

function FinuBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="f-bubble f-bubble-finu">
      <span className="f-mono mb-1 flex items-center gap-1 text-[0.5rem] text-[var(--color-secondary)]">
        <Sparkles className="h-3 w-3" aria-hidden /> Finu AI
      </span>
      {children}
    </div>
  );
}

/**
 * The phone module, structured like the reference architecture:
 * one tall section, a sticky 100dvh grid container whose layers all
 * share grid-area 1/1 — the scene canvas, the phone, the headline,
 * and an intro layer that carries the tagline and blurs away as the
 * visitor scrolls, while the phone rises from a flat 3D tilt to
 * upright. All content is real DOM.
 */
export default function ChatHero() {
  const ref = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<"save" | "spend" | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Intro layer: readable, then blurs and lifts away. */
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const introBlurPx = useTransform(scrollYProgress, [0, 0.22], [0, 14]);
  const introFilter = useMotionTemplate`blur(${introBlurPx}px)`;
  const introY = useTransform(scrollYProgress, [0, 0.22], ["0%", "-14%"]);

  /* Phone: lies back in 3D under the intro, straightens as it rises. */
  const phoneRotateX = useTransform(scrollYProgress, [0.05, 0.45], [52, 0]);
  const phoneScale = useTransform(scrollYProgress, [0.05, 0.45], [1.12, 1]);
  const phoneYvh = useTransform(scrollYProgress, [0.05, 0.55], [26, 0]);
  const phoneY = useMotionTemplate`${phoneYvh}vh`;

  /* Headline + CTAs: arrive once the intro has cleared. */
  const headOpacity = useTransform(scrollYProgress, [0.28, 0.45], [0, 1]);
  const headY = useTransform(scrollYProgress, [0.28, 0.45], [24, 0]);

  const bubbleIn = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  /* Gentle lean toward the pointer — refs only, no re-renders. */
  const onPhoneMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const el = phoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${(-ny * 5).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg)`;
  };
  const onPhoneLeave = () => {
    const el = phoneRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <section
      ref={ref}
      aria-label="Finu — AI financial assistant"
      className="relative h-[280svh]"
    >
      {/* stickyContainer: 100dvh grid, every layer stacked in 1/1 */}
      <div className="sticky top-0 grid h-[100dvh] w-full overflow-hidden [&>*]:[grid-area:1/1]">
        {/* Layer 1 — scene canvas */}
        <div className="relative" aria-hidden>
          <div className="f-garden-scene absolute inset-0">
            <div className="f-garden-blob f-garden-blob-a" />
            <div className="f-garden-blob f-garden-blob-b" />
            <div className="f-garden-blob f-garden-blob-c" />
            <div className="f-garden-river" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,249,255,0.92) 0%, rgba(247,249,255,0.55) 26%, rgba(247,249,255,0.05) 55%, rgba(247,249,255,0.65) 100%)",
            }}
          />
        </div>

        {/* Layer 2 — the phone, straightening out of a flat 3D tilt */}
        <div
          className="relative z-10 flex items-end justify-center"
          style={{ perspective: "1400px" }}
        >
          <motion.div
            style={
              reduced
                ? undefined
                : {
                    y: phoneY,
                    rotateX: phoneRotateX,
                    scale: phoneScale,
                    transformStyle: "preserve-3d",
                  }
            }
            className="w-[min(21rem,86vw)] translate-y-[12%]"
          >
            <div
              ref={phoneRef}
              className="f-phone relative transition-transform duration-300 ease-out"
              onPointerMove={onPhoneMove}
              onPointerLeave={onPhoneLeave}
            >
              <div className="f-phone-notch" aria-hidden />
              <div className="flex h-full flex-col px-4 pb-6 pt-12">
                <p className="text-center text-[1.3rem] font-medium text-[var(--app-ink)]">
                  Hey, Maria
                </p>

                <div className="mt-5 flex-1 space-y-3" aria-live="polite">
                  <motion.div {...bubbleIn(0.9)}>
                    <FinuBubble>{CHAT[0].text}</FinuBubble>
                  </motion.div>
                  <motion.div {...bubbleIn(1.8)} className="f-bubble f-bubble-user">
                    {CHAT[1].text}
                  </motion.div>
                  <motion.div {...bubbleIn(2.7)}>
                    <FinuBubble>{CHAT[2].text}</FinuBubble>
                  </motion.div>

                  {choice === null ? (
                    <motion.div {...bubbleIn(3.5)} className="flex gap-2 pl-2">
                      <button
                        type="button"
                        onClick={() => setChoice("save")}
                        className="f-chip f-chip-success cursor-pointer transition-transform hover:scale-105"
                      >
                        Tuck it away
                      </button>
                      <button
                        type="button"
                        onClick={() => setChoice("spend")}
                        className="f-chip f-chip-warning cursor-pointer transition-transform hover:scale-105"
                      >
                        Let me spend 🙃
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={choice}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <FinuBubble>{REPLIES[choice]}</FinuBubble>
                    </motion.div>
                  )}
                </div>

                <div
                  className="mt-4 flex items-center gap-2 rounded-full border px-4 py-3 text-[0.8rem] text-[var(--app-muted)]"
                  style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-surface)",
                  }}
                >
                  Ask Finu anything…
                  <AudioLines
                    className="ml-auto h-4 w-4 text-[var(--color-primary)]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Layer 3 — headline + CTAs, arriving as the phone straightens */}
        <motion.div
          style={reduced ? undefined : { opacity: headOpacity, y: headY }}
          className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1360px] flex-col items-center px-5 pt-[var(--hero-padding-top)] md:px-8"
        >
          <p className="f-eyebrow" data-pulse="true">
            AI-powered financial intelligence
          </p>
          <h2 className="f-display mt-4 max-w-3xl text-center text-[clamp(2rem,4.6vw,3.2rem)]">
            The world’s first AI financial assistant
          </h2>
          <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-4">
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
          </div>
        </motion.div>

        {/* Layer 4 — introLayer: the tagline over everything, blurring away */}
        <motion.div
          style={
            reduced
              ? undefined
              : { opacity: introOpacity, filter: introFilter, y: introY }
          }
          className={`pointer-events-none relative z-30 flex flex-col items-center justify-center px-5 ${
            reduced ? "hidden" : ""
          }`}
        >
          <h1 className="f-display max-w-5xl text-center text-[clamp(2.6rem,7vw,5.5rem)] leading-[var(--text-4xl--line-height)]">
            Money talks. Finu talks back.
          </h1>
          <motion.div
            aria-hidden
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
            className="absolute bottom-[12vh] flex items-center gap-2.5 text-[0.95rem] text-[var(--color-text-secondary)]"
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
        </motion.div>

        {/* Reduced motion: the tagline as a plain heading, no overlay */}
        {reduced && (
          <div className="relative z-30 flex items-start justify-center pt-[var(--hero-padding-top)]">
            <h1 className="sr-only">Money talks. Finu talks back.</h1>
          </div>
        )}
      </div>
    </section>
  );
}
