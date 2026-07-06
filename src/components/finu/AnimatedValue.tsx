"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
});

/**
 * Counts from 0 to `value` once the element scrolls into view.
 *
 * - Renders the final value before hydration and under reduced motion,
 *   so the number is never missing or stuck at zero.
 * - Exposes the final value to assistive tech via aria-label; the
 *   animating digits are aria-hidden.
 * - `format="compact"` counts through natural compact steps
 *   (412K → 1M) instead of the awkward "0M+" style.
 */
export default function AnimatedValue({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  format = "plain",
  className,
  onComplete,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: "plain" | "compact";
  className?: string;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (reduced) {
      setDisplay(value);
      onCompleteRef.current?.();
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / (duration * 1000), 1);
      setDisplay(value * EASE_OUT(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current?.();
      }
    };
    setDisplay(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration]);

  const formatValue = (v: number) =>
    format === "compact"
      ? COMPACT.format(Math.round(v))
      : v.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${formatValue(value)}${suffix}`}
    >
      <span aria-hidden>
        {prefix}
        {formatValue(display)}
        {suffix}
      </span>
    </span>
  );
}
