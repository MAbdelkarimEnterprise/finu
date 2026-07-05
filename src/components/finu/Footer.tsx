"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { TextReveal, Reveal } from "./TextReveal";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Closing CTA */}
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 text-center md:px-10 md:py-44">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(110,123,255,0.5), rgba(160,123,255,0.25), transparent)",
          }}
        />
        <TextReveal
          as="h2"
          className="f-display mx-auto max-w-4xl text-[clamp(2.6rem,6.5vw,5.5rem)]"
        >
          The future of money is programmable.
        </TextReveal>
        <Reveal delay={0.3}>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Magnetic>
              <a href="#" className="f-btn f-btn-primary group">
                Get Started
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/company" className="f-btn f-btn-ghost">
                Finu in Numbers
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <div className="f-hairline" />

      {/* Footer proper */}
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Link href="/" className="f-display text-2xl tracking-tight">
            finu<span className="text-[var(--f-mint)]">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--f-ink-faint)]">
            Intelligent global payments powered by AI, programmable finance,
            and stablecoin infrastructure.
          </p>
        </div>

        <nav className="flex gap-14 text-sm">
          <div className="space-y-3">
            <p className="f-eyebrow !text-[0.65rem]">Product</p>
            <a href="/#platform" className="f-navlink block w-fit">Platform</a>
            <a href="/#features" className="f-navlink block w-fit">Features</a>
          </div>
          <div className="space-y-3">
            <p className="f-eyebrow !text-[0.65rem]">Company</p>
            <Link href="/company" className="f-navlink block w-fit">In Numbers</Link>
            <a href="#" className="f-navlink block w-fit">Careers</a>
          </div>
        </nav>

        <p className="text-xs text-[var(--f-ink-faint)]">
          © {new Date().getFullYear()} Finu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
