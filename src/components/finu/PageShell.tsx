"use client";

import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import FinuNav from "./FinuNav";
import Footer from "./Footer";

/**
 * Common chrome for every Finu page: smooth scroll, nav, footer.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="finu min-h-screen">
        <FinuNav />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
