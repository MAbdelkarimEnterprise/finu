import type { Metadata } from "next";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";
import PageShell from "@/components/finu/PageShell";
import Hero from "@/components/finu/Hero";
import AppShowcase from "@/components/finu/AppShowcase";
import CardsSection from "@/components/finu/CardsSection";
import ProductTabs from "@/components/finu/ProductTabs";
import PartnersSection from "@/components/finu/PartnersSection";
import MetricsSection from "@/components/finu/MetricsSection";
import TestimonialsSection from "@/components/finu/TestimonialsSection";
import FAQ from "@/components/finu/FAQ";
import FinalCTA from "@/components/finu/FinalCTA";
import DataPath from "@/components/finu/DataPath";
import ParticleNarrative from "@/components/finu/ParticleNarrative";

export const metadata: Metadata = {
  // Title falls through to the root layout default (no template suffix).
  description:
    "Finu analyzes your spending, calls out bad habits, and makes you better at money. Pay, transfer, save, and manage stablecoins with intelligence built in.",
};

export default function HomePage() {
  return (
    <div className={finuFontClass}>
      <PageShell>
        <Hero />
        <DataPath height={104} className="-mb-6" />
        <AppShowcase />
        <CardsSection />
        <ProductTabs />
        <ParticleNarrative />
        <DataPath height={104} className="-my-4" />
        <PartnersSection />
        <div className="f-seam" aria-hidden />
        <MetricsSection />
        <TestimonialsSection />
        <div className="f-seam" aria-hidden />
        <FAQ />
        <FinalCTA />
      </PageShell>
    </div>
  );
}
