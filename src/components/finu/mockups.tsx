/**
 * Product-interface mockups, built entirely from DOM + SVG so they stay
 * crisp, themeable, and legible without images or WebGL. These are the
 * "product evidence" cards used across the homepage.
 */

const ROUTES = [
  {
    corridor: "USD → MXN",
    rail: "USDC rail",
    status: "Settled",
    meta: "0.9s",
    done: true,
  },
  {
    corridor: "USD → PHP",
    rail: "USDC rail",
    status: "Routing",
    meta: "−2.1% cost",
    done: false,
  },
  {
    corridor: "USD → EUR",
    rail: "Bank rail",
    status: "Scheduled",
    meta: "no cutoff",
    done: false,
  },
];

/** The hero console: an orchestration run from intent to settlement. */
export function RoutingConsole({ className = "" }: { className?: string }) {
  return (
    <div
      className={`f-console w-[min(92vw,30rem)] rounded-[1.6rem] p-5 text-left md:p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="f-mono text-[0.6rem] text-[var(--f-ink-faint)]">
          Finu console
        </p>
        <p className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.14em] text-[var(--f-ink-dim)]">
          <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
          LIVE
        </p>
      </div>

      <p className="mt-4 text-[0.95rem] leading-snug text-[var(--f-ink)] md:text-base">
        “Pay 42 suppliers across Mexico, the Philippines, and the EU by
        Friday.”
      </p>

      <div className="mt-5 space-y-2.5">
        {ROUTES.map((r) => (
          <div
            key={r.corridor}
            className="flex items-center justify-between rounded-xl border border-[rgba(33,29,25,0.07)] bg-white/70 px-3.5 py-2.5"
          >
            <div>
              <p className="text-[0.8rem] font-medium text-[var(--f-ink)]">
                {r.corridor}
              </p>
              <p className="text-[0.68rem] text-[var(--f-ink-faint)]">
                {r.rail}
              </p>
            </div>
            <p
              className={`font-mono text-[0.62rem] tracking-[0.12em] ${
                r.done ? "text-[#3f7d1e]" : "text-[var(--f-ink-dim)]"
              }`}
            >
              {r.status.toUpperCase()} · {r.meta}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-[var(--f-line)] pt-3.5 text-[0.72rem] leading-relaxed text-[var(--f-ink-dim)]">
        Finu chose the cheapest compliant rail for every corridor in this
        batch.
      </p>
    </div>
  );
}

/** Tab visual — intent parsing. */
export function IntentMock() {
  const fields = [
    ["GOAL", "Pay 42 suppliers"],
    ["DEADLINE", "Friday 17:00 GMT"],
    ["CONSTRAINT", "Minimize FX cost"],
    ["RISK", "Hold anomalies"],
  ];
  return (
    <div className="f-console w-full max-w-[24rem] rounded-[1.4rem] p-5">
      <p className="f-mono text-[0.6rem] text-[var(--f-ink-faint)]">
        Intent parsed
      </p>
      <div className="mt-4 space-y-2.5">
        {fields.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-[0.6rem] tracking-[0.14em] text-[var(--f-ink-faint)]">
              {k}
            </span>
            <span className="text-[0.82rem] text-[var(--f-ink)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tab visual — rail scoring and selection. */
export function RouteMock() {
  const rails = [
    { name: "USDC rail", score: 96, best: true },
    { name: "Bank wire", score: 61, best: false },
    { name: "Card network", score: 44, best: false },
  ];
  return (
    <div className="f-console w-full max-w-[24rem] rounded-[1.4rem] p-5">
      <p className="f-mono text-[0.6rem] text-[var(--f-ink-faint)]">
        Rails scored · speed / cost / risk
      </p>
      <div className="mt-4 space-y-3">
        {rails.map((r) => (
          <div key={r.name}>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.82rem] text-[var(--f-ink)]">
                {r.name}
              </span>
              <span
                className={`font-mono text-[0.62rem] tracking-[0.12em] ${
                  r.best ? "text-[#3f7d1e]" : "text-[var(--f-ink-faint)]"
                }`}
              >
                {r.best ? `SELECTED · ${r.score}` : r.score}
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[rgba(33,29,25,0.08)]">
              <div
                className={`h-full rounded-full ${
                  r.best ? "bg-[var(--f-lime)]" : "bg-[rgba(33,29,25,0.22)]"
                }`}
                style={{ width: `${r.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tab visual — settlement receipt. */
export function SettleMock() {
  return (
    <div className="f-console w-full max-w-[24rem] rounded-[1.4rem] p-5">
      <div className="flex items-center justify-between">
        <p className="f-mono text-[0.6rem] text-[var(--f-ink-faint)]">
          Settlement
        </p>
        <p className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.12em] text-[#3f7d1e]">
          <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
          FINAL
        </p>
      </div>
      <p className="f-display mt-4 text-4xl">0.8s</p>
      <p className="mt-1 text-[0.72rem] text-[var(--f-ink-dim)]">
        intent → finality, MXN corridor
      </p>
      <div className="mt-4 space-y-2 border-t border-[var(--f-line)] pt-4">
        {[
          ["14:02:11", "Intent parsed"],
          ["14:02:11", "Route locked — USDC"],
          ["14:02:12", "Value settled"],
        ].map(([t, e]) => (
          <div key={e} className="flex items-baseline gap-3">
            <span className="font-mono text-[0.6rem] text-[var(--f-ink-faint)]">
              {t}
            </span>
            <span className="text-[0.78rem] text-[var(--f-ink)]">{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Live activity feed — used in the feature split. */
export function FeedMock() {
  const events = [
    {
      time: "14:02:11",
      text: "Intent parsed — 42 payouts, 3 corridors",
      tone: "dim",
    },
    {
      time: "14:02:12",
      text: "Route locked — USDC · est. fee 0.12%",
      tone: "dim",
    },
    {
      time: "14:02:13",
      text: "38 payouts settled — final in 0.8s",
      tone: "good",
    },
    {
      time: "14:02:13",
      text: "1 anomalous outflow held for review — 120ms",
      tone: "warn",
    },
  ];
  return (
    <div className="f-console-dark w-[min(88vw,26rem)] rounded-[1.5rem] p-5 text-left md:p-6">
      <div className="flex items-center justify-between">
        <p className="f-mono text-[0.6rem] text-[var(--f-cream-faint)]">
          Activity
        </p>
        <p className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.14em] text-[var(--f-cream-dim)]">
          <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
          STREAMING
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {events.map((e) => (
          <div key={e.text} className="flex items-start gap-3">
            <span className="pt-0.5 font-mono text-[0.6rem] text-[var(--f-cream-faint)]">
              {e.time}
            </span>
            <span
              className={`text-[0.8rem] leading-snug ${
                e.tone === "good"
                  ? "text-[var(--f-lime)]"
                  : e.tone === "warn"
                    ? "text-[#ffb38a]"
                    : "text-[var(--f-cream-dim)]"
              }`}
            >
              {e.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
