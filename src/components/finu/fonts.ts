import { Space_Grotesk, Instrument_Serif, Inter } from "next/font/google";

export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-font-display",
  display: "swap",
});

export const serifAccent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-font-serif",
  display: "swap",
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--f-font-body",
  display: "swap",
});

export const finuFontClass = `${grotesk.variable} ${serifAccent.variable} ${body.variable}`;
