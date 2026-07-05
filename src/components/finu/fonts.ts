import { Geist, Geist_Mono, Manrope } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--f-font-display",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--f-font-body",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-font-mono",
  display: "swap",
});

export const finuFontClass = `${geist.variable} ${manrope.variable} ${geistMono.variable}`;
