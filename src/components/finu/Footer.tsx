import Link from "next/link";

/**
 * Footnotes + the dark rounded footer card, Cleo-style: brand block,
 * tagline, and honest link columns — no dead "#" destinations.
 */
export default function Footer() {
  return (
    <footer className="px-[var(--f-gutter)] pb-[var(--f-gutter)]">
      {/* Footnotes — sources for the figures used above */}
      <div
        id="footnotes"
        className="mx-auto max-w-[1300px] scroll-mt-24 px-4 pb-10 pt-2 md:px-6"
      >
        <p className="text-[0.68rem] leading-relaxed text-[var(--f-ink-faint)]">
          <sup>1</sup> Market figures are third-party industry estimates of
          annual global payment flows and circulating stablecoin supply. They
          describe the market Finu operates in, not Finu transaction volumes.
        </p>
        <p className="mt-1.5 text-[0.68rem] leading-relaxed text-[var(--f-ink-faint)]">
          Interface visuals on this page are illustrative product examples.
        </p>
      </div>

      {/* Dark footer card */}
      <div className="rounded-[var(--f-radius)] bg-[var(--f-footer)] text-[var(--f-cream)]">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-7 py-14 md:grid-cols-[1fr_1.4fr] md:px-12 md:py-20">
          <div>
            <Link
              href="/"
              className="f-display inline-block rounded-full bg-white/10 px-4 py-1.5 text-xl tracking-[-0.04em]"
            >
              finu<span className="text-[var(--f-lime)]">.</span>
            </Link>
            <p className="f-display mt-8 max-w-xs text-2xl md:text-[1.7rem]">
              Finu makes money move smarter.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3"
          >
            <div className="space-y-3">
              <p className="f-mono text-[0.6rem] text-[var(--f-cream-faint)]">
                Product
              </p>
              <a href="/#platform" className="block w-fit text-[var(--f-cream-dim)] transition-colors hover:text-[var(--f-cream)]">
                Platform
              </a>
              <a href="/#numbers" className="block w-fit text-[var(--f-cream-dim)] transition-colors hover:text-[var(--f-cream)]">
                Numbers
              </a>
              <a href="/#faq" className="block w-fit text-[var(--f-cream-dim)] transition-colors hover:text-[var(--f-cream)]">
                FAQ
              </a>
            </div>
            <div className="space-y-3">
              <p className="f-mono text-[0.6rem] text-[var(--f-cream-faint)]">
                Company
              </p>
              <Link href="/company" className="block w-fit text-[var(--f-cream-dim)] transition-colors hover:text-[var(--f-cream)]">
                About Finu
              </Link>
            </div>
            <div className="space-y-3">
              <p className="f-mono text-[0.6rem] text-[var(--f-cream-faint)]">
                Open
              </p>
              <a
                href="https://app.meetfinu.com"
                className="block w-fit text-[var(--f-cream-dim)] transition-colors hover:text-[var(--f-cream)]"
              >
                app.meetfinu.com
              </a>
            </div>
          </nav>
        </div>

        <div className="mx-auto flex max-w-[1300px] items-center justify-between border-t border-white/10 px-7 py-6 md:px-12">
          <p className="text-xs text-[var(--f-cream-faint)]">
            © {new Date().getFullYear()} Finu. All rights reserved.
          </p>
          <p className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.16em] text-[var(--f-cream-faint)]">
            <span className="f-live-dot h-1.5 w-1.5 rounded-full bg-[var(--f-lime)]" />
            SETTLEMENT NEVER SLEEPS
          </p>
        </div>
      </div>
    </footer>
  );
}
