import Image from "next/image";
import Link from "next/link";
import { APP_URL, LINKS, NAV_GROUPS } from "./links";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="px-5 pb-8 md:px-8">
      {/* Footnote — the interface visuals above are examples */}
      <div className="mx-auto max-w-[1200px] px-1 pb-8">
        <p className="text-[0.68rem] leading-relaxed text-[var(--f-text-faint)]">
          Interface visuals on this page are illustrative product examples.
        </p>
      </div>

      <div className="mx-auto max-w-[1200px] rounded-[var(--f-radius)] border border-[var(--f-border-soft)] bg-[var(--color-surface)]">
        <div className="grid gap-12 p-8 md:grid-cols-[1fr_2fr] md:p-12">
          <div>
            <Link href="/" aria-label="Finu home" className="inline-block">
              <Image
                src="/images/finu-logo.png"
                alt="Finu"
                width={110}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <p className="f-display mt-6 max-w-xs text-xl text-[var(--color-text-secondary)]">
              Money talks. Finu talks back.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href={LINKS.news}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finu on X"
                className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--f-border-soft)] text-[var(--color-text-secondary)] transition-colors hover:border-[rgba(79,124,255,0.6)] hover:text-[var(--color-text-primary)]"
              >
                <XLogo className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:grid-cols-5"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="space-y-3">
                <p className="f-mono text-[0.6rem] text-[var(--f-text-faint)]">
                  {group.label}
                </p>
                {group.items.map((item) =>
                  item.disabled ? (
                    <span
                      key={item.label}
                      className="block w-fit text-[var(--f-text-faint)]"
                      aria-disabled="true"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block w-fit text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--f-border-soft)] p-8 sm:flex-row sm:items-center sm:justify-between md:px-12 md:py-6">
          <p className="text-xs text-[var(--f-text-faint)]">
            Copyright © {new Date().getFullYear()} Finu All Rights Reserved
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <a
              href={LINKS.terms}
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Terms & Conditions
            </a>
            <a
              href={LINKS.privacy}
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Privacy Policy
            </a>
            <a
              href={APP_URL}
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Download App
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
