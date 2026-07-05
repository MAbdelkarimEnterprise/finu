import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./TextReveal";
import { FeedMock } from "./mockups";

/**
 * Split feature beat: product media card on one side, editorial copy
 * and CTA on the other.
 */
export default function FeatureSplit() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 py-24 md:px-10 md:py-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <Reveal>
        <div className="f-scene f-scene-grain f-scene-dusk flex min-h-[26rem] items-center justify-center !mx-0 py-14 md:min-h-[34rem]">
          <FeedMock />
        </div>
      </Reveal>

      <div className="lg:pr-8">
        <Reveal>
          <h2 className="f-display text-balance text-[clamp(2rem,3.6vw,3rem)]">
            Smart rails, smarter decisions.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[var(--f-ink-dim)]">
            Finu is intelligent enough to optimize every transfer — and
            disciplined enough to hold anything that looks wrong before it
            moves.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href="https://app.meetfinu.com"
            className="f-btn f-btn-dark group mt-9"
          >
            Open Finu
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
