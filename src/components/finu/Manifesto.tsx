"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "The financial system",
  "wasn't built",
  "for AI.",
];

/**
 * Pinned manifesto: the section locks in place while each word is
 * scrubbed from faint to full ink as the reader scrolls through it.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");
      gsap.fromTo(
        words,
        { opacity: 0.12, filter: "blur(3px)", y: 8 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="thesis"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_75%_45%,rgba(110,123,255,0.14),transparent_32%)]" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex items-center justify-between">
          <p className="f-eyebrow">01 / The problem</p>
          <p className="hidden max-w-[15rem] text-right text-xs leading-relaxed text-[var(--f-ink-faint)] md:block">
            Legacy rails were designed for institutions, batch files, and business hours.
          </p>
        </div>
        <p className="f-display text-[clamp(3.5rem,8.5vw,8.6rem)] leading-[0.9]">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi) => (
                <span
                  key={wi}
                  className={`manifesto-word mr-[0.28em] inline-block will-change-transform ${
                    li === 2 ? "f-gradient-text" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className="mt-16 grid gap-8 border-t border-[var(--f-line)] pt-8 text-sm text-[var(--f-ink-dim)] md:grid-cols-3">
          <p>Slow settlement creates trapped capital.</p>
          <p>Fragmented rails create unnecessary cost.</p>
          <p>Static systems cannot act on intent.</p>
        </div>
      </div>
    </section>
  );
}
