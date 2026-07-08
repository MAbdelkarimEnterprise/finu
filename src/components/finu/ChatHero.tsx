"use client";

import { useRef, useState } from "react";
import {
  motion,
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
 * Opening scene: the Finu chat phone in a garden-and-river field,
 * cropped at the fold. The conversation types in on load, then hands
 * the visitor the last word: choosing a chip plays Finu's comeback.
 * The phone tilts gently toward the pointer on desktop.
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

  const phoneY = useTransform(scrollYProgress, [0, 0.7], ["0vh", "-9vh"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const bubbleIn = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  /* Gentle 3D lean toward the pointer — refs only, no re-renders. */
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
      className="relative h-[200svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Garden-and-river scene — painted stand-in until a licensed
            photo/generated image lands in public/images/hero-scene.jpg;
            then .f-garden-scene just gains a background-image. */}
        <div className="f-garden-scene absolute inset-0" aria-hidden>
          <div className="f-garden-blob f-garden-blob-a" />
          <div className="f-garden-blob f-garden-blob-b" />
          <div className="f-garden-blob f-garden-blob-c" />
          <div className="f-garden-river" />
        </div>
        {/* Legibility veils: soft light at the top, fade to page below */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,249,255,0.92) 0%, rgba(247,249,255,0.55) 26%, rgba(247,249,255,0.05) 55%, rgba(247,249,255,0.65) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1360px] flex-col items-center px-5 pt-28 md:px-8 md:pt-32">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="f-eyebrow"
            data-pulse="true"
          >
            AI-powered financial intelligence
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.28 }}
            className="f-display mt-4 max-w-3xl text-center text-[clamp(2rem,4.6vw,3.2rem)]"
          >
            The world’s first AI financial assistant
          </motion.h2>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
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

          {/* Phone — anchored to the fold, cropped like the reference */}
          <div
            className="relative mt-10 flex w-full flex-1 items-end justify-center"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              style={reduced ? undefined : { y: phoneY }}
              initial={reduced ? false : { opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
              className="w-[min(21rem,86vw)] translate-y-[16%]"
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

          {/* Scroll cue */}
          <motion.div
            aria-hidden
            style={reduced ? undefined : { opacity: cueOpacity }}
            className="absolute bottom-6 left-6 hidden md:block"
          >
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--color-border)] p-1.5">
              <motion.div
                animate={
                  reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }
                }
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
