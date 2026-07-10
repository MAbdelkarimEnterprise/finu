"use client";

import type { ReactNode } from "react";
import {
  Bell,
  CalendarClock,
  Home,
  MessageCircle,
  PieChart,
  PiggyBank,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * Fictional Finu app screens, drawn in DOM so they stay crisp at any
 * size. Everything is decorative (aria-hidden interactive look, real
 * text for screen readers where it matters); the page labels them as
 * illustrative.
 */

export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[38px] border border-[rgba(7,21,47,0.08)] bg-[var(--color-bg)] ${className}`}
      style={{
        boxShadow:
          "0 50px 110px -35px rgba(7,21,47,0.45), 0 0 0 7px #0b1530, 0 0 0 8px rgba(255,255,255,0.14)",
      }}
    >
      {children}
    </div>
  );
}

const INSIGHT_TILES = [
  {
    icon: ShieldCheck,
    tone: "var(--color-positive)",
    label: "Safe to spend",
    value: "$86",
    note: "until payday",
  },
  {
    icon: CalendarClock,
    tone: "var(--color-warning)",
    label: "Bills ahead",
    value: "$212",
    note: "3 this week",
  },
  {
    icon: PiggyBank,
    tone: "var(--color-accent)",
    label: "Saved streak",
    value: "6 wks",
    note: "keep rolling",
  },
] as const;

const APP_NAV = [
  { icon: Home, label: "Home", active: true },
  { icon: PieChart, label: "Spend", active: false },
  { icon: MessageCircle, label: "Chat", active: false },
  { icon: Radar, label: "Bills", active: false },
  { icon: PiggyBank, label: "Save", active: false },
] as const;

export function HomeScreen() {
  return (
    <div className="text-left">
      {/* Greeting */}
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-[0.76rem] text-[var(--color-text-muted)]">Thursday, 6:12 pm</p>
          <p className="mt-1 text-[1.05rem] font-medium leading-snug text-[var(--color-text)]">
            You&rsquo;re in good shape, Maya.
          </p>
        </div>
        <span className="relative grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] bg-white" aria-hidden>
          <Bell className="h-4 w-4 text-[var(--color-text-muted)]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-coral)]" />
        </span>
      </div>

      {/* Safe to spend hero card */}
      <div className="px-5 pt-4">
        <div className="rounded-[22px] bg-[#0b1530] p-4 text-white">
          <p className="f-mono text-[0.56rem] text-white/60">Safe to spend</p>
          <p className="mt-1 text-[2.1rem] font-medium leading-none tracking-tight">$86</p>
          <p className="mt-1.5 text-[0.72rem] text-white/70">
            after Thursday&rsquo;s electric bill · payday Fri
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden>
            <div
              className="h-full w-[62%] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-accent), #38ddf8)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Finu says */}
      <div className="px-5 pt-3.5">
        <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-full bg-[rgba(29,59,255,0.1)]"
              aria-hidden
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            </span>
            <p className="f-mono text-[0.56rem] text-[var(--color-accent)]">Finu says</p>
          </div>
          <p className="mt-2.5 text-[0.85rem] leading-relaxed text-[var(--color-text)]">
            Groceries came in $22 under normal this week. Park it in savings before it evaporates?
          </p>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex min-h-[36px] items-center rounded-full bg-[var(--color-accent)] px-4 text-[0.76rem] font-medium text-white">
              Save the $22
            </span>
            <span className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--color-border)] px-4 text-[0.76rem] font-medium text-[var(--color-text)]">
              Let it ride
            </span>
          </div>
        </div>
      </div>

      {/* Insight tiles */}
      <div className="grid grid-cols-3 gap-2.5 px-5 pt-3.5">
        {INSIGHT_TILES.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-3"
          >
            <tile.icon className="h-4 w-4" style={{ color: tile.tone }} aria-hidden />
            <p className="mt-2 text-[0.6rem] leading-tight text-[var(--color-text-muted)]">
              {tile.label}
            </p>
            <p className="mt-0.5 text-[0.9rem] font-semibold text-[var(--color-text)]">
              {tile.value}
            </p>
            <p className="mt-0.5 text-[0.55rem] leading-tight text-[var(--color-text-muted)]">
              {tile.note}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] bg-white px-7 pb-5 pt-3">
        {APP_NAV.map((item) => (
          <span
            key={item.label}
            className="flex min-w-[40px] flex-col items-center gap-1"
            style={{
              color: item.active ? "var(--color-accent)" : "var(--color-text-muted)",
            }}
          >
            <item.icon className="h-[1.1rem] w-[1.1rem]" aria-hidden />
            <span className="text-[0.55rem] font-medium">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
