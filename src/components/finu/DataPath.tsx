"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * A thin vertical data path between sections. The line is always
 * visible; a small light packet runs along it while the path is in
 * view (pure CSS animation, `pathLength`-normalized so the CSS dash
 * math is geometry-independent).
 */
export default function DataPath({
  height = 120,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });

  return (
    <svg
      ref={ref}
      aria-hidden
      className={`f-datapath ${className}`}
      data-live={inView}
      width="60"
      height={height}
      viewBox={`0 0 60 ${height}`}
      fill="none"
    >
      <defs>
        <linearGradient id="f-datapath-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aa8ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#5aa8ff" />
          <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="f-datapath-line"
        d={`M30 0 C 40 ${height * 0.3}, 20 ${height * 0.7}, 30 ${height}`}
      />
      <path
        className="f-datapath-pulse"
        pathLength={220}
        d={`M30 0 C 40 ${height * 0.3}, 20 ${height * 0.7}, 30 ${height}`}
      />
    </svg>
  );
}
