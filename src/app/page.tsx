import type { Metadata } from "next";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";
import PageShell from "@/components/finu/PageShell";
import Hero from "@/components/finu/Hero";
import LogoWall from "@/components/finu/LogoWall";
import Manifesto from "@/components/finu/Manifesto";
import WhyStablecoins from "@/components/finu/WhyStablecoins";
import Features from "@/components/finu/Features";
import NumbersStory from "@/components/finu/NumbersStory";
import Infrastructure from "@/components/finu/Infrastructure";

export const metadata: Metadata = {
  // Title falls through to the root layout default (no template suffix).
  description:
    "Intelligent global payments powered by AI, programmable finance, and stablecoin infrastructure.",
};

export default function HomePage() {
  return (
    <div className={finuFontClass}>
      <PageShell>
        <Hero />
        <LogoWall />
        <Manifesto />
        <WhyStablecoins />
        <Features />
        <NumbersStory />
        <Infrastructure />
      </PageShell>
    </div>
  );
}
