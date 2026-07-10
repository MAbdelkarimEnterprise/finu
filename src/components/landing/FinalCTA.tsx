"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, TextReveal } from "@/components/finu/TextReveal";
import MagneticButton from "@/components/finu/MagneticButton";
import { APP_URL } from "@/components/finu/links";
import { FINAL_CTA } from "@/lib/landing-content";

/**
 * The closer: navy band, the brand line, one button. The animated
 * light frame comes from the existing .f-cta-frame utility.
 */
export default function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-title" className="px-5 pb-24 pt-4 md:px-8 md:pb-32">
      <div className="f-cta-frame mx-auto max-w-[1200px] overflow-hidden rounded-[calc(var(--radius-lg)+12px)] bg-[#0b1530] px-6 py-20 text-center text-white md:py-28">
        <TextReveal
          as="h2"
          className="f-display mx-auto max-w-3xl text-[clamp(2.2rem,5.4vw,4rem)]"
        >
          {FINAL_CTA.headline}
        </TextReveal>
        <span id="final-cta-title" className="sr-only">
          {FINAL_CTA.headline}
        </span>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton
              href={APP_URL}
              className="f-btn f-btn-primary group !min-h-[54px] !px-9 !text-[1.02rem]"
            >
              {FINAL_CTA.cta}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-6 text-[0.82rem] text-white/60">{FINAL_CTA.reassurance}</p>
        </Reveal>
      </div>
    </section>
  );
}
