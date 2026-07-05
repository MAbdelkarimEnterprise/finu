import type { Metadata } from "next";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";
import PageShell from "@/components/finu/PageShell";
import CompanyHero from "@/components/finu/CompanyHero";
import Numbers from "@/components/finu/Numbers";

export const metadata: Metadata = {
  title: "Finu in Numbers",
  description:
    "The stablecoin market, the payments opportunity, and the infrastructure Finu is built on — measured.",
  openGraph: {
    title: "Finu in Numbers",
    description:
      "The stablecoin market, the payments opportunity, and the infrastructure Finu is built on — measured.",
  },
};

export default function CompanyPage() {
  return (
    <div className={finuFontClass}>
      <PageShell>
        <CompanyHero />
        <Numbers />
      </PageShell>
    </div>
  );
}
