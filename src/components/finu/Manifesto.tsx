"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Money is becoming software.",
  "Value should move like information —",
  "instantly, globally, intelligently.",
  "Finu is the operating layer for that world.",
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
    <section id="platform" ref={root} className="relative flex min-h-screen items-center">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="f-display text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.12]">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi) => (
                <span
                  key={wi}
                  className={`manifesto-word mr-[0.28em] inline-block will-change-transform ${
                    li === 3 ? "f-gradient-text" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
