import type { Metadata, Viewport } from "next";
import "./globals.css";

// Netlify injects URL at build time; fall back for local builds.
const BASE_URL = process.env.URL ?? "https://finu.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Finu — Where AI Meets Stablecoins",
    template: "%s · Finu",
  },
  description:
    "Intelligent global payments powered by AI, programmable finance, and stablecoin infrastructure.",
  keywords: [
    "stablecoins",
    "AI payments",
    "programmable finance",
    "global payments",
    "USDC",
    "blockchain",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Finu",
    title: "Finu — Where AI Meets Stablecoins",
    description:
      "Intelligent global payments powered by AI, programmable finance, and stablecoin infrastructure.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finu — Where AI Meets Stablecoins",
    description:
      "Intelligent global payments powered by AI, programmable finance, and stablecoin infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
