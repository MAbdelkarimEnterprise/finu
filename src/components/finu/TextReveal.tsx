"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Safety net for both reveal components below: the "hidden" starting
   position is baked into the very first paint (SSR included), so if
   IntersectionObserver never fires — a stale WebView viewport in some
   in-app browsers (Telegram, WhatsApp), a backgrounded/prerendered tab,
   or just a slow main thread — the content must not stay invisible
   forever. This timer forces the revealed state regardless. */
const REVEAL_FALLBACK_MS = 900;

function useGuaranteedInView(
  ref: React.RefObject<Element | null>,
  once: boolean
) {
  const observed = useInView(ref, { once, margin: "-10% 0px" });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (observed) return;
    const timer = setTimeout(() => setForced(true), REVEAL_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [observed]);

  return observed || forced;
}

/**
 * Word-by-word masked reveal. Each word rises out of an overflow-hidden
 * clip with a stagger — the signature editorial entrance.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  once = true,
}: {
  children: string;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useGuaranteedInView(ref, once);
  const reduced = useReducedMotion();
  const words = children.split(" ");

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "115%" }}
                animate={inView ? { y: 0 } : { y: "115%" }}
                transition={{
                  duration: 0.9,
                  ease: EASE,
                  delay: delay + i * 0.045,
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * Block-level entrance: fade + rise. For paragraphs, buttons, visuals —
 * anything that isn't a headline.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useGuaranteedInView(ref, once);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
