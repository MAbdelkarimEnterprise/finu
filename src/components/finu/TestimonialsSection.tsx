import { ArrowUpRight, Quote } from "lucide-react";
import { LINKS } from "./links";
import Eyebrow from "./Eyebrow";
import { Reveal, TextReveal } from "./TextReveal";

/* Community quotes shown on meetfinu.com, verbatim. */
const TESTIMONIALS = [
  {
    quote: "The experience with Finu is really amazing for me. Thanks for the support.",
    source: "Telegram",
  },
  {
    quote: "Finu is so smooth, from fueling up my ride to late night online hauls!",
    source: "@sean*** from X",
  },
  {
    quote: "Finu crypto card is my go to card for any payment online.",
    source: "@juli*** from X",
  },
  {
    quote:
      "I’ve tried several crypto cards over the years and Finu is hands down the BEST once I’ve ever used!",
    source: "Telegram",
  },
  {
    quote: "Top class customer service, resolves issues within reasonable time frame.",
    source: "@bree*** from X",
  },
  {
    quote: "Finu turned an ordinary day into something unforgettable.",
    source: "User who won iPhone 16 Pro from a promotion activity",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="f-scrim scroll-mt-24 f-section"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow>Community</Eyebrow>
        </Reveal>
        <TextReveal
          as="h2"
          className="f-display mt-5 max-w-xl text-[clamp(2rem,4.4vw,3.2rem)]"
        >
          Hear from Our Community
        </TextReveal>
        <span id="community-title" className="sr-only">
          Hear from our community
        </span>

        {/* Two auto-panning rows drifting opposite ways; pauses on
            hover/focus, static overflow-scroll under reduced motion.
            The duplicated halves are aria-hidden so screen readers
            get each quote once. */}
        {[TESTIMONIALS.slice(0, 3), TESTIMONIALS.slice(3)].map((row, r) => (
          <div
            key={r}
            className={`f-marquee ${r === 0 ? "mt-14" : "mt-5"}`}
            style={
              { "--f-pan-duration": r === 0 ? "58s" : "74s" } as React.CSSProperties
            }
          >
            <div
              className="f-marquee-track gap-5 pr-5"
              style={r === 1 ? { animationDirection: "reverse" } : undefined}
            >
              {[...row, ...row].map((t, i) => (
                <figure
                  key={i}
                  aria-hidden={i >= row.length}
                  className="f-card flex w-[20rem] flex-none flex-col justify-between gap-5 p-6 md:w-[24rem]"
                >
                  <div>
                    <Quote
                      className="h-5 w-5 text-[var(--color-primary)]"
                      aria-hidden
                    />
                    <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-text-primary)]">
                      {t.quote}
                    </blockquote>
                  </div>
                  <figcaption className="text-[0.76rem] text-[var(--f-text-faint)]">
                    — {t.source}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}

        <Reveal className="mt-10 text-center">
          <a
            href={LINKS.news}
            className="group inline-flex min-h-[44px] items-center gap-1.5 text-[0.9rem] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
          >
            See more
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
