"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/* FINU mesh — white light folding into the royal family. */
const FINU_COLORS = [
  "#FFFFFF",
  "#D9ECFF",
  "#5AA8FF",
  "#4D7CFF",
  "#1E5EFF",
];

const FINU_FALLBACK =
  "radial-gradient(120% 120% at 75% 20%, #5AA8FF, #D9ECFF 45%, #FFFFFF)";

/**
 * The paper-shaders MeshGradient as a Finu background (brought over
 * from the TONED ShaderBackground pattern): mounts at idle so it
 * never competes with LCP, stays off on small screens, coarse
 * pointers, and reduced motion — the CSS gradient fallback carries
 * those — and paints pointer-transparent behind the content.
 */
export default function ShaderBackground({
  colors = FINU_COLORS,
  fallback = FINU_FALLBACK,
  speed = 0.6,
  distortion = 0.9,
  swirl = 0.2,
  className = "",
  style,
}: {
  colors?: string[];
  fallback?: string;
  speed?: number;
  distortion?: number;
  swirl?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;
    if (reduce || small || coarse) return;

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const mount = () => setEnabled(true);

    let idleId = 0;
    let timeoutId = 0;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(mount, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(mount, 600);
    }

    return () => {
      if (idleId && typeof w.cancelIdleCallback === "function")
        w.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: fallback,
        ...style,
      }}
      aria-hidden="true"
    >
      {enabled ? (
        <MeshGradient
          style={{ width: "100%", height: "100%" }}
          colors={colors}
          distortion={distortion}
          swirl={swirl}
          speed={speed}
        />
      ) : null}
    </div>
  );
}
