import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";
import PageShell from "@/components/finu/PageShell";
import Hero from "@/components/finu/Hero";
import Statement from "@/components/finu/Statement";
import Highlight from "@/components/finu/Highlight";
import ImmersivePair from "@/components/finu/ImmersivePair";
import FeatureSplit from "@/components/finu/FeatureSplit";
import FeatureTabs from "@/components/finu/FeatureTabs";
import NumbersSection from "@/components/finu/NumbersSection";
import SkewGallery from "@/components/finu/SkewGallery";
import SideBySide from "@/components/finu/SideBySide";
import FAQ from "@/components/finu/FAQ";
import GetFinu from "@/components/finu/GetFinu";
import { RoutingConsole } from "@/components/finu/mockups";

export const metadata: Metadata = {
  // Title falls through to the root layout default (no template suffix).
  description:
    "Finu is the AI layer that routes, settles, and optimizes money for businesses moving value across borders.",
};

export default function HomePage() {
  return (
    <div className={finuFontClass}>
      <PageShell>
        <Hero />

        <Statement
          as="h1"
          title="Money moves. Finu thinks."
          sub="Finu is the AI layer that routes, settles, and optimizes money for businesses moving value across borders."
        >
          <a href="https://app.meetfinu.com" className="f-btn f-btn-light group">
            Open Finu
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Statement>

        <Highlight
          scene="f-scene-sky"
          tone="ink"
          eyebrow="The intelligence layer for money"
          title="Finu gets to know your money in motion."
        >
          <RoutingConsole />
        </Highlight>

        <ImmersivePair />

        <Statement title="Give every payment a brain of its own." />

        <Highlight
          scene="f-scene-night"
          tone="cream"
          eyebrow="Understand · Route · Settle"
          title="Automate money movement, end to end."
          cta={
            <a href="#platform" className="f-btn f-btn-glass">
              See how routing works
            </a>
          }
          tall={false}
        />

        <FeatureSplit />

        <FeatureTabs />

        <NumbersSection />

        <Highlight
          scene="f-scene-dusk"
          tone="cream"
          title="Finally, financial infrastructure that thinks."
          tall={false}
        />

        <SkewGallery />

        <Statement size="md" title="See what Finu is built on." />

        <SideBySide />

        <FAQ />

        <GetFinu />
      </PageShell>
    </div>
  );
}
