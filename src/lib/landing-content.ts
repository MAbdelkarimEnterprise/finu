/**
 * All landing-page copy and section data in one place.
 *
 * Voice: smart, playful, direct, slightly cheeky — never corporate,
 * never shaming. Every line here is original to Finu. No invented
 * user counts, ratings, or regulatory claims; testimonials are
 * clearly labelled as examples.
 */

export const HERO = {
  eyebrow: "Meet Finu — your money companion",
  headline: "Money, but less messy.",
  subhead:
    "Finu watches your spending, flags bills before they land, and answers the question your bank won't: “so… am I okay?”",
  primaryCta: "Get Finu free",
  secondaryCta: "See how it works",
  trustCue: "Private by design · No spreadsheets required",
} as const;

export const TRUST_STRIP = [
  {
    title: "No spreadsheets",
    note: "Insights arrive as sentences, not cells.",
  },
  {
    title: "Bill-aware planning",
    note: "Your forecast knows rent is coming.",
  },
  {
    title: "Subscription visibility",
    note: "Every renewal, surfaced before it bills.",
  },
  {
    title: "Private by design",
    note: "Your data works for you. Nobody else.",
  },
] as const;

export const PROBLEM = {
  eyebrow: "The old way",
  headline: "Sound familiar?",
  subhead: "Money stress is rarely about math. It's about surprises.",
  pains: [
    {
      title: "Bills that ambush you",
      body: "Rent, then the phone bill, then that annual renewal you forgot existed. All in the same week.",
    },
    {
      title: "Subscription creep",
      body: "Four streaming services, two fitness apps, one gym. You use three of them.",
    },
    {
      title: "Payday fog",
      body: "The balance says $1,240. But how much of that is actually yours to spend?",
    },
    {
      title: "Budgets that judge",
      body: "Red pie charts and guilt trips never fixed anyone's finances. They just made checking the app scary.",
    },
  ],
} as const;

export const PRODUCT_CHAT = {
  eyebrow: "Finu AI",
  headline: "Ask your money anything.",
  subhead:
    "Finu talks like a person, answers with your real numbers, and shows its work — so “can I afford it?” stops being a guess.",
  conversation: [
    {
      from: "you" as const,
      text: "Can I afford dinner out on Friday?",
    },
    {
      from: "finu" as const,
      text: "Yes — after Thursday's electric bill you'll have $86 that's genuinely yours. Book the table.",
    },
    {
      from: "you" as const,
      text: "Roast my spending.",
    },
    {
      from: "finu" as const,
      text: "$63 on delivery apps this week. Your kitchen says it misses you.",
    },
  ],
  chips: ["What's quietly draining me?", "When does rent hit?", "Roast my spending"],
} as const;

export type FeatureId =
  | "insights"
  | "forecast"
  | "bills"
  | "subscriptions"
  | "nudges";

export const FEATURES: ReadonlyArray<{
  id: FeatureId;
  eyebrow: string;
  headline: string;
  body: string;
}> = [
  {
    id: "insights",
    eyebrow: "Spending insights",
    headline: "See where it all went — no autopsy required.",
    body: "Every purchase sorted into plain-English categories the moment it lands. One glance tells you the story; tap in if you want receipts.",
  },
  {
    id: "forecast",
    eyebrow: "Cash-flow forecast",
    headline: "Payday, predicted.",
    body: "Finu projects your balance through the weeks ahead — bills included — so you can see the dip before you're standing in it.",
  },
  {
    id: "bills",
    eyebrow: "Bill radar",
    headline: "Bills, spotted before they land.",
    body: "Finu learns your billing rhythm and warns you days ahead, so nothing clears while you're not looking.",
  },
  {
    id: "subscriptions",
    eyebrow: "Subscription catcher",
    headline: "Catch renewals red-handed.",
    body: "Every subscription in one line-up: what it costs, when it renews, and which ones you quietly stopped using months ago.",
  },
  {
    id: "nudges",
    eyebrow: "Nudges & weekly recap",
    headline: "Small nudges, real momentum.",
    body: "When spending dips, Finu suggests moving the difference into savings. And every Sunday: a recap you can read in 30 seconds.",
  },
];

export const COMPARISON = {
  eyebrow: "The line-up",
  headline: "The honest comparison.",
  subhead: "We're biased, obviously. But we're not wrong.",
  columns: ["Finu", "Your bank app", "A spreadsheet", "Doing nothing"],
  rows: [
    {
      label: "Sees bills coming",
      values: ["yes", "some", "manual", "no"],
    },
    {
      label: "Talks plain human",
      values: ["yes", "no", "no", "yes"],
    },
    {
      label: "Finds unused subscriptions",
      values: ["yes", "no", "manual", "no"],
    },
    {
      label: "Updates itself",
      values: ["yes", "yes", "no", "yes"],
    },
    {
      label: "Judges you",
      values: ["no", "no", "yes", "no"],
    },
  ],
  legend: {
    yes: "Yes",
    no: "No",
    some: "Sometimes",
    manual: "If you do it",
  },
  footnote:
    "“Doing nothing” scores surprisingly well on maintenance. Less well on rent week.",
} as const;

export const TESTIMONIALS = {
  eyebrow: "Early reactions",
  headline: "The vibe, in their words.",
  disclaimer: "Example voices to show how Finu fits into a week — not real user quotes. The real ones arrive with launch.",
  quotes: [
    {
      quote:
        "Finu caught a $12.99 subscription I'd been paying for two years. I watched one episode.",
      name: "Sam",
      role: "Example user",
      initials: "S",
    },
    {
      quote:
        "First money app that talks to me like a person instead of a pie chart.",
      name: "Priya",
      role: "Example user",
      initials: "P",
    },
    {
      quote:
        "The payday forecast alone ended my mystery-Tuesday-overdraft era.",
      name: "Marcus",
      role: "Example user",
      initials: "M",
    },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    q: "What does Finu actually do?",
    a: "Finu is a money companion. It reads your spending, sorts it into plain categories, forecasts your cash flow around upcoming bills, surfaces subscriptions you forgot about, and answers questions about your money in normal human language.",
  },
  {
    q: "Does Finu replace my bank?",
    a: "No — and it isn't trying to. Finu sits alongside your existing accounts and makes sense of what's happening in them. Your money stays where it is; Finu handles the understanding part.",
  },
  {
    q: "Is my financial data private?",
    a: "Yes. Your data is encrypted in transit and at rest, it's never sold, and it's only used to power your own insights. You can disconnect and delete your data whenever you like.",
  },
  {
    q: "Will Finu spam me with notifications?",
    a: "Finu only speaks up when it's useful — a bill approaching, a subscription renewing, your weekly recap. You control the volume, right down to silence.",
  },
  {
    q: "Can Finu cancel subscriptions for me?",
    a: "Finu spots them, shows you the true monthly cost, and walks you to the fastest cancellation path. Where a provider allows it, Finu can help you finish the job in-app.",
  },
  {
    q: "How much does it cost?",
    a: "Finu is free to download and start. Some advanced features may become part of a paid plan later — you'll always see what's free and what isn't before you commit.",
  },
  {
    q: "Where is Finu available?",
    a: "Finu is rolling out region by region. Grab the app to see availability where you are, or join the waitlist and we'll ping you the moment it opens up.",
  },
] as const;

export const FINAL_CTA = {
  headline: "Money talks. Finu talks back.",
  reassurance: "Free to start. About two minutes to set up. Delete anytime.",
  cta: "Get Finu free",
} as const;
