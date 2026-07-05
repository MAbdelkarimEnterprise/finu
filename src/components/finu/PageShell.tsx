"use client";

import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import FinuNav from "./FinuNav";
import Footer from "./Footer";

/**
 * Common chrome for every Finu page: smooth scroll, nav, footer, grain
 * overlay. NOTE: no transform/filter animation on this wrapper — an
 * ancestor filter creates a containing block that breaks GSAP pinning.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="finu f-grain min-h-screen">
        <FinuNav />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
