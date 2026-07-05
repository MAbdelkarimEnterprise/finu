"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const inView = useInView(ref, { once, margin: "-12% 0px" });
  const words = children.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
          >
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
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * Block-level entrance: fade + rise + de-blur. For paragraphs, buttons,
 * visuals — anything that isn't a headline.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  blur = true,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
