import { Geist, Manrope } from "next/font/google";

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

export const finuFontClass = `${geist.variable} ${manrope.variable}`;
