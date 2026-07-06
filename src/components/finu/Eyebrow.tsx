"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

/** Section eyebrow whose accent dot pulses once when it scrolls into view. */
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <p ref={ref} data-pulse={inView} className={`f-eyebrow ${className}`}>
      {children}
    </p>
  );
}
