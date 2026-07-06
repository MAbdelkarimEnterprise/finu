"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Cursor-aware card surface: ≤ maxTilt degrees of rotation toward the
 * pointer, a light highlight that moves independently (via --px/--py),
 * and a border bloom near the cursor. Tilt is driven with refs and a
 * damped rAF loop — no React state per frame. Inert on touch devices
 * and under reduced motion; never intercepts clicks.
 */
export default function InteractiveSurface({
  as = "div",
  className = "",
  children,
  maxTilt = 1.8,
  lift = 4,
}: {
  as?: "div" | "article" | "figure";
  className?: string;
  children: ReactNode;
  maxTilt?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);
  const state = useRef({
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
    tl: 0,
    cl: 0,
    hovering: false,
  });
  const reduced = useReducedMotion();

  useEffect(() => {
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const loop = () => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;

    s.cx += (s.tx - s.cx) * 0.12;
    s.cy += (s.ty - s.cy) * 0.12;
    s.cl += (s.tl - s.cl) * 0.12;

    const settled =
      !s.hovering &&
      Math.abs(s.cx) < 0.002 &&
      Math.abs(s.cy) < 0.002 &&
      s.cl < 0.01;

    if (settled) {
      el.style.transform = "";
      el.style.transition = "";
      frame.current = 0;
      return;
    }

    el.style.transform =
      `translateY(${(-lift * s.cl).toFixed(2)}px) ` +
      `rotateX(${(-s.cy * maxTilt).toFixed(3)}deg) ` +
      `rotateY(${(s.cx * maxTilt).toFixed(3)}deg)`;
    frame.current = requestAnimationFrame(loop);
  };

  const start = () => {
    const el = ref.current;
    if (!el) return;
    /* The damping loop does its own easing; stop the stylesheet's
       transform transition from double-smoothing it. */
    el.style.transition =
      "border-color 0.55s var(--f-ease), box-shadow 0.55s var(--f-ease)";
    if (!frame.current) frame.current = requestAnimationFrame(loop);
  };

  const onPointerEnter = (event: React.PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    state.current.hovering = true;
    state.current.tl = 1;
    el.dataset.lit = "true";
    start();
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (event.clientY - rect.top) / Math.max(rect.height, 1);
    state.current.tx = Math.min(Math.max(nx * 2 - 1, -1), 1);
    state.current.ty = Math.min(Math.max(ny * 2 - 1, -1), 1);
    el.style.setProperty("--px", `${(nx * 100).toFixed(1)}%`);
    el.style.setProperty("--py", `${(ny * 100).toFixed(1)}%`);
    start();
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    state.current.hovering = false;
    state.current.tx = 0;
    state.current.ty = 0;
    state.current.tl = 0;
    el.dataset.lit = "false";
    start();
  };

  const Tag = as;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={`f-interactive ${className}`}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </Tag>
  );
}
