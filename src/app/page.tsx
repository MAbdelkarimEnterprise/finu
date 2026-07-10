import type { Metadata } from "next";
import "@/styles/finu.css";
import "@/styles/tokens.css";
import "@/styles/landing.css";
import { finuFontClass } from "@/components/finu/fonts";
import SmoothScroll from "@/components/finu/SmoothScroll";
import Footer from "@/components/finu/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Problem from "@/components/landing/Problem";
import ProductChat from "@/components/landing/ProductChat";
import FeatureBands from "@/components/landing/FeatureBands";
import Comparison from "@/components/landing/Comparison";
import Testimonials from "@/components/landing/Testimonials";
import LandingFAQ from "@/components/landing/LandingFAQ";
import FinalCTA from "@/components/landing/FinalCTA";

export const metadata: Metadata = {
  // Title falls through to the root layout default (no template suffix).
  description:
    "Finu is your money companion. Plain-English spending insights, a bill radar, a subscription catcher, and a cash-flow forecast that finally makes payday make sense.",
};

export default function HomePage() {
  return (
    <div className={finuFontClass}>
      <SmoothScroll>
        <div className="finu min-h-screen">
          <Header />
          <main>
            <Hero />
            <TrustStrip />
            <Problem />
            <ProductChat />
            <FeatureBands />
            <Comparison />
            <Testimonials />
            <LandingFAQ />
            <FinalCTA />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </div>
  );
}
