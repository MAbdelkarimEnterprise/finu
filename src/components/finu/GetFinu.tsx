import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, TextReveal } from "./TextReveal";

/**
 * Closing conversion beat: one big invitation, one primary action,
 * one lower-commitment path.
 */
export default function GetFinu() {
  return (
    <section className="relative mx-auto grid max-w-[1300px] items-center gap-14 px-6 py-28 md:grid-cols-[1fr_auto] md:py-40 md:px-10">
      <div className="text-center md:text-left">
        <TextReveal
          as="h2"
          className="f-display text-balance text-[clamp(2.4rem,5vw,4.2rem)]"
        >
          Put Finu to work.
        </TextReveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a href="https://app.meetfinu.com" className="f-btn f-btn-dark group">
              Open Finu
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link href="/company" className="f-btn f-btn-light">
              Meet the company
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Tilted product chip — the "scan me" moment, minus the QR */}
      <Reveal delay={0.3} className="hidden justify-self-center md:block">
        <div
          aria-hidden
          className="f-console w-56 rotate-6 rounded-[1.6rem] p-6 shadow-[0_30px_70px_-24px_rgba(33,29,25,0.4)]"
        >
          <p className="f-display text-2xl">
            finu<span className="text-[#79a625]">.</span>
          </p>
          <p className="mt-2 text-[0.72rem] leading-relaxed text-[var(--f-ink-dim)]">
            The AI layer for money in motion.
          </p>
          <p className="mt-5 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.14em] text-[var(--f-ink-faint)]">
            <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
            APP.MEETFINU.COM
          </p>
        </div>
      </Reveal>
    </section>
  );
}
