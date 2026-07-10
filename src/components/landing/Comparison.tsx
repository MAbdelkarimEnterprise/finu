"use client";

import { Check, Minus, X } from "lucide-react";
import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import Eyebrow from "@/components/finu/Eyebrow";
import { COMPARISON } from "@/lib/landing-content";

function Mark({ value }: { value: string }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[var(--color-positive)]">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">{COMPARISON.legend.yes}</span>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)]/60">
        <X className="h-4 w-4" aria-hidden />
        <span className="sr-only">{COMPARISON.legend.no}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[0.72rem] text-[var(--color-text-muted)]">
      <Minus className="h-3.5 w-3.5" aria-hidden />
      {value === "some" ? COMPARISON.legend.some : COMPARISON.legend.manual}
    </span>
  );
}

/**
 * Playful-but-fair comparison. A real table (screen readers get the
 * grid), horizontally scrollable on small screens, Finu column gently
 * highlighted.
 */
export default function Comparison() {
  return (
    <section
      id="compare"
      aria-labelledby="compare-title"
      className="scroll-mt-24 bg-[var(--color-bg-alt)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1080px]">
        <div className="max-w-2xl">
          <Eyebrow>{COMPARISON.eyebrow}</Eyebrow>
          <TextReveal as="h2" className="f-display mt-5 text-[length:var(--text-display)]">
            {COMPARISON.headline}
          </TextReveal>
          <span id="compare-title" className="sr-only">
            {COMPARISON.headline}
          </span>
          <Reveal delay={0.15}>
            <p className="mt-4 text-[length:var(--text-body-lg)] leading-relaxed text-[var(--color-text-muted)]">
              {COMPARISON.subhead}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 overflow-x-auto rounded-[var(--radius-lg)] border border-[rgba(7,21,47,0.08)] bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th scope="col" className="px-5 py-4 text-[0.78rem] font-medium text-[var(--color-text-muted)]">
                    <span className="sr-only">Capability</span>
                  </th>
                  {COMPARISON.columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={`px-5 py-4 text-[0.88rem] font-semibold ${
                        i === 0
                          ? "rounded-t-xl bg-[rgba(29,59,255,0.06)] text-[var(--color-accent)]"
                          : "text-[var(--color-text)]"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((row, r) => (
                  <tr
                    key={row.label}
                    className={r < COMPARISON.rows.length - 1 ? "border-b border-[var(--color-border)]" : ""}
                  >
                    <th scope="row" className="px-5 py-4 text-[0.85rem] font-medium text-[var(--color-text)]">
                      {row.label}
                    </th>
                    {row.values.map((value, c) => (
                      <td
                        key={c}
                        className={`px-5 py-4 ${c === 0 ? "bg-[rgba(29,59,255,0.06)]" : ""}`}
                      >
                        <Mark value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-5 text-[0.8rem] italic text-[var(--color-text-muted)]">
            {COMPARISON.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
