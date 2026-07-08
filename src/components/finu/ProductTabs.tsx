"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightLeft,
  ArrowUpRight,
  ChevronRight,
  Send,
  Sparkles,
} from "lucide-react";
import { TAB_PRODUCTS } from "./products";
import Eyebrow from "./Eyebrow";
import { Reveal, TextReveal } from "./TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Per-product interface vignettes (illustrative) ────────── */

function AiVisual() {
  return (
    <div className="space-y-3" aria-hidden>
      <div className="f-card f-card-raised max-w-[85%] rounded-2xl rounded-bl-md p-3.5">
        <p className="text-[0.8rem] text-[var(--color-text-secondary)]">
          How much did I spend on subscriptions this month?
        </p>
      </div>
      <div
        className="ml-auto max-w-[88%] rounded-2xl rounded-br-md border p-3.5"
        style={{
          background: "rgba(134,104,255,0.1)",
          borderColor: "rgba(134,104,255,0.35)",
        }}
      >
        <p className="f-mono mb-1.5 flex items-center gap-1.5 text-[0.55rem] text-[var(--color-secondary)]">
          <Sparkles className="h-3 w-3" /> Finu AI
        </p>
        <p className="text-[0.8rem] leading-relaxed text-[var(--color-text-primary)]">
          $86.40 across 6 subscriptions — two of them overlap. Cancel one and
          you save $11.99 a month.
        </p>
      </div>
      <div className="f-card f-card-raised max-w-[60%] rounded-2xl rounded-bl-md p-3.5">
        <p className="text-[0.8rem] text-[var(--color-text-secondary)]">
          Cancel the cheaper one.
        </p>
      </div>
    </div>
  );
}

function TransferVisual() {
  return (
    <div className="f-card f-card-raised p-4" aria-hidden>
      <div className="flex items-center justify-between">
        <div>
          <p className="f-mono text-[0.55rem] text-[var(--f-text-faint)]">You send</p>
          <p className="f-display mt-1 text-xl">250 USDC</p>
        </div>
        <Send className="h-4 w-4 text-[var(--color-primary)]" />
        <div className="text-right">
          <p className="f-mono text-[0.55rem] text-[var(--f-text-faint)]">
            They receive
          </p>
          <p className="f-display mt-1 text-xl">₱14,180</p>
        </div>
      </div>
      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
        <span
          className="absolute inset-y-0 left-0 w-3/4 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="f-chip f-chip-live">
          <span className="f-live-dot" /> On-chain
        </span>
        <span className="f-chip f-chip-success">Recipient verified</span>
      </div>
    </div>
  );
}

function WalletVisual() {
  const rows = [
    { sym: "USDC", name: "USD Coin", amount: "2,140.20", tone: "var(--color-primary)" },
    { sym: "USDT", name: "Tether", amount: "1,065.80", tone: "var(--color-success)" },
    { sym: "EURC", name: "Euro Coin", amount: "830.00", tone: "var(--color-accent)" },
    { sym: "PHP", name: "Philippine Peso", amount: "12,400", tone: "var(--color-warning)" },
  ];
  return (
    <ul className="space-y-2" aria-hidden>
      {rows.map((r) => (
        <li
          key={r.sym}
          className="f-card f-card-raised flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[0.55rem] font-bold"
              style={{ background: `color-mix(in srgb, ${r.tone} 18%, transparent)`, color: r.tone }}
            >
              {r.sym.slice(0, 2)}
            </span>
            <div>
              <p className="text-[0.8rem] font-semibold">{r.sym}</p>
              <p className="text-[0.62rem] text-[var(--f-text-faint)]">{r.name}</p>
            </div>
          </div>
          <p className="f-mono text-[0.72rem]">{r.amount}</p>
        </li>
      ))}
    </ul>
  );
}

function CreditVisual() {
  return (
    <div className="f-card f-card-raised p-4" aria-hidden>
      <div className="flex items-center justify-between">
        <p className="text-[0.8rem] font-semibold">Credit line</p>
        <span className="f-chip f-chip-success">Healthy</span>
      </div>
      <p className="f-display mt-3 text-2xl">$1,500</p>
      <p className="text-[0.62rem] text-[var(--f-text-faint)]">
        Backed by 0.045 BTC collateral
      </p>
      <div className="mt-4">
        <div className="flex justify-between text-[0.62rem] text-[var(--color-text-secondary)]">
          <span>Loan-to-value</span>
          <span className="font-semibold text-[var(--color-text-primary)]">42%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <span
            className="block h-full w-[42%] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-success), var(--color-warning))",
            }}
          />
        </div>
        <p className="mt-2 text-[0.62rem] text-[var(--f-text-faint)]">
          No credit checks · Flexible repayment
        </p>
      </div>
    </div>
  );
}

function SwapVisual() {
  return (
    <div className="f-card f-card-raised p-4" aria-hidden>
      <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface)] p-3">
        <div>
          <p className="f-mono text-[0.55rem] text-[var(--f-text-faint)]">From</p>
          <p className="f-display mt-0.5 text-lg">0.5 SOL</p>
        </div>
        <ArrowRightLeft className="h-4 w-4 text-[var(--color-accent)]" />
        <div className="text-right">
          <p className="f-mono text-[0.55rem] text-[var(--f-text-faint)]">To</p>
          <p className="f-display mt-0.5 text-lg">USDC</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[0.66rem] text-[var(--color-text-secondary)]">
        <span className="f-chip f-chip-live">
          <span className="f-live-dot" /> Rate locked 30s
        </span>
        <span>Minimal friction · Competitive rates</span>
      </div>
    </div>
  );
}

