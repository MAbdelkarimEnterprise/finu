// → src/app/page.tsx

import type { Metadata } from "next";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";
import PageShell from "@/components/finu/PageShell";
import ChatHero from "@/components/finu/ChatHero";
import IntroStatement from "@/components/finu/IntroStatement";
import ImmersiveScene, {
  StatementBand,
} from "@/components/finu/ImmersiveScene";
import CardScene from "@/components/finu/CardScene";
import AppShowcase from "@/components/finu/AppShowcase";
import ProductTabs from "@/components/finu/ProductTabs";
import ParticleStat from "@/components/finu/ParticleStat";
import PartnersSection from "@/components/finu/PartnersSection";
import MetricsSection from "@/components/finu/MetricsSection";
import TestimonialsSection from "@/components/finu/TestimonialsSection";
import FAQ from "@/components/finu/FAQ";
import FinalCTA from "@/components/finu/FinalCTA";
import { LINKS } from "@/components/finu/links";

export const metadata: Metadata = {
  description:
    "Finu analyzes your spending, calls out bad habits, and makes you better at money. Pay, transfer, save, and manage stablecoins with intelligence built in.",
};

export default function HomePage() {
  return (
    <div className={finuFontClass}>
      <PageShell>
        <IntroStatement />

        <ChatHero />

        <ImmersiveScene
          tone="mist"
          eyebrow="Finu AI"
          title="Finu gets to know your money."
          body="Finu analyzes spending, calls out bad habits, and makes you better at money."
          href={LINKS.ai}
        />

        <CardScene />

        <ImmersiveScene
          tone="sky"
          eyebrow="International Transfer"
          title="Send crypto, receive local currency."
          body="Experience hassle-free sending. Every transaction protected, every recipient just moments away."
          href={LINKS.sendBankEwallet}
          reverse
        />

        <StatementBand size="md">
          Pay, transfer, save, and manage stablecoins with intelligence
          built in.
        </StatementBand>

        <ImmersiveScene
          tone="sand"
          eyebrow="Multi-Currency Wallet"
          title="Bridging crypto and everyday life."
          body="Crypto or local currency. Jump straight into action and access your funds easily."
          href={LINKS.wallet}
        />

        <AppShowcase />

        <ProductTabs />

        <ParticleStat />

        <PartnersSection />
        <MetricsSection />
        <TestimonialsSection />
        <FAQ />
        <FinalCTA />
      </PageShell>
    </div>
  );
}
