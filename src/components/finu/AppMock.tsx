"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Sparkles } from "lucide-react";
import AnimatedValue from "./AnimatedValue";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Illustrative interface data — labelled as such in the footer. */
const WEEKLY_SPEND = [
  { day: "Mon", amount: 42 },
  { day: "Tue", amount: 18 },
  { day: "Wed", amount: 65 },
  { day: "Thu", amount: 31 },
  { day: "Fri", amount: 88 },
  { day: "Sat", amount: 54 },
  { day: "Sun", amount: 23 },
];

const CATEGORIES = [
  { label: "Subscriptions", share: 34, tone: "var(--color-primary)" },
  { label: "Groceries", share: 27, tone: "var(--color-accent)" },
  { label: "Travel", share: 22, tone: "var(--color-secondary)" },
  { label: "Dining", share: 17, tone: "var(--color-warning)" },
];

const MAX_SPEND = Math.max(...WEEKLY_SPEND.map((d) => d.amount));

const AI_MESSAGE =
  "Delivery spending is up 38% this week. Want me to set a dining cap?";

function SpendingChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [idle, setIdle] = useState(4);

  /* While nobody hovers or focuses, a soft highlight wanders the week —
     the chart reads as live without announcing anything to SRs. */
  useEffect(() => {
    if (reduced || !inView || active !== null) return;
    const id = setInterval(
      () => setIdle((i) => (i + 1) % WEEKLY_SPEND.length),
      2600
    );
    return () => clearInterval(id);
  }, [reduced, inView, active]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <p className="text-[0.72rem] font-medium text-[var(--color-text-secondary)]">
          This week
        </p>
        <p
          className="f-mono text-[0.6rem] text-[var(--color-accent)]"
          role="status"
          aria-live="polite"
        >
          {active === null
            ? "USDC · LIVE"
            : `${WEEKLY_SPEND[active].day} · $${WEEKLY_SPEND[active].amount}`}
        </p>
      </div>

      <div
        className="mt-3 grid h-24 grid-cols-7 items-end gap-2"
        role="img"
        aria-label={`Bar chart of this week's spending. ${WEEKLY_SPEND.map(
          (d) => `${d.day} $${d.amount}`
        ).join(", ")}.`}
      >
        {WEEKLY_SPEND.map((d, i) => (
          <div key={d.day} className="relative flex h-full flex-col justify-end">
            {active === i && (
              <span
                className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--f-border-soft)] bg-[var(--color-surface-raised)] px-2 py-0.5 text-[0.62rem] font-semibold text-[var(--color-text-primary)]"
                aria-hidden
              >
                ${d.amount}
              </span>
            )}
            <button
              type="button"
              className="f-bar w-full rounded-t-md"
              data-drawn={inView}
              style={{
                height: `${(d.amount / MAX_SPEND) * 100}%`,
                background:
                  active === i
                    ? "var(--color-accent)"
                    : active === null && !reduced && idle === i
                      ? "linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 45%, var(--color-primary)), rgba(79,124,255,0.5))"
                      : "linear-gradient(180deg, var(--color-primary), rgba(79,124,255,0.35))",
                transitionDelay: `${i * 70}ms`,
              }}
              aria-label={`${d.day}: $${d.amount} spent`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
            <span className="mt-1.5 text-center text-[0.55rem] text-[var(--f-text-faint)]">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The Finu interface, drawn in DOM: balance, spending analysis,
 * an AI callout, and money in motion. Pure markup + CSS, so it
 * reads even when WebGL is unavailable.
 */
export default function AppMock() {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), reduced ? 0 : 2400);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <div className="f-tilt relative mx-auto w-full max-w-[26rem]" aria-hidden={false}>
      {/* Main dashboard card */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
        className="f-card f-card-hover p-5 md:p-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-[0.72rem] font-medium text-[var(--color-text-secondary)]">
            Total balance
          </p>
          <span className="f-chip f-chip-live">
            <span className="f-live-dot" aria-hidden />
            Live
          </span>
        </div>

        <p className="f-display mt-2 text-3xl md:text-[2.2rem]">
          <AnimatedValue value={4820.64} decimals={2} prefix="$" />
        </p>
        <p className="mt-1 text-[0.7rem] text-[var(--f-text-faint)]">
          USDC · USDT · EURC across 4 networks
        </p>

        <div className="f-hairline my-5" />

        <SpendingChart />

        <div className="f-hairline my-5" />

        <ul className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{ background: c.tone }}
                aria-hidden
              />
              <span className="w-28 text-[0.74rem] text-[var(--color-text-secondary)]">
                {c.label}
              </span>
              <span
                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)]"
                role="img"
                aria-label={`${c.label}: ${c.share}% of spending`}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: c.tone }}
                  initial={reduced ? { width: `${c.share}%` } : { width: 0 }}
                  animate={{ width: `${c.share}%` }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
                />
              </span>
              <span className="w-9 text-right text-[0.72rem] font-semibold">
                {c.share}%
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Finu AI callout — the violet moment */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24, x: -16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.85 }}
        className="f-card f-card-raised f-card-hover !absolute left-0 -bottom-16 w-[78%] border-[rgba(134,104,255,0.4)] p-4 sm:-left-10 md:-bottom-14"
      >
        <div className="flex items-start gap-3">
          <span
            className="grid h-8 w-8 flex-none place-items-center rounded-lg"
            style={{ background: "rgba(134,104,255,0.16)" }}
            aria-hidden
          >
            <Sparkles className="h-4 w-4 text-[var(--color-secondary)]" />
          </span>
          <div>
            <p className="f-mono text-[0.55rem] text-[var(--color-secondary)]">
              Finu AI
            </p>
            <p className="mt-1 text-[0.76rem] leading-snug text-[var(--color-text-primary)]">
              {reduced
                ? AI_MESSAGE
                : AI_MESSAGE.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 1.5 + i * 0.05 }}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
            </p>
            <motion.div
              className="mt-2.5 flex gap-2"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 2.4 }}
            >
              <span className="f-chip f-chip-success">Set cap</span>
              <span className="f-chip f-chip-warning">Remind me</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Money in motion */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: -18, x: 16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.15 }}
        className="f-card f-card-raised f-card-hover !absolute right-0 -top-10 w-[64%] p-4 sm:-right-8"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[rgba(79,124,255,0.14)]"
              aria-hidden
            >
              {settled ? (
                <ArrowUpRight className="h-4 w-4 text-[var(--color-primary)]" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-[var(--color-primary)]" />
              )}
            </span>
            <div>
              <p className="text-[0.74rem] font-semibold">Send to bank</p>
              <p className="text-[0.62rem] text-[var(--f-text-faint)]">
                USDC → PHP · Maria S.
              </p>
            </div>
          </div>
          {settled ? (
            <span className="f-chip f-chip-success">Settled</span>
          ) : (
            <span
              className="f-skeleton h-5 w-14"
              role="status"
              aria-label="Transfer in progress"
            />
          )}
        </div>

        {/* Route: a light packet travels the rail until settlement. */}
        <div
          className="relative mt-3 h-[3px] overflow-hidden rounded-full bg-[var(--color-surface)]"
          aria-hidden
        >
          {settled ? (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-primary), var(--color-success))",
              }}
            />
          ) : (
            <span className="f-route-pulse" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
