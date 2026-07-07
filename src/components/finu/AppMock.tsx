"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  Flame,
  Home,
  MessageCircle,
  PieChart,
  PiggyBank,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AnimatedValue from "./AnimatedValue";
import FinuCard from "./FinuCard";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Illustrative interface data — labelled beneath the phone. */
const INSIGHTS = [
  {
    icon: ShieldCheck,
    tone: "var(--app-success)",
    label: "Safe to spend",
    value: "$284",
    note: "until Friday",
    progress: 0.62,
  },
  {
    icon: CalendarClock,
    tone: "var(--app-warning)",
    label: "Bills coming up",
    value: "$128",
    note: "nothing scary",
    progress: 0.34,
  },
  {
    icon: Flame,
    tone: "var(--color-secondary)",
    label: "Savings streak",
    value: "6 wks",
    note: "keep it rolling",
    progress: 0.86,
  },
];

const QUICK_ACTIONS = [
  { icon: Send, label: "Send" },
  { icon: PiggyBank, label: "Save" },
  { icon: PieChart, label: "Budget" },
  { icon: CreditCard, label: "Card" },
  { icon: Sparkles, label: "Ask Finu" },
];

const NAV = [
  { icon: Home, label: "Home", active: true },
  { icon: PieChart, label: "Spend", active: false },
  { icon: MessageCircle, label: "Chat", active: false },
  { icon: PiggyBank, label: "Save", active: false },
  { icon: CreditCard, label: "Card", active: false },
];

/**
 * The Finu app main screen, drawn in DOM as a light premium mock —
 * greeting, balance, the Finu card, a conversational assistant panel,
 * insight tiles, and a bottom nav. Pure markup + CSS on the light
 * app tokens; the visual is decorative, so controls are non-interactive.
 */
