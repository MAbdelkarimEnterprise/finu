import type { ReactNode } from "react";
import { Reveal } from "./TextReveal";

type Tone = "ink" | "cream";

/**
 * Full-bleed rounded scene card: mono eyebrow, big light headline,
 * optional CTA, and an optional product visual anchored to the bottom.
 * The workhorse layout of the page.
 */
export default function Highlight({
  id,
  scene,
  tone = "cream",
  eyebrow,
  title,
  cta,
  children,
  tall = true,
}: {
  id?: string;
  scene: string;
  tone?: Tone;
  eyebrow?: string;
  title: string;
  cta?: ReactNode;
  children?: ReactNode;
  tall?: boolean;
}) {
  const ink = tone === "ink";
  return (
    <section id={id} className="scroll-mt-24 py-[var(--f-gutter)]">
      <div
        className={`f-scene f-scene-grain ${scene} flex flex-col ${
          tall ? "min-h-[92svh]" : "min-h-[62svh]"
        } ${ink ? "text-[var(--f-ink)]" : "text-[var(--f-cream)]"}`}
      >
        <div className="relative z-10 px-6 pt-12 md:px-14 md:pt-16">
          {eyebrow && (
            <Reveal>
              <p
                className={`f-eyebrow mb-7 ${
                  ink ? "text-[var(--f-ink-dim)]" : "text-[var(--f-cream-dim)]"
                }`}
              >
                {eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <h2 className="f-display max-w-2xl text-balance text-[clamp(2.2rem,4.8vw,4rem)]">
              {title}
            </h2>
          </Reveal>
          {cta && (
            <Reveal delay={0.25}>
              <div className="mt-9">{cta}</div>
            </Reveal>
          )}
        </div>

        {children && (
          <div className="relative z-10 mt-auto flex justify-center px-4 pt-16">
            <Reveal y={60} className="translate-y-6 md:translate-y-8">
              {children}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
