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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.quote} delay={(i % 3) * 0.08}>
              <figure className="f-card f-card-hover flex h-full flex-col justify-between gap-6 p-7">
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
            </Reveal>
          ))}
        </div>

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
