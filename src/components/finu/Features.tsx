"use client";

import { useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Globe2, Zap, Sparkles } from "lucide-react";
import { TextReveal, Reveal } from "./TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Visual 1 · Spend globally: tilting glass card + orbiting currencies ── */
function CardVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });
  const sheenX = useTransform(sry, [-14, 14], ["20%", "80%"]);

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 28);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 22);
  };

  const currencies = ["USDC", "USDT", "EURC", "PYUSD"];

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Orbiting currency chips */}
      {currencies.map((c, i) => (
        <motion.span
          key={c}
          className="f-glass absolute rounded-full px-4 py-1.5 font-mono text-xs text-[var(--f-ink-dim)]"
          animate={{
            x: [0, 14, 0, -14, 0],
            y: [0, -10, 0, 10, 0],
          }}
          transition={{
            duration: 7 + i * 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.9,
          }}
          style={{
            top: `${[12, 22, 72, 80][i]}%`,
            left: `${[8, 78, 84, 6][i]}%`,
          }}
        >
          {c}
        </motion.span>
      ))}

      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.586] w-[78%] max-w-[420px] rounded-3xl border border-[rgba(245,245,248,0.14)] p-7"
      >
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(110,123,255,0.28), rgba(160,123,255,0.16) 45%, rgba(79,240,200,0.14))",
            backdropFilter: "blur(20px)",
          }}
        />
        {/* Moving sheen tracks the tilt */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: useTransform(
              sheenX,
              (v) =>
                `radial-gradient(340px circle at ${v} 30%, rgba(255,255,255,0.14), transparent 65%)`
            ),
          }}
        />
        <div className="relative flex h-full flex-col justify-between" style={{ transform: "translateZ(40px)" }}>
          <div className="flex items-start justify-between">
            <span className="f-display text-xl">
              finu<span className="text-[var(--f-mint)]">.</span>
            </span>
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--f-ink-faint)]">
              STABLECOIN
            </span>
          </div>
          <div>
            {/* Chip */}
            <div className="mb-5 h-8 w-11 rounded-md border border-[rgba(245,245,248,0.25)] bg-gradient-to-br from-[rgba(245,245,248,0.2)] to-transparent" />
            <div className="flex items-end justify-between">
              <span className="font-mono text-sm tracking-[0.25em] text-[var(--f-ink-dim)]">
                •••• 4021
              </span>
              <span className="font-mono text-xs text-[var(--f-ink-faint)]">
                150+ countries
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Visual 2 · Move money instantly: transfer flow diagram ── */
function FlowVisual() {
  const routes = [
    { d: "M 40 90 C 140 20, 260 20, 360 80", delay: 0 },
    { d: "M 40 150 C 150 150, 250 200, 360 160", delay: 1.2 },
    { d: "M 60 220 C 160 280, 260 250, 350 230", delay: 2.4 },
  ];
  const endpoints = [
    { cx: 40, cy: 90, label: "NYC" },
    { cx: 360, cy: 80, label: "SGP" },
    { cx: 40, cy: 150, label: "LON" },
    { cx: 360, cy: 160, label: "LAG" },
    { cx: 60, cy: 220, label: "SÃO" },
    { cx: 350, cy: 230, label: "DXB" },
  ];
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="f-glass relative w-[86%] max-w-[460px] rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--f-ink-faint)]">
            LIVE SETTLEMENT
          </span>
          <span className="flex items-center gap-2 font-mono text-xs text-[var(--f-mint)]">
            <span className="f-pulse inline-block h-1.5 w-1.5 rounded-full bg-[var(--f-mint)]" />
            0.8s avg
          </span>
        </div>
        <svg viewBox="0 0 400 280" className="w-full">
          {routes.map((r, i) => (
            <g key={i}>
              <path
                d={r.d}
                fill="none"
                stroke="rgba(245,245,248,0.08)"
                strokeWidth="1.5"
              />
              <path
                d={r.d}
                fill="none"
                stroke="url(#flow-grad)"
                strokeWidth="1.5"
                className="f-dash"
                style={{ animationDelay: `${r.delay}s` }}
              />
            </g>
          ))}
          <defs>
            <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6e7bff" />
              <stop offset="100%" stopColor="#4ff0c8" />
            </linearGradient>
          </defs>
          {endpoints.map((p) => (
            <g key={p.label}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r="4"
                fill="#8d9aff"
                className="f-pulse"
                style={{ animationDelay: `${(p.cx + p.cy) % 5}s` }}
              />
              <text
                x={p.cx}
                y={p.cy - 12}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fill="rgba(245,245,248,0.45)"
                letterSpacing="2"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--f-line)] pt-4">
          {[
            ["$1.2M", "settled today"],
            ["15+", "networks"],
            ["24/7", "always on"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="f-display text-lg">{v}</div>
              <div className="text-[0.7rem] text-[var(--f-ink-faint)]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Visual 3 · Financial intelligence: AI insight panel ── */
function IntelligenceVisual() {
  const insights = [
    {
      text: "FX exposure detected — routing via USDC saves 2.3% on this batch.",
      tag: "Auto-routing",
    },
    {
      text: "Treasury idle balance: $842K. Moved to 4.9% APY vault.",
      tag: "Yield engine",
    },
    {
      text: "Anomalous outflow flagged and held for review in 120ms.",
      tag: "AI guardrails",
    },
  ];
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="w-[86%] max-w-[440px] space-y-4">
        {insights.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, margin: "-15% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.18 }}
            className="f-glass rounded-2xl p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--f-violet)]" />
              <span className="font-mono text-[0.65rem] tracking-[0.15em] text-[var(--f-ink-faint)] uppercase">
                {ins.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--f-ink-dim)]">
              {ins.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Section copy ── */
const FEATURES = [
  {
    icon: Globe2,
    kicker: "01 — Spend",
    title: "Spend globally.",
    body: "One card, every currency. Finu settles in stablecoins under the hood while you pay like a local in 150+ countries — no FX spreads, no weekend cutoffs, no borders.",
    Visual: CardVisual,
  },
  {
    icon: Zap,
    kicker: "02 — Move",
    title: "Move money instantly.",
    body: "Transfers that used to take three days settle in seconds, around the clock. Finu routes value across 15+ blockchain networks and picks the fastest, cheapest rail every time.",
    Visual: FlowVisual,
  },
  {
    icon: Sparkles,
    kicker: "03 — Think",
    title: "Financial intelligence built in.",
    body: "An AI layer watches every flow — optimizing routes, deploying idle treasury, and catching anomalies before they cost you. Your money finally thinks for itself.",
    Visual: IntelligenceVisual,
  },
];

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="relative mx-auto max-w-[1400px] px-6 md:px-10">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Text column — each block owns a full viewport of scroll */}
        <div>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.55 }}
              className="flex min-h-[90vh] flex-col justify-center py-16 lg:min-h-screen"
            >
              <Reveal y={20}>
                <p className="f-eyebrow mb-6 flex items-center gap-3">
                  <f.icon className="h-4 w-4 text-[var(--f-blue)]" />
                  {f.kicker}
                </p>
              </Reveal>
              <TextReveal
                as="h2"
                className="f-display text-[clamp(2.4rem,5vw,4.2rem)]"
              >
                {f.title}
              </TextReveal>
              <Reveal delay={0.2}>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-[var(--f-ink-dim)]">
                  {f.body}
                </p>
              </Reveal>

              {/* Inline visual on small screens */}
              <div className="mt-12 h-[380px] lg:hidden">
                <f.Visual />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky visual stage — crossfades with the active chapter */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative h-[560px] w-full">
              {/* Ambient glow behind the stage */}
              <div
                className="absolute inset-0 -z-10 rounded-full opacity-40 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(110,123,255,0.35), transparent)",
                }}
              />
              <AnimatePresence mode="wait">
                {FEATURES.map(
                  (f, i) =>
                    active === i && (
                      <motion.div
                        key={f.title}
                        initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <f.Visual />
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
