"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Car,
  Coffee,
  Dumbbell,
  Home,
  MonitorPlay,
  Music4,
  PiggyBank,
  ShoppingCart,
  Sparkles,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import type { FeatureId } from "@/lib/landing-content";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Shared hook: reveal-once trigger for chart draws. */
function useDrawn() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  return { ref, drawn: inView || !!reduced, reduced };
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      {children}
    </div>
  );
}

/* ── 1 · Spending insights: plain-English category bars ────── */
const CATEGORIES = [
  { icon: UtensilsCrossed, label: "Eating out", value: "$148", share: 0.74, tone: "var(--color-coral)" },
  { icon: ShoppingCart, label: "Groceries", value: "$96", share: 0.48, tone: "var(--color-accent)" },
  { icon: Car, label: "Getting around", value: "$61", share: 0.31, tone: "var(--color-positive)" },
  { icon: Coffee, label: "Little treats", value: "$34", share: 0.17, tone: "var(--color-warning)" },
] as const;

function InsightsVisual() {
  const { ref, drawn } = useDrawn();
  return (
    <div ref={ref}>
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[0.9rem] font-semibold text-[var(--color-text)]">This week</p>
          <p className="text-[0.72rem] text-[var(--color-text-muted)]">$339 total · looking normal</p>
        </div>
        <ul className="mt-5 space-y-4">
          {CATEGORIES.map((cat, i) => (
            <li key={cat.label}>
              <div className="flex items-center justify-between text-[0.8rem]">
                <span className="flex items-center gap-2 font-medium text-[var(--color-text)]">
                  <cat.icon className="h-4 w-4" style={{ color: cat.tone }} aria-hidden />
                  {cat.label}
                </span>
                <span className="text-[var(--color-text-muted)]">{cat.value}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                <div
                  className="f-bar-h h-full"
                  data-drawn={drawn}
                  style={{
                    width: `${cat.share * 100}%`,
                    background: cat.tone,
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-1.5 rounded-xl bg-[var(--color-mint)] px-3 py-2 text-[0.74rem] font-medium text-[#0b6b3f]">
          <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
          Eating out is 18% below your usual. Quietly impressive.
        </p>
      </Card>
    </div>
  );
}

/* ── 2 · Cash-flow forecast: balance line through payday ───── */
function ForecastVisual() {
  const { ref, drawn } = useDrawn();
  /* Balance dips through bill days, jumps at payday. */
  const path = "M0,58 C24,60 40,66 58,72 C76,78 92,80 108,86 C124,92 138,96 152,98 L166,100 L166,34 C190,30 216,26 240,24 C264,22 288,26 300,28";
  return (
    <div ref={ref}>
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[0.9rem] font-semibold text-[var(--color-text)]">Next 3 weeks</p>
          <p className="text-[0.72rem] text-[var(--color-text-muted)]">bills included</p>
        </div>
        <div className="relative mt-4">
          <svg viewBox="0 0 300 130" className="w-full" role="img" aria-label="Forecast: balance dips to the safe line before payday on Friday, then recovers">
            {/* Safe line */}
            <line x1="0" y1="100" x2="300" y2="100" stroke="var(--color-border)" strokeDasharray="4 5" />
            {/* Payday marker */}
            <line x1="166" y1="14" x2="166" y2="118" stroke="rgba(29,59,255,0.25)" />
            <path
              d={path}
              className="f-chart-line"
              data-drawn={drawn}
              style={{ "--f-chart-length": 520 } as React.CSSProperties}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="166" cy="34" r="4" fill="var(--color-accent)" />
          </svg>
          <span className="f-mono absolute left-[52%] top-0 text-[0.52rem] text-[var(--color-accent)]">
            payday · Fri
          </span>
          <span className="f-mono absolute bottom-6 left-1 text-[0.52rem] text-[var(--color-text-muted)]">
            safe line
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--color-surface-raised)] px-3 py-2.5">
          <p className="text-[0.74rem] font-medium text-[var(--color-text)]">
            Tightest day: Thursday
          </p>
          <p className="text-[0.74rem] text-[var(--color-text-muted)]">$32 above the line</p>
        </div>
      </Card>
    </div>
  );
}

/* ── 3 · Bill radar: what's landing, when ──────────────────── */
const BILLS = [
  { icon: Home, label: "Rent", amount: "$1,150", due: "in 6 days", tone: "var(--color-accent)", soft: "var(--color-surface-raised)" },
  { icon: Zap, label: "Electric", amount: "$54", due: "Thursday", tone: "var(--color-warning)", soft: "var(--color-butter-soft)" },
  { icon: Music4, label: "TuneBox", amount: "$10.99", due: "in 9 days", tone: "var(--color-text-muted)", soft: "var(--color-surface-raised)" },
] as const;

function BillsVisual() {
  const { ref, drawn, reduced } = useDrawn();
  return (
    <div ref={ref}>
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[0.9rem] font-semibold text-[var(--color-text)]">On the radar</p>
          <p className="text-[0.72rem] text-[var(--color-text-muted)]">$1,215 this cycle</p>
        </div>
        <ul className="mt-4 space-y-2.5">
          {BILLS.map((bill, i) => (
            <motion.li
              key={bill.label}
              initial={reduced ? false : { opacity: 0, x: -18 }}
              animate={drawn ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-3.5 py-3"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: bill.soft }} aria-hidden>
                  <bill.icon className="h-4 w-4" style={{ color: bill.tone }} />
                </span>
                <span>
                  <span className="block text-[0.82rem] font-medium text-[var(--color-text)]">{bill.label}</span>
                  <span className="block text-[0.66rem] text-[var(--color-text-muted)]">{bill.amount}</span>
                </span>
              </span>
              <span className="f-chip f-chip-warning !text-[0.62rem]">
                <CalendarClock className="h-3 w-3" aria-hidden />
                {bill.due}
              </span>
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 text-[0.74rem] leading-relaxed text-[var(--color-text-muted)]">
          Heads-up lands 3 days before each one. No ambushes.
        </p>
      </Card>
    </div>
  );
}

/* ── 4 · Subscription catcher ──────────────────────────────── */
const SUBS = [
  { icon: MonitorPlay, label: "StreamMax", amount: "$15.99/mo", meta: "last used 74 days ago", flag: true },
  { icon: Dumbbell, label: "FlexGym", amount: "$29/mo", meta: "2 visits this month", flag: false },
  { icon: Music4, label: "TuneBox", amount: "$10.99/mo", meta: "used daily", flag: false },
] as const;

function SubscriptionsVisual() {
  const { ref, drawn, reduced } = useDrawn();
  return (
    <div ref={ref}>
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[0.9rem] font-semibold text-[var(--color-text)]">Your line-up</p>
          <p className="text-[0.72rem] text-[var(--color-text-muted)]">$55.98/mo total</p>
        </div>
        <ul className="mt-4 space-y-2.5">
          {SUBS.map((sub, i) => (
            <motion.li
              key={sub.label}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={drawn ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 ${
                sub.flag
                  ? "border-[rgba(255,92,57,0.4)] bg-[var(--color-coral-soft)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white" aria-hidden>
                  <sub.icon className="h-4 w-4 text-[var(--color-text)]" />
                </span>
                <span>
                  <span className="block text-[0.82rem] font-medium text-[var(--color-text)]">{sub.label}</span>
                  <span className="block text-[0.66rem] text-[var(--color-text-muted)]">{sub.meta}</span>
                </span>
              </span>
              {sub.flag ? (
                <span className="rounded-full bg-[var(--color-coral)] px-3 py-1 text-[0.64rem] font-semibold text-[#31100a]">
                  Cancel?
                </span>
              ) : (
                <span className="text-[0.72rem] text-[var(--color-text-muted)]">{sub.amount}</span>
              )}
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 text-[0.74rem] leading-relaxed text-[var(--color-text-muted)]">
          Ditching StreamMax frees up $191.88 a year. Just saying.
        </p>
      </Card>
    </div>
  );
}

/* ── 5 · Nudges + weekly recap ─────────────────────────────── */
function NudgesVisual() {
  const { ref, drawn, reduced } = useDrawn();
  return (
    <div ref={ref} className="space-y-3">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={drawn ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Card>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(29,59,255,0.1)]" aria-hidden>
              <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            </span>
            <p className="f-mono text-[0.56rem] text-[var(--color-accent)]">Nudge · Tue 9:04</p>
          </div>
          <p className="mt-2.5 text-[0.88rem] leading-relaxed text-[var(--color-text)]">
            You&rsquo;re $31 under budget with 3 days left. Slide it into savings while it&rsquo;s still real?
          </p>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 text-[0.76rem] font-medium text-white">
              <PiggyBank className="h-3.5 w-3.5" aria-hidden />
              Save $31
            </span>
            <span className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--color-border)] px-4 text-[0.76rem] font-medium text-[var(--color-text)]">
              Not today
            </span>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={drawn ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      >
        <div className="rounded-[var(--radius-lg)] bg-[#0b1530] p-5 text-white">
          <p className="f-mono text-[0.56rem] text-white/60">Sunday recap · 30 seconds</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[1.15rem] font-semibold leading-none">$412</p>
              <p className="mt-1 text-[0.62rem] text-white/60">spent</p>
            </div>
            <div>
              <p className="text-[1.15rem] font-semibold leading-none text-[#7ee2a8]">$74</p>
              <p className="mt-1 text-[0.62rem] text-white/60">saved</p>
            </div>
            <div>
              <p className="text-[1.15rem] font-semibold leading-none text-[var(--color-butter)]">2</p>
              <p className="mt-1 text-[0.62rem] text-white/60">bills handled</p>
            </div>
          </div>
          <p className="mt-3.5 flex items-center gap-1.5 text-[0.76rem] text-white/80">
            <ArrowUpRight className="h-3.5 w-3.5 text-[#7ee2a8]" aria-hidden />
            Best week since March. Same again next week?
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const VISUALS: Record<FeatureId, () => React.JSX.Element> = {
  insights: InsightsVisual,
  forecast: ForecastVisual,
  bills: BillsVisual,
  subscriptions: SubscriptionsVisual,
  nudges: NudgesVisual,
};

export default function FeatureVisual({ id }: { id: FeatureId }) {
  const Visual = VISUALS[id];
  return <Visual />;
}
