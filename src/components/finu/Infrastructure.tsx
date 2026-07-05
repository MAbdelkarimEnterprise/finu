"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { Reveal, SplitTextReveal } from "./TextReveal";

const ROUTES = [
  "M95 225 C205 50 360 80 475 200",
  "M126 135 C270 285 455 300 685 128",
  "M300 96 C410 8 590 18 745 205",
  "M190 250 C330 150 545 155 690 255",
];

const NODES = [
  [95, 225],
  [126, 135],
  [190, 250],
  [300, 96],
  [475, 200],
  [685, 128],
  [690, 255],
  [745, 205],
];

export default function Infrastructure() {
  return (
    <section
      id="infrastructure"
      className="relative mx-auto max-w-[1400px] px-6 py-40 md:px-10 md:py-64"
    >
      <Reveal>
        <p className="f-eyebrow mb-8">05 / Global infrastructure</p>
      </Reveal>
      <div className="grid gap-12 lg:grid-cols-[1fr_0.34fr] lg:items-end">
        <SplitTextReveal className="f-display max-w-5xl text-[clamp(3.4rem,8.2vw,8.5rem)] leading-[0.88]">
          One network. Every market.
        </SplitTextReveal>
        <Reveal delay={0.2}>
          <div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--f-ink-dim)] md:text-base">
              Finu unifies blockchains, banking rails, and local payout networks
              behind one intelligent interface.
            </p>
            <Magnetic className="mt-7 inline-block">
              <a
                href="https://app.meetfinu.com"
                className="f-navlink inline-flex items-center gap-2 text-sm text-[var(--f-ink)]"
              >
                Explore the network
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-20" y={50}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.025] p-4 md:rounded-[3rem] md:p-8">
          <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,rgba(110,123,255,0.16),transparent_50%)]" />
          <div className="relative min-h-[28rem] overflow-hidden rounded-[1.4rem] border border-white/[0.06] bg-[#070710] md:min-h-[38rem] md:rounded-[2.2rem]">
            <div className="f-infra-grid absolute inset-0 opacity-50" />
            <svg
              viewBox="0 0 840 340"
              className="absolute left-1/2 top-1/2 w-[min(92%,70rem)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
              aria-hidden
            >
              <defs>
                <linearGradient id="infra-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6e7bff" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#a07bff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#c8ff3d" stopOpacity="0.6" />
                </linearGradient>
                <filter id="infra-glow">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {ROUTES.map((route, index) => (
                <g key={route}>
                  <path
                    d={route}
                    fill="none"
                    stroke="rgba(245,245,248,0.07)"
                    strokeWidth="1"
                  />
                  <motion.path
                    d={route}
                    fill="none"
                    stroke="url(#infra-gradient)"
                    strokeWidth="1.4"
                    strokeDasharray="6 12"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{
                      duration: 1.8,
                      delay: index * 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </g>
              ))}
              {NODES.map(([cx, cy], index) => (
                <g key={`${cx}-${cy}`} filter="url(#infra-glow)">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={index % 3 === 0 ? 5 : 3}
                    fill={index % 3 === 0 ? "#c8ff3d" : "#8f9aff"}
                    className="f-pulse"
                    style={{ animationDelay: `${index * 0.23}s` }}
                  />
                </g>
              ))}
            </svg>

            <div className="absolute left-6 top-6 md:left-10 md:top-10">
              <p className="font-mono text-[0.58rem] tracking-[0.2em] text-[var(--f-ink-faint)]">
                FINU GLOBAL NETWORK
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-[var(--f-lime)]">
                <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
                Operational
              </p>
            </div>

            <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30 backdrop-blur-xl md:inset-x-10 md:bottom-10 md:rounded-3xl">
              {[
                ["150+", "markets"],
                ["15+", "networks"],
                ["24/7", "settlement"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`p-4 text-center md:p-7 ${
                    index ? "border-l border-white/[0.08]" : ""
                  }`}
                >
                  <p className="f-display text-2xl md:text-4xl">{value}</p>
                  <p className="mt-1 text-[0.62rem] text-[var(--f-ink-faint)] md:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
