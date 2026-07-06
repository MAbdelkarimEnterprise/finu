"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const MAX_PULL = 7;

/**
 * Magnetic wrapper for primary CTAs: the button leans a few pixels
 * toward the cursor and settles back on leave. Disabled for touch
 * and reduced motion — it wraps a plain anchor either way.
 */
export default function MagneticButton({
  href,
  className = "",
  children,
  target,
  rel,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    x.set(dx * MAX_PULL);
    y.set(dy * MAX_PULL);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={reduced ? undefined : { x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </motion.a>
  );
}
