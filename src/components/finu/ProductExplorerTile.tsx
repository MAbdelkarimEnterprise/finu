"use client";

import { forwardRef } from "react";
import type { FinuProduct } from "./products";
import ProductGlyph, { DottedArrow } from "./ProductGlyph";

type TileState = "idle" | "active" | "dim";

/**
 * One explorer tile: a real link with the sharp-vs-soft focus
 * choreography driven by data-state (set by the parent focus field).
 * The local light follows the pointer via --px/--py (direct style
 * writes, no React state per move).
 */
const ProductExplorerTile = forwardRef<
  HTMLAnchorElement,
  {
    product: FinuProduct;
    state: TileState;
    big?: boolean;
    onActivate: () => void;
    onDeactivate: () => void;
    onNavigate: () => void;
  }
>(function ProductExplorerTile(
  { product, state, big = false, onActivate, onDeactivate, onNavigate },
  ref
) {
  return (
    <a
      ref={ref}
      href={product.href}
      data-state={state}
      className={`f-explorer-tile f-x-${product.id} group ${
        big ? "f-explorer-tile-big" : ""
      }`}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") onActivate();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") onDeactivate();
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--px",
          `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`
        );
        e.currentTarget.style.setProperty(
          "--py",
          `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`
        );
      }}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={onNavigate}
    >
      <span className="f-explorer-glyph" aria-hidden>
        <ProductGlyph id={product.id} />
      </span>

      <span className="mt-auto block">
        <span className="f-mono block text-[0.58rem] text-[var(--color-accent)]">
          {product.label}
        </span>
        <span
          className={`f-display mt-2 block text-[var(--color-text-primary)] ${
            big ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
        >
          {product.title}
        </span>
        {big && (
          <span className="mt-3 block max-w-sm text-[0.88rem] leading-relaxed text-[var(--color-text-secondary)]">
            {product.body}
          </span>
        )}
      </span>

      <span className="f-explorer-action" aria-hidden>
        <DottedArrow />
      </span>
    </a>
  );
});

export default ProductExplorerTile;