export default function AppMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[23.5rem]">
      {/* Phone frame */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, ease: EASE }}
        className="overflow-hidden rounded-[32px] border border-[rgba(247,249,255,0.14)]"
        style={{
          background: "var(--app-bg)",
          boxShadow:
            "0 50px 110px -35px rgba(2,4,12,0.9), 0 0 0 6px rgba(13,20,40,0.85)",
        }}
      >
        {/* Greeting */}
        <div className="px-5 pb-1 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[0.78rem] text-[var(--app-muted)]">
              Good morning, Maria
            </p>
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[0.7rem] font-semibold text-white"
              style={{ background: "var(--color-primary)" }}
              aria-hidden
            >
              MS
            </span>
          </div>
          <p className="mt-1.5 text-[1.02rem] font-medium leading-snug text-[var(--app-ink)]">
            You’re looking good this week.
          </p>
        </div>

        {/* Balance + CTA */}
        <div className="px-5 pt-4">
          <div
            className="rounded-[22px] border p-4"
            style={{
              background: "var(--app-surface)",
              borderColor: "var(--app-border)",
              boxShadow: "0 10px 28px -18px rgba(7,21,47,0.25)",
            }}
          >
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[var(--app-muted)]">
              Available
            </p>
            <p className="mt-1 text-[1.9rem] font-medium leading-none tracking-tight text-[var(--app-ink)]">
              <AnimatedValue value={4820.64} decimals={2} prefix="$" />
            </p>
            <p className="mt-1.5 text-[0.66rem] text-[var(--app-muted)]">
              USDC · USDT · EURC across 4 networks
            </p>
            <p className="mt-3 text-[0.78rem] leading-snug text-[var(--app-ink)]">
              Food spending chilled out this week. Nice.
            </p>
            <div className="mt-4 flex gap-2.5">
              <span
                className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full text-[0.85rem] font-medium text-white"
                style={{
                  background: "var(--color-primary)",
                  boxShadow: "0 10px 22px -10px rgba(79,124,255,0.65)",
                }}
              >
                Ask Finu
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
              <span
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-full border text-[0.85rem] font-medium text-[var(--app-ink)]"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-soft-blue)",
                }}
              >
                Move money
              </span>
            </div>
          </div>
        </div>

        {/* The Finu card */}
        <div className="px-5 pt-4">
          <FinuCard variant="royal" />
        </div>

        {/* Assistant panel */}
        <div className="px-5 pt-4">
          <div
            className="rounded-[22px] border p-4"
            style={{
              background: "var(--app-surface)",
              borderColor: "var(--app-border)",
              boxShadow: "0 10px 28px -18px rgba(7,21,47,0.25)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="grid h-7 w-7 place-items-center rounded-full"
                style={{ background: "rgba(134,104,255,0.14)" }}
                aria-hidden
              >
                <Sparkles className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
              </span>
              <p className="f-mono text-[0.56rem] text-[var(--color-secondary)]">
                Finu says
              </p>
            </div>
            <p className="mt-2.5 text-[0.85rem] leading-relaxed text-[var(--app-ink)]">
              You spent 18% less on food this week. Want to move the
              difference into savings?
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span
                className="inline-flex min-h-[36px] items-center rounded-full px-4 text-[0.76rem] font-medium text-white"
                style={{ background: "var(--color-primary)" }}
              >
                Move to savings
              </span>
              <span
                className="inline-flex min-h-[36px] items-center rounded-full border px-4 text-[0.76rem] font-medium text-[var(--app-ink)]"
                style={{ borderColor: "var(--app-border)" }}
              >
                Show me why
              </span>
            </div>
          </div>
        </div>

        {/* Insight tiles */}
        <div className="grid grid-cols-3 gap-2.5 px-5 pt-4">
          {INSIGHTS.map((tile, i) => (
            <div
              key={tile.label}
              className="rounded-2xl border p-3"
              style={{
                background: "var(--app-surface)",
                borderColor: "var(--app-border)",
              }}
            >
              <tile.icon
                className="h-4 w-4"
                style={{ color: tile.tone }}
                aria-hidden
              />
              <p className="mt-2 text-[0.6rem] leading-tight text-[var(--app-muted)]">
                {tile.label}
              </p>
              <p className="mt-0.5 text-[0.86rem] font-semibold text-[var(--app-ink)]">
                {tile.value}
              </p>
              <p className="mt-0.5 text-[0.54rem] leading-tight text-[var(--app-muted)]">
                {tile.note}
              </p>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full"
                style={{ background: "var(--app-border)" }}
                role="img"
                aria-label={`${tile.label}: ${tile.value}`}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: tile.tone }}
                  initial={
                    reduced
                      ? { width: `${tile.progress * 100}%` }
                      : { width: 0 }
                  }
                  animate={
                    inView
                      ? { width: `${tile.progress * 100}%` }
                      : undefined
                  }
                  transition={{
                    duration: 1.1,
                    ease: EASE,
                    delay: 0.4 + i * 0.15,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex justify-between px-5 pt-4">
          {QUICK_ACTIONS.map((action) => (
            <span
              key={action.label}
              className="flex min-w-[44px] flex-col items-center gap-1.5"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-full border"
                style={{
                  background: "var(--app-soft-blue)",
                  borderColor: "var(--app-border)",
                }}
                aria-hidden
              >
                <action.icon className="h-[1.05rem] w-[1.05rem] text-[var(--color-primary)]" />
              </span>
              <span className="text-[0.56rem] font-medium text-[var(--app-muted)]">
                {action.label}
              </span>
            </span>
          ))}
        </div>

        {/* Bottom navigation */}
        <div
          className="mt-5 flex items-center justify-between border-t px-7 pb-5 pt-3"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-surface)",
          }}
        >
          {NAV.map((item) => (
            <span
              key={item.label}
              className="flex min-w-[44px] flex-col items-center gap-1"
              style={{
                color: item.active ? "var(--color-primary)" : "var(--app-muted)",
              }}
            >
              <item.icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
              <span className="text-[0.55rem] font-medium">{item.label}</span>
              {item.active && (
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: "var(--color-primary)" }}
                  aria-hidden
                />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Floating settled transfer — money in motion */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: -14, x: 10 }}
        animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        className="absolute -right-3 top-16 w-[62%] rounded-2xl border p-3.5 sm:-right-8"
        style={{
          background: "var(--app-surface)",
          borderColor: "var(--app-border)",
          boxShadow: "0 24px 50px -22px rgba(2,4,12,0.7)",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 flex-none place-items-center rounded-lg"
              style={{ background: "rgba(79,124,255,0.12)" }}
              aria-hidden
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold text-[var(--app-ink)]">
                Send to bank
              </p>
              <p className="text-[0.56rem] text-[var(--app-muted)]">
                USDC → PHP · Maria S.
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[0.58rem] font-semibold"
            style={{
              color: "var(--app-success)",
              background: "rgba(22,163,74,0.1)",
            }}
          >
            Settled
          </span>
        </div>
      </motion.div>

      <p className="f-mono mt-4 text-center text-[0.55rem] text-[var(--f-text-faint)]">
        Illustrative interface
      </p>
    </div>
  );
}
