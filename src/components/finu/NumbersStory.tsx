"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    value: 190,
    prefix: "$",
    suffix: "T+",
    lead: "moves through global payments",
    tail: "annually",
  },
  {
    value: 230,
    prefix: "$",
    suffix: "B+",
    lead: "already exists",
    tail: "in stablecoins",
  },
  {
    literal: "Seconds",
    lead: "to settle transactions",
    tail: "globally",
  },
  {
    literal: "AI",
    lead: "becomes the orchestration",
    tail: "layer",
  },
];

export default function NumbersStory() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".f-number-panel");
      const dots = gsap.utils.toArray<HTMLElement>(".f-number-dot");
      const progress = root.current?.querySelector<HTMLElement>(".f-number-progress");

      gsap.set(panels, {
        autoAlpha: 0,
        y: 80,
        filter: "blur(16px)",
        scale: 0.96,
      });
      gsap.set(panels[0], {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
      });
      gsap.set(dots[0], { backgroundColor: "#c8ff3d", scale: 1.35 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.6}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (progress) {
        timeline.fromTo(
          progress,
          { scaleY: 0 },
          { scaleY: 1, duration: CHAPTERS.length * 2.2, ease: "none" },
          0
        );
      }

      CHAPTERS.forEach((chapter, index) => {
        const panel = panels[index];
        const counter = panel.querySelector<HTMLElement>("[data-count]");
        const enterAt = index * 2.2;

        if (index > 0) {
          timeline.to(
            panels[index - 1],
            {
              autoAlpha: 0,
              y: -70,
              scale: 1.04,
              filter: "blur(16px)",
              duration: 0.72,
              ease: "power2.inOut",
            },
            enterAt
          );
          timeline.to(
            dots[index - 1],
            { backgroundColor: "rgba(245,245,248,0.2)", scale: 1, duration: 0.3 },
            enterAt
          );
          timeline.fromTo(
            panel,
            {
              autoAlpha: 0,
              y: 80,
              scale: 0.96,
              filter: "blur(16px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.82,
              ease: "power3.out",
            },
            enterAt + 0.32
          );
          timeline.to(
            dots[index],
            { backgroundColor: "#c8ff3d", scale: 1.35, duration: 0.3 },
            enterAt + 0.45
          );
        }

        if (counter && chapter.value) {
          const state = { value: 0 };
          timeline.to(
            state,
            {
              value: chapter.value,
              duration: 1,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = Math.round(state.value).toString();
              },
            },
            enterAt + (index === 0 ? 0.1 : 0.4)
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="numbers"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden border-y border-[var(--f-line)] bg-[var(--f-bg-raise)]"
    >
      <div className="f-number-grid absolute inset-0 opacity-30" />
      <div className="absolute left-[8%] top-1/2 hidden h-[38vh] w-px -translate-y-1/2 bg-white/10 md:block">
        <div className="f-number-progress h-full w-full origin-top bg-[var(--f-lime)]" />
      </div>

      <div className="relative mx-auto h-screen w-full max-w-[1400px] px-6 md:px-10">
        <div className="absolute inset-x-6 top-24 flex items-center justify-between md:inset-x-10">
          <p className="f-eyebrow">04 / Finu in numbers</p>
          <p className="font-mono text-[0.6rem] tracking-[0.18em] text-[var(--f-ink-faint)]">
            SCROLL TO ADVANCE
          </p>
        </div>

        <div className="relative h-full">
          {CHAPTERS.map((chapter, index) => (
            <article
              key={chapter.lead}
              className="f-number-panel invisible absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <p className="mb-8 font-mono text-[0.62rem] tracking-[0.22em] text-[var(--f-ink-faint)]">
                0{index + 1} / 0{CHAPTERS.length}
              </p>
              <p
                className={`f-display leading-[0.78] ${
                  index === 3
                    ? "f-gradient-text text-[clamp(7rem,24vw,22rem)]"
                    : "text-[clamp(5.5rem,19vw,18rem)]"
                }`}
              >
                {chapter.literal ? (
                  chapter.literal
                ) : (
                  <>
                    {chapter.prefix}
                    <span data-count>0</span>
                    <span className="text-[var(--f-ink-faint)]">{chapter.suffix}</span>
                  </>
                )}
              </p>
              <p className="mt-12 text-[clamp(1.2rem,2.3vw,2rem)] leading-tight text-[var(--f-ink-dim)]">
                {chapter.lead}
                <span className="block text-[var(--f-ink)]">{chapter.tail}</span>
              </p>
            </article>
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-5 md:bottom-16">
          {CHAPTERS.map((chapter, index) => (
            <span
              key={chapter.lead}
              className="f-number-dot h-1.5 w-1.5 rounded-full bg-white/20"
            />
          ))}
          <ArrowDown className="ml-2 h-4 w-4 text-[var(--f-ink-faint)]" />
        </div>
      </div>
    </section>
  );
}
