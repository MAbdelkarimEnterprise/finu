"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { APP_URL } from "@/components/finu/links";

const SECTIONS = [
  { label: "Why Finu", href: "#why" },
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
] as const;

/**
 * Landing header: wordmark, four anchor links, one CTA. Smart-sticky —
 * slides away while scrolling down, returns on the first scroll up.
 * The mobile menu is a full-width sheet under the bar; Escape closes
 * it and focus returns to the toggle.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      /* Never hide while the menu is open or near the top. */
      setHidden((prev) => {
        if (open || y < 120) return false;
        const goingDown = y > lastY.current + 6;
        const goingUp = y < lastY.current - 6;
        if (goingDown) return true;
        if (goingUp) return false;
        return prev;
      });
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    /* Move focus into the sheet so keyboard users land on the links. */
    const firstLink = sheetRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 [transition-timing-function:var(--motion-ease)]"
      style={{ transform: hidden ? "translateY(-110%)" : "translateY(0)" }}
    >
      <div className="mx-auto max-w-[1360px] px-3 pt-3 md:px-6 md:pt-4">
        <div
          className={`flex items-center justify-between gap-3 rounded-[var(--radius-pill)] border px-4 py-2 transition-all duration-500 md:px-5 ${
            scrolled || open ? "f-nav-glass border-transparent" : "border-transparent"
          }`}
        >
          <Link href="/" aria-label="Finu home" className="flex items-center">
            <Image
              src="/images/finu-logo.png"
              alt="Finu"
              width={96}
              height={28}
              priority
              className="h-6 w-auto md:h-7"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {SECTIONS.map((item) => (
              <a key={item.href} href={item.href} className="f-navlink text-[0.9rem]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={APP_URL}
              className="f-btn f-btn-primary !min-h-[42px] !px-5 !text-[0.88rem]"
            >
              Get Finu
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-text)] md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? close() : setOpen(true))}
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <div
          id="mobile-menu"
          ref={sheetRef}
          hidden={!open}
          className="f-nav-glass mt-2 rounded-3xl border border-transparent p-4 md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {SECTIONS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-[48px] items-center rounded-xl px-3 text-[1.05rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-raised)]"
                onClick={() => close(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={APP_URL}
            className="f-btn f-btn-primary mt-3 w-full"
            onClick={() => close(false)}
          >
            Get Finu free
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}
