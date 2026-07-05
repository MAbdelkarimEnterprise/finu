"use client";

import { useRef } from "react";
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion";
import { Reveal } from "./TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

type Stat = {
  prefix?: string;
  value?: number;
  suffix?: string;
  decimals?: number;
  /** For non-numeric stats like "Seconds" or "24/7" */
  literal?: string;
  label: string;
  detail: string;
};

const STATS: Stat[] = [
  {
    prefix: "$",
    value: 230,
    suffix: "B+",
    label: "Stablecoin market",
    detail: "Circulating stablecoin supply — the fastest-growing asset class in payments.",
  },
  {
    value: 150,
    suffix: "+",
    label: "Countries supported",
    detail: "Spend, send, and settle almost anywhere on the planet.",
  },
  {
    prefix: "$",
    value: 190,
    suffix: "T+",
    label: "Global payments market",
    detail: "The annual value of money in motion that Finu is built to move.",
  },
  {
    value: 15,
    suffix: "+",
    label: "Blockchain networks",
    detail: "Routes chosen per-transaction across the chains that matter.",
  },
  {
    literal: "Seconds",
    label: "Settlement speed",
    detail: "Final settlement measured in seconds, not banking days.",
  },
  {
    literal: "24/7",
    label: "Availability",
    detail: "No weekends. No holidays. No cutoff windows. Ever.",
  },
  {
    value: 90,
    suffix: "%",
    prefix: "Up to ",
    label: "Transaction cost reduction",
    detail: "Versus legacy correspondent-banking rails on cross-border flows.",
  },
  {
    literal: "∞",
    label: "Programmable transactions",
    detail: "Every payment is code — conditional, composable, unlimited.",
  },
];

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: EASE, delay: (index % 2) * 0.12 }}
      className="group relative border-t border-[var(--f-line)] py-12 md:py-16"
    >
      {/* Hover glow sweep */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at 30% 20%, rgba(110,123,255,0.08), transparent 70%)",
        }}
      />
      <p className="f-eyebrow mb-6">{stat.label}</p>
      <div className="f-display text-[clamp(3.2rem,7vw,6rem)] leading-none tracking-tight">
        {stat.literal ? (
          <span className={stat.literal === "∞" ? "f-gradient-text" : ""}>
            {stat.literal}
          </span>
        ) : (
          <>
            {stat.prefix}
            {inView && (
              <CountUp
                end={stat.value!}
                decimals={stat.decimals ?? 0}
                duration={2.4}
                useEasing
              />
            )}
            <span className="text-[var(--f-ink-faint)]">{stat.suffix}</span>
          </>
        )}
      </div>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--f-ink-dim)]">
        {stat.detail}
      </p>
    </motion.div>
  );
}

export default function Numbers() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10">
      <Reveal className="mb-4">
        <p className="f-eyebrow">The market, measured</p>
      </Reveal>
      <div className="grid md:grid-cols-2 md:gap-x-20">
        {STATS.map((s, i) => (
          <StatCell key={s.label} stat={s} index={i} />
        ))}
      </div>
    </section>
  );
}
