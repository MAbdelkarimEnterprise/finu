"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { FINU_PRODUCTS } from "./products";
import ProductExplorerTile from "./ProductExplorerTile";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen product explorer, opened from the navigation. One tile
 * at a time becomes the focal point (sharp, lifted) while siblings
 * soften; pointer leave restores the neutral grid. Fully keyboard
 * operable: focus is trapped, Escape closes, focus returns to the
 * trigger (handled by the caller via onClose).
 */
export default function ProductExplorer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* Scroll locking lives with the caller (FinuNav) so the mobile
     menu and the explorer never fight over the same lock. */
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement;
        if (event.shiftKey && (current === first || !panel.contains(current))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);

    const focusTimer = setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("a[href]")
        ?.focus({ preventScroll: true });
    }, 120);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey, true);
      setActiveId(null);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="f-explorer-backdrop fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Explore Finu products"
        >
          <motion.div
            ref={panelRef}
            initial={reduced ? false : { opacity: 0, y: -28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -18, scale: 0.99 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto flex h-full w-full max-w-[1360px] flex-col overflow-y-auto px-4 pb-8 pt-5 md:px-8"
          >
            <div className="mb-5 flex flex-none items-center justify-between">
              <p className="f-eyebrow" data-pulse="true">
                Explore Finu
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product explorer"
                className="grid h-11 w-11 place-items-center rounded-full border border-[var(--f-border-soft)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:border-[rgba(79,124,255,0.6)] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-4.5 w-4.5" aria-hidden />
              </button>
            </div>

            <div
              className="f-explorer-grid flex-1"
              data-has-active={activeId !== null}
              onPointerLeave={() => setActiveId(null)}
            >
              {FINU_PRODUCTS.map((product) => (
                <ProductExplorerTile
                  key={product.id}
                  product={product}
                  big={product.id === "finu-ai"}
                  state={
                    activeId === null
                      ? "idle"
                      : activeId === product.id
                        ? "active"
                        : "dim"
                  }
                  onActivate={() => setActiveId(product.id)}
                  onDeactivate={() =>
                    setActiveId((id) => (id === product.id ? null : id))
                  }
                  onNavigate={onClose}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
