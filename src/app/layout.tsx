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
    "Finu is your money companion. Plain-English spending insights, a bill radar, a subscription catcher, and a cash-flow forecast that finally makes payday make sense.",
  keywords: [
    "money companion",
    "AI money assistant",
    "spending insights",
    "cash flow forecast",
    "bill reminders",
    "subscription tracker",
    "budgeting without spreadsheets",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Finu",
    title: "Money talks. Finu talks back.",
    description:
      "Finu is your money companion. Plain-English spending insights, a bill radar, a subscription catcher, and a cash-flow forecast that finally makes payday make sense.",
    locale: "en_US",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Finu — Money talks. Finu talks back.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Money talks. Finu talks back.",
    description:
      "Finu is your money companion. Plain-English spending insights, a bill radar, a subscription catcher, and a cash-flow forecast that finally makes payday make sense.",
    images: ["/images/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f9ff",
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
