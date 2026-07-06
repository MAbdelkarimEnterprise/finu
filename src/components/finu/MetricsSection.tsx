"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedValue from "./AnimatedValue";
import Eyebrow from "./Eyebrow";
import InteractiveSurface from "./InteractiveSurface";
import ParticleMetric, { type RingConfig } from "./ParticleMetric";
import { Reveal, TextReveal } from "./TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 0,
});

/* Figures published on meetfinu.com ("Trusted Worldwide"); the
   supporting lines reuse approved Finu copy — nothing invented. */
type Metric = {
  id: string;
  control: string;
  value: number;
  suffix: string;
  label: string;
  copy: string;
  ring: RingConfig;
};

const METRICS: Metric[] = [
  {
    id: "users",
    control: "Users",
    value: 1_000_000,
    suffix: "+",
    label: "Global users",
    copy: "Pay, transfer, save, and manage stablecoins with intelligence built in.",
    ring: { count: 104, radius: 1 },
  },
  {
    id: "markets",
    control: "Markets",
    value: 160,
    suffix: "+",
    label: "Countries",
    copy: "Shop, withdraw, and manage your funds globally.",
    ring: { count: 56, radius: 0.78 },
  },
  {
    id: "insights",
    control: "AI insights",
    value: 5_000_000,
    suffix: "+",
    label: "Financial advice",
    copy: "Finu analyzes spending, calls out bad habits, and makes you better at money.",
    ring: { count: 148, radius: 1.05 },
  },
];

/* Illustrative example of a Finu AI monthly breakdown — categories from
   Finu's own card copy ("subscriptions, travel, and everyday purchases"). */
const SPEND_ROWS = [
  { label: "Everyday purchases", pct: 38, tone: "var(--color-primary)" },
  { label: "Subscriptions", pct: 22, tone: "rgba(79, 124, 255, 0.75)" },
  { label: "Travel", pct: 18, tone: "rgba(134, 104, 255, 0.85)" },
  { label: "Savings", pct: 14, tone: "var(--color-accent)" },
  { label: "Transfers", pct: 8, tone: "rgba(168, 179, 204, 0.7)" },
];

function SegmentedControl({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const idx = METRICS.findIndex((m) => m.id === activeId);
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (idx + 1) % METRICS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (idx - 1 + METRICS.length) % METRICS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = METRICS.length - 1;
    }
    if (next >= 0) {
      event.preventDefault();
      onChange(METRICS[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label="Choose a metric"
      className="f-segmented"
      onKeyDown={onKeyDown}
    >
      {METRICS.map((m, i) => (
        <button
          key={m.id}
          ref={(node) => {
            refs.current[i] = node;
          }}
          type="button"
          aria-pressed={m.id === activeId}
          className="f-segment"
          onClick={() => onChange(m.id)}
        >
          {m.id === activeId && (
            <motion.span
              layoutId="f-metric-pill"
              className="f-segment-pill"
              transition={{ duration: 0.45, ease: EASE }}
              aria-hidden
            />
          )}
          <span className="relative z-10">{m.control}</span>
        </button>
      ))}
    </div>
  );
}

/** Small illustrative Finu AI activity waveform (draws once in view). */
function InsightWave() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 72"
      className="mt-4 w-full"
      aria-hidden
    >
      <path
        d="M2 52 C 22 52, 26 30, 44 30 S 66 58, 84 58 88 20, 108 20 128 44, 146 44 156 10, 176 10 194 38, 212 38 232 26, 258 24"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="2"
        strokeLinecap="round"
        className="f-chart-line"
        data-drawn={inView}
        style={{ "--f-chart-length": 420 } as React.CSSProperties}
      />
      <circle cx="258" cy="24" r="3" fill="var(--color-accent)" className="f-glyph-core" />
    </svg>
  );
}

/**
 * "Trusted Worldwide" as an interactive bento: a central orbital
 * particle metric with a segmented control, capability tiles that
 * reuse approved Finu copy, and one editorial (clearly illustrative)
 * chart moment.
 */
