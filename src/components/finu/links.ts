/**
 * FINU's real destinations, mirrored from meetfinu.com. Product and
 * company pages live on the existing site, so links stay absolute and
 * keep working from this redesigned homepage.
 */
export const APP_URL = "https://app.meetfinu.com/";
const SITE = "https://meetfinu.com";

export const LINKS = {
  app: APP_URL,
  card: `${SITE}/card.html`,
  ai: `${SITE}/ai.html`,
  sendBankEwallet: `${SITE}/send-bank-ewallet.html`,
  sendUser: `${SITE}/send-user.html`,
  wallet: `${SITE}/multi-currency-wallet.html`,
  credit: `${SITE}/credit.html`,
  swap: `${SITE}/swap.html`,
  p2p: `${SITE}/p2p-marketplace.html`,
  aboutUs: `${SITE}/about-us.html`,
  community: `${SITE}/affiliates.html`,
  news: "https://x.com/finuai?s=21&t=i7IOFxZ4gurzKwsY0Esjyg",
  terms: `${SITE}/terms/general.html`,
  privacy: `${SITE}/privacy-policy.html`,
} as const;

export type NavItem = {
  label: string;
  href?: string;
  /** Items FINU lists but has not launched yet — shown greyed out, like the live site. */
  disabled?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Personal",
    items: [
      { label: "Card", href: LINKS.card },
      { label: "Finu AI", href: LINKS.ai },
      { label: "Send to bank & e-wallet", href: LINKS.sendBankEwallet },
      { label: "Send to Finu user", href: LINKS.sendUser },
      { label: "Multi-Currency Wallet", href: LINKS.wallet },
      { label: "Credit", href: LINKS.credit },
      { label: "Swap", href: LINKS.swap },
      { label: "P2P Marketplace", href: LINKS.p2p },
    ],
  },
  {
    label: "Business",
    items: [{ label: "Finu Connect", disabled: true }],
  },
  {
    label: "Company",
    items: [
      { label: "About Us", href: LINKS.aboutUs },
      { label: "Community", href: LINKS.community },
    ],
  },
  {
    label: "Resources",
    items: [{ label: "News", href: LINKS.news }],
  },
  {
    label: "Support",
    items: [
      { label: "Contact Us", disabled: true },
      { label: "Careers", disabled: true },
      { label: "Help Center", disabled: true },
    ],
  },
];

/** The live site's language switcher, preserved verbatim. */
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "tw", label: "繁體中文" },
  { code: "zh", label: "简体中文" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "jp", label: "日本語" },
  { code: "tr", label: "Türkçe" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "th", label: "ภาษาไทย" },
  { code: "hi", label: "हिन्दी" },
  { code: "ro", label: "Română" },
  { code: "ur", label: "اردو" },
] as const;
