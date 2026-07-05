import Link from "next/link";
import { Reveal } from "./TextReveal";
import { RouteMock } from "./mockups";

/**
 * Two doorway cards: deeper reading on how the platform works and on
 * the market it's built on.
 */
export default function SideBySide() {
  return (
    <section className="grid gap-[var(--f-gutter)] px-[var(--f-gutter)] py-[var(--f-gutter)] md:grid-cols-2">
      <Reveal className="h-full">
        <a
          href="#platform"
          className="group block h-full"
          aria-label="How Finu works — jump to the orchestration section"
        >
          <div className="f-scene f-scene-grain f-scene-sky !mx-0 flex h-[24rem] items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[0.99] md:h-[28rem]">
            <div className="scale-90 transition-transform duration-700 group-hover:scale-95">
              <RouteMock />
            </div>
          </div>
          <div className="px-2 py-6 text-center">
            <h3 className="f-display text-lg md:text-xl">How Finu works</h3>
            <p className="mt-1 text-[0.85rem] text-[var(--f-ink-dim)]">
              Inside the orchestration engine.
            </p>
          </div>
        </a>
      </Reveal>

      <Reveal delay={0.12} className="h-full">
        <Link
          href="/company"
          className="group block h-full"
          aria-label="Finu in numbers — visit the company page"
        >
          <div className="f-scene f-scene-grain f-scene-dusk !mx-0 flex h-[24rem] items-center justify-center transition-transform duration-700 ease-out group-hover:scale-[0.99] md:h-[28rem]">
            <p className="f-display px-8 text-center text-[clamp(2.6rem,5vw,4rem)] text-[var(--f-cream)]">
              $190T
              <span className="text-[var(--f-cream-faint)]">+</span>
            </p>
          </div>
          <div className="px-2 py-6 text-center">
            <h3 className="f-display text-lg md:text-xl">Finu in numbers</h3>
            <p className="mt-1 text-[0.85rem] text-[var(--f-ink-dim)]">
              The market we&apos;re building on.
            </p>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
