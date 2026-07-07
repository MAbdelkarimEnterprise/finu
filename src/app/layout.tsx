import type { Metadata, Viewport } from "next";
import "./globals.css";

// Netlify injects URL at build time; fall back for local builds.
const BASE_URL = process.env.URL ?? "https://finu.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Money talks. Finu talks back.",
    template: "%s · Finu",
  },
  description:
    "The world's first AI financial assistant. Finu analyzes your spending, calls out bad habits, and makes you better at money.",
  keywords: [
    "AI financial assistant",
    "stablecoins",
    "crypto card",
    "AI payments",
    "multi-currency wallet",
    "USDC",
    "international transfer",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Finu",
    title: "Money talks. Finu talks back.",
    description:
      "The world's first AI financial assistant. Finu analyzes your spending, calls out bad habits, and makes you better at money.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Money talks. Finu talks back.",
    description:
      "The world's first AI financial assistant. Finu analyzes your spending, calls out bad habits, and makes you better at money.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050816",
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
      <head>
        {/* Switzer is loaded from Fontshare's CDN via @font-face with
            font-display: swap; this just speeds up that connection.
            The type stack already falls back to self-hosted Geist and
            system-ui, so a slow or blocked CDN never blocks text. */}
        <link rel="preconnect" href="https://cdn.fontshare.com" />
        <link rel="dns-prefetch" href="https://cdn.fontshare.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
