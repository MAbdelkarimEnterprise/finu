"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";
import FinuNav from "./FinuNav";
import Footer from "./Footer";

/* The dive layers are pure decoration — lazy, client-only, never
   part of LCP. */
const OceanBackdrop = dynamic(() => import("../effects/OceanBackdrop"), {
  ssr: false,
});
const OceanLayers = dynamic(() => import("../effects/OceanLayers"), {
  ssr: false,
});

/**
 * Common chrome for every Finu page: smooth scroll, nav, footer —
 * and the ocean. The backdrop crossfades from surface to seabed as
 * the visitor scrolls; the layers drift over it, behind the content.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <div className="finu relative min-h-screen">
        <OceanBackdrop />
        <OceanLayers />
        <FinuNav />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
