import type { ReactNode } from "react";
import { TextReveal, Reveal } from "./TextReveal";

/**
 * Centered editorial statement between scene cards: headline, optional
 * supporting line, optional CTA. The Cleo-style "breathing room" beat
 * in the page rhythm.
 */
export default function Statement({
  title,
  as = "h2",
  sub,
  children,
  size = "lg",
  id,
}: {
  title: string;
  as?: "h1" | "h2";
  sub?: string;
  children?: ReactNode;
  size?: "lg" | "md";
  id?: string;
}) {
  return (
    <section
      id={id}
      className="mx-auto flex min-h-[52svh] max-w-4xl scroll-mt-24 flex-col items-center justify-center px-6 py-24 text-center md:py-32"
    >
      <TextReveal
        as={as}
        className={`f-display text-balance ${
          size === "lg"
            ? "text-[clamp(2.4rem,5.6vw,4.6rem)]"
            : "text-[clamp(1.9rem,4vw,3.2rem)]"
        }`}
      >
        {title}
      </TextReveal>
      {sub && (
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-md text-balance text-[0.95rem] leading-relaxed text-[var(--f-ink-dim)] md:text-base">
            {sub}
          </p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        </Reveal>
      )}
    </section>
  );
}