function P2PVisual() {
  const offers = [
    { user: "ren***", rate: "1.002", pay: "Bank transfer", side: "Buy" },
    { user: "kai***", rate: "0.998", pay: "E-wallet", side: "Sell" },
  ];
  return (
    <div className="space-y-2" aria-hidden>
      {offers.map((o) => (
        <div
          key={o.user}
          className="f-card f-card-raised flex items-center justify-between p-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(79,124,255,0.14)] text-[0.6rem] font-bold text-[var(--color-primary)]">
              {o.user.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-[0.78rem] font-semibold">{o.user}</p>
              <p className="text-[0.6rem] text-[var(--f-text-faint)]">{o.pay}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="f-mono text-[0.7rem]">{o.rate} USD</p>
            <span
              className={`f-chip mt-1 ${o.side === "Buy" ? "f-chip-success" : "f-chip-danger"}`}
            >
              {o.side} USDT
            </span>
          </div>
        </div>
      ))}
      <p className="text-center text-[0.62rem] text-[var(--f-text-faint)]">
        Real-time settlement · Escrow protected
      </p>
    </div>
  );
}

/* Per-product interface vignettes, keyed to the shared catalog. */
const VISUALS: Record<string, React.FC> = {
  "finu-ai": AiVisual,
  transfer: TransferVisual,
  wallet: WalletVisual,
  credit: CreditVisual,
  swap: SwapVisual,
  p2p: P2PVisual,
};

/* Directional depth: panels slide in from the side you're heading to. */
const PANEL_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: 44 * dir, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: -32 * dir, scale: 0.99 }),
};

export default function ProductTabs() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tabsAtEnd, setTabsAtEnd] = useState(false);

  const select = (index: number) => {
    setDir(index > active ? 1 : -1);
    setActive(index);
  };

  /* Hide the mobile "more tabs" cue once the row is scrolled out. */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () =>
      setTabsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = TAB_PRODUCTS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = active === last ? 0 : active + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = active === 0 ? last : active - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }
    if (next !== null) {
      event.preventDefault();
      select(next);
      tabRefs.current[next]?.focus();
    }
  };

  const product = TAB_PRODUCTS[active];
  const Visual = VISUALS[product.id];

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="f-section-tone-deep relative scroll-mt-24 f-section"
    >
      <div className="f-ambient" aria-hidden>
        <div
          className="f-ambient-blob"
          data-tone="blue"
          style={{ width: "46rem", height: "46rem", top: "-14rem", right: "-16rem" }}
        />
        <div
          className="f-ambient-blob"
          data-tone="violet"
          style={{ width: "40rem", height: "40rem", bottom: "-12rem", left: "-14rem" }}
        />
      </div>
      <div className="f-glow-violet pointer-events-none absolute inset-x-0 bottom-0 h-96" />
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow>One app, every money move</Eyebrow>
        </Reveal>
        <TextReveal
          as="h2"
          className="f-display mt-5 max-w-2xl text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Everything Finu does for your money
        </TextReveal>
        <span id="products-title" className="sr-only">
          Finu products
        </span>

        {/* Tabs */}
        <div className="f-tabs-scroller mt-12" data-end={tabsAtEnd}>
          <div
            ref={scrollerRef}
            role="tablist"
            aria-label="Finu products"
            className="flex gap-2 overflow-x-auto pb-2"
            onKeyDown={onKeyDown}
          >
            {TAB_PRODUCTS.map((p, i) => {
              const selected = i === active;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${p.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={`relative flex min-h-[44px] flex-none items-center gap-2 rounded-full px-4 py-2.5 text-[0.84rem] font-medium transition-colors duration-300 ${
                    selected
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="finu-tab-pill"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 320, damping: 30 }
                      }
                      className="f-tab-pill absolute inset-0 rounded-full border border-[rgba(79,124,255,0.5)] bg-[rgba(79,124,255,0.14)]"
                      aria-hidden
                    />
                  )}
                  <Icon className="relative h-4 w-4" aria-hidden />
                  <span className="relative whitespace-nowrap">{p.label}</span>
                </button>
              );
            })}
          </div>
          <div className="f-tabs-cue" aria-hidden>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Active panel */}
        <div
          role="tabpanel"
          id={`${baseId}-panel-${product.id}`}
          aria-labelledby={`${baseId}-tab-${product.id}`}
          className="mt-8"
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={product.id}
              custom={dir}
              variants={reduced ? undefined : PANEL_VARIANTS}
              initial={reduced ? false : "enter"}
              animate={reduced ? { opacity: 1 } : "center"}
              exit={reduced ? undefined : "exit"}
              transition={{ duration: 0.45, ease: EASE }}
              className="f-card grid gap-10 p-7 md:grid-cols-2 md:p-12"
            >
              <div className="flex flex-col justify-center">
                <p className="f-mono text-[0.6rem] text-[var(--color-accent)]">
                  {product.label}
                </p>
                <h3 className="f-display mt-4 text-2xl md:text-[2rem]">
                  {product.title}
                </h3>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-[var(--color-text-secondary)]">
                  {product.body}
                </p>
                <a
                  href={product.href}
                  className="group mt-6 inline-flex min-h-[44px] w-fit items-center gap-1.5 text-[0.9rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Learn more
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <Visual />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