export default function MetricsSection() {
  const [activeId, setActiveId] = useState(METRICS[0].id);
  const [landedId, setLandedId] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-12% 0px" });

  const active = METRICS.find((m) => m.id === activeId) ?? METRICS[0];
  const announcement = `${COMPACT.format(active.value)}${active.suffix} ${active.label}`;

  return (
    <section
      id="metrics"
      aria-labelledby="metrics-title"
      className="f-section-tone-raised relative scroll-mt-24 px-5 py-24 md:px-8 md:py-28"
    >
      <div className="f-grid-texture" aria-hidden />
      <div className="f-glow-primary pointer-events-none absolute inset-x-0 top-0 h-64" />
      <div className="relative mx-auto max-w-[1200px]">
        <TextReveal
          as="h2"
          className="f-display text-center text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Trusted Worldwide
        </TextReveal>
        <span id="metrics-title" className="sr-only">
          Trusted worldwide
        </span>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Central interactive metric */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <InteractiveSurface
              className={`f-card f-card-raised relative h-full min-h-[24rem] overflow-hidden md:min-h-[27rem] ${
                landedId === active.id ? "f-metric-done" : ""
              }`}
              maxTilt={1.2}
            >
              <ParticleMetric config={active.ring} />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <p className="f-display text-5xl md:text-6xl">
                  <AnimatedValue
                    key={active.id}
                    value={active.value}
                    format="compact"
                    suffix={active.suffix}
                    onComplete={() => setLandedId(active.id)}
                  />
                </p>
                <p className="text-[0.95rem] font-medium text-[var(--color-text-primary)]">
                  {active.label}
                </p>
                <p className="max-w-xs text-[0.85rem] leading-relaxed text-[var(--color-text-secondary)]">
                  {active.copy}
                </p>
                <div className="mt-4">
                  <SegmentedControl
                    activeId={activeId}
                    onChange={(id) => {
                      setLandedId(null);
                      setActiveId(id);
                    }}
                  />
                </div>
              </div>
              <p aria-live="polite" className="sr-only">
                {announcement}
              </p>
            </InteractiveSurface>
          </Reveal>

          {/* Finu AI activity */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="f-card f-card-hover h-full p-6 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <Eyebrow>Finu AI</Eyebrow>
                <span className="f-mono text-[0.58rem] text-[var(--f-text-faint)]">
                  Illustrative
                </span>
              </div>
              <p className="f-display mt-3 text-xl">
                Money talks. Finu talks back.
              </p>
              <InsightWave />
              <p className="mt-2 text-[0.82rem] text-[var(--color-text-secondary)]">
                Insight activity as Finu reads spending and answers back.
              </p>
            </div>
          </Reveal>

          {/* Infrastructure */}
          <Reveal delay={0.14} className="lg:col-span-5">
            <div className="f-card f-card-hover h-full p-6 md:p-7">
              <Eyebrow>Infrastructure</Eyebrow>
              <p className="f-display mt-3 text-xl">
                Built on established rails.
              </p>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--color-text-secondary)]">
                Finu works with partners across chains, stablecoins, cloud,
                and compliance — Circle, Solana, Polygon, Arbitrum, Base,
                Tether, AWS, Sumsub, and more.
              </p>
            </div>
          </Reveal>

          {/* International transfer capability */}
          <Reveal delay={0.08} className="lg:col-span-4">
            <div className="f-card f-card-hover flex h-full flex-col p-6 md:p-7">
              <Eyebrow>International Transfer</Eyebrow>
              <p className="f-display mt-3 text-xl">
                Send crypto, receive local currency.
              </p>
              <div
                className="relative mt-auto h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)]"
                aria-hidden
              >
                <div className="f-route-pulse" />
              </div>
              <p className="mt-3 text-[0.82rem] text-[var(--color-text-secondary)]">
                Every transaction protected, every recipient just moments
                away.
              </p>
            </div>
          </Reveal>

          {/* Editorial chart — explicitly illustrative */}
          <Reveal delay={0.12} className="lg:col-span-8">
            <div
              ref={chartRef}
              className="f-card f-card-hover h-full p-6 md:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <Eyebrow>Spending, understood</Eyebrow>
                <span className="f-mono text-[0.58rem] text-[var(--f-text-faint)]">
                  Illustrative
                </span>
              </div>
              <p className="f-display mt-3 text-xl md:text-2xl">
                How Finu AI reads a month.
              </p>
              <p className="sr-only">
                Illustrative example of Finu AI breaking a month of spending
                into categories.
              </p>
              <dl className="mt-6 space-y-3.5">
                {SPEND_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[8.5rem_1fr_2.6rem] items-center gap-3 md:grid-cols-[10rem_1fr_3rem]"
                  >
                    <dt className="text-[0.82rem] text-[var(--color-text-secondary)]">
                      {row.label}
                    </dt>
                    <dd className="m-0">
                      <div
                        className="f-bar-h h-2.5"
                        data-drawn={chartInView}
                        style={{
                          width: `${row.pct * 2.4}%`,
                          background: row.tone,
                          transitionDelay: `${i * 90}ms`,
                        }}
                        aria-hidden
                      />
                    </dd>
                    <dd className="f-mono m-0 text-right text-[0.7rem] text-[var(--color-text-primary)]">
                      {row.pct}%
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
