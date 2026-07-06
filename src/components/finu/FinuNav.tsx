"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { APP_URL, LANGUAGES, NAV_GROUPS } from "./links";
import MagneticButton from "./MagneticButton";
import ProductExplorer from "./ProductExplorer";
import { setScrollLocked } from "./SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

function DesktopDropdown({
  group,
  open,
  onToggle,
  onClose,
}: {
  group: (typeof NAV_GROUPS)[number];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => !open && onToggle()}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className="f-navlink text-[0.86rem]"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {group.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="f-dropdown absolute left-0 top-full z-50 mt-2 min-w-[15rem] py-2"
            role="menu"
          >
            {group.items.map((item) =>
              item.disabled ? (
                <span
                  key={item.label}
                  className="f-dropdown-item"
                  aria-disabled="true"
                  role="menuitem"
                >
                  {item.label}
                  <span className="f-mono ml-auto text-[0.55rem] text-[var(--f-text-faint)]">
                    Soon
                  </span>
                </span>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="f-dropdown-item"
                  role="menuitem"
                >
                  {item.label}
                </a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* The redesigned site ships English content only, so the selector is
   honest about it: other languages are listed but marked unavailable
   rather than pretending to switch. */
function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const lang = "en";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="f-navlink text-[0.82rem]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${active.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="f-mono text-[0.68rem]">{active.code.toUpperCase()}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="f-dropdown absolute right-0 top-full z-50 mt-2 max-h-[60vh] min-w-[11rem] overflow-y-auto py-2"
            role="listbox"
            aria-label="Select language"
          >
            {LANGUAGES.map((l) => {
              const current = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={current}
                    aria-disabled={!current}
                    className={`f-dropdown-item w-full ${
                      current ? "!text-[var(--color-text-primary)]" : ""
                    }`}
                    onClick={() => {
                      if (current) setOpen(false);
                    }}
                  >
                    {l.label}
                    {current && (
                      <span
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              );
            })}
            <li
              className="mt-1 border-t border-[var(--f-border-soft)] px-4 pb-1 pt-2 text-[0.62rem] leading-snug text-[var(--f-text-faint)]"
              role="presentation"
            >
              This site is English-only. All languages are available in the
              Finu app.
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FinuNav() {
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const explorerTriggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const lastExplorerTrigger = useRef<HTMLButtonElement | null>(null);

  const openExplorer = useCallback((trigger: HTMLButtonElement | null) => {
    lastExplorerTrigger.current = trigger;
    setOpenGroup(null);
    setMobileOpen(false);
    setExplorerOpen(true);
  }, []);

  const closeExplorer = useCallback(() => {
    setExplorerOpen(false);
    lastExplorerTrigger.current?.focus();
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const locked = mobileOpen || explorerOpen;
    document.documentElement.style.overflow = locked ? "hidden" : "";
    setScrollLocked(locked);
    return () => {
      document.documentElement.style.overflow = "";
      setScrollLocked(false);
    };
  }, [mobileOpen, explorerOpen]);

  return (
    <motion.header
      initial={reduced ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.15 }}
      className="fixed inset-x-0 top-0 z-50 px-3 md:px-5"
    >
      <div
        className={`relative mx-auto mt-3 flex max-w-[1360px] items-center justify-between gap-4 rounded-2xl border px-4 transition-all duration-700 md:px-5 ${
          scrolled || mobileOpen
            ? "f-nav-glass py-2"
            : "border-transparent bg-transparent py-3.5"
        }`}
      >
        <Link href="/" aria-label="Finu home" className="relative z-10 flex-none">
          <Image
            src="/images/finu-logo.png"
            alt="Finu"
            width={96}
            height={28}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="relative z-10 hidden items-center gap-6 lg:flex"
        >
          <button
            ref={explorerTriggerRef}
            type="button"
            className="f-navlink text-[0.88rem]"
            aria-haspopup="dialog"
            aria-expanded={explorerOpen}
            onClick={() => openExplorer(explorerTriggerRef.current)}
          >
            <span className="f-nav-glyph" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            Products
          </button>
          {NAV_GROUPS.map((group) => (
            <DesktopDropdown
              key={group.label}
              group={group}
              open={openGroup === group.label}
              onToggle={() =>
                setOpenGroup((g) => (g === group.label ? null : group.label))
              }
              onClose={() => setOpenGroup(null)}
            />
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 md:gap-3">
          <div className="hidden lg:block">
            <LanguageMenu />
          </div>
          <MagneticButton
            href={APP_URL}
            className="f-btn f-btn-primary hidden !min-h-[44px] !px-5 !py-2 text-sm sm:inline-flex"
          >
            Get App
          </MagneticButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--f-border-soft)] text-[var(--color-text-primary)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="finu-mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="finu-mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="f-dropdown mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[1360px] overflow-y-auto p-4 lg:hidden"
          >
            <button
              type="button"
              className="mb-5 flex min-h-[48px] w-full items-center justify-between rounded-xl border border-[rgba(79,124,255,0.4)] bg-[rgba(79,124,255,0.1)] px-4 text-[0.92rem] font-medium text-[var(--color-text-primary)]"
              onClick={(e) => openExplorer(e.currentTarget)}
            >
              <span className="flex items-center gap-2.5">
                <span className="f-nav-glyph" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                Explore products
              </span>
              <span className="f-mono text-[0.6rem] text-[var(--color-accent)]">
                7
              </span>
            </button>
            <div className="grid gap-6 sm:grid-cols-2">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="f-mono mb-2 text-[0.6rem] text-[var(--f-text-faint)]">
                    {group.label}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        {item.disabled ? (
                          <span className="f-dropdown-item !px-0" aria-disabled="true">
                            {item.label}
                            <span className="f-mono ml-2 text-[0.55rem] text-[var(--f-text-faint)]">
                              Soon
                            </span>
                          </span>
                        ) : (
                          <a
                            href={item.href}
                            className="f-dropdown-item !px-0"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[var(--f-border-soft)] pt-4">
              <p className="f-mono mb-2 text-[0.6rem] text-[var(--f-text-faint)]">
                Language — this site is English-only; all languages are
                available in the Finu app
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <span
                    key={l.code}
                    className={`rounded-full border border-[var(--f-border-soft)] px-3 py-1.5 text-xs ${
                      l.code === "en"
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--f-text-faint)]"
                    }`}
                  >
                    {l.label}
                  </span>
                ))}
              </div>
              <a
                href={APP_URL}
                className="f-btn f-btn-primary mt-5 w-full"
                onClick={() => setMobileOpen(false)}
              >
                Get App
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <ProductExplorer open={explorerOpen} onClose={closeExplorer} />
    </motion.header>
  );
}
