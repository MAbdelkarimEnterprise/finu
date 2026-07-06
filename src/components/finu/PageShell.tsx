"use client";

import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import FinuNav from "./FinuNav";
import Footer from "./Footer";
import PointerGlow from "./PointerGlow";

/**
 * Common chrome for every Finu page: smooth scroll, nav, footer,
 * and the desktop-only ambient cursor light.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="finu min-h-screen">
        <FinuNav />
        <PointerGlow />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
