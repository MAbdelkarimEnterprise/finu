import {
  ArrowRightLeft,
  CreditCard,
  Landmark,
  MessageSquareText,
  Send,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { LINKS } from "./links";

export type FinuProduct = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
};

/*
 * Single source of truth for the product catalog — shared by the
 * navigation product explorer and the in-page product tabs so the
 * two never drift apart. Copy is verbatim from meetfinu.com.
 */
export const FINU_PRODUCTS: FinuProduct[] = [
  {
    id: "finu-ai",
    label: "Finu AI",
    icon: MessageSquareText,
    title: "Money talks. Finu talks back.",
    body: "Finu reads your spending, spots the leaks, and answers in plain human language.",
    href: LINKS.ai,
  },
  {
    id: "card",
    label: "Card",
    icon: CreditCard,
    title: "Tap Into Everyday Spending",
    body: "Shop, withdraw, and manage your funds globally with our stablecoin-based card.",
    href: LINKS.card,
  },
  {
    id: "transfer",
    label: "International Transfer",
    icon: Send,
    title: "Send Crypto, Receive Local Currency",
    body: "Experience hassle-free sending. Every transaction protected, every recipient just moments away.",
    href: LINKS.sendBankEwallet,
  },
  {
    id: "wallet",
    label: "Multi-Currency Wallet",
    icon: Wallet,
    title: "Bridging Crypto and Everyday Life",
    body: "Crypto or Local Currency. Jump straight into action and access your funds easily.",
    href: LINKS.wallet,
  },
  {
    id: "credit",
    label: "Credit",
    icon: Landmark,
    title: "Unlock Your Credit Power",
    body: "Access instant funds using your crypto as collateral, with flexible repayment options and no credit checks.",
    href: LINKS.credit,
  },
  {
    id: "swap",
    label: "Swap",
    icon: ArrowRightLeft,
    title: "Crypto Conversions, Made Easy",
    body: "Convert your assets or move funds in and out on the go, with competitive rates and minimal friction.",
    href: LINKS.swap,
  },
  {
    id: "p2p",
    label: "P2P Marketplace",
    icon: Users,
    title: "Peer-to-Peer, Powered By You",
    body: "Connect directly with others to access stablecoins. Enjoy secure, low-cost peer-to-peer trading with real-time settlements.",
    href: LINKS.p2p,
  },
];

/** The six products shown in the in-page tabs (cards have their own section). */
export const TAB_PRODUCTS = FINU_PRODUCTS.filter((p) => p.id !== "card");
