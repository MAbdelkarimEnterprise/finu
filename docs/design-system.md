# Finu Landing Design System

The reusable system behind the Finu landing page. Canonical tokens live in
`src/styles/tokens.css` (scoped under `.finu`); this document explains the
intent behind them and the rules for composing new sections.

## Art direction

**Personality.** A money companion, not a bank. Voice balance: supportive
over savage, social over premium, expressive over minimal — but every
playful moment sits on financially legible UI. Cleo-category energy,
original execution: no borrowed trade dress, characters, or copy.

**The one-liner.** Cool paper ground + ink navy + a single royal-blue
accent, warmed by paper-cream bands and two expressive notes (butter,
coral) reserved for money moments.

## Color

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#f7f9ff` | Page ground — cool paper |
| `--color-bg-alt` | `#faf6ee` | Warm paper — alternating narrative bands |
| `--color-surface` | `#ffffff` | Cards, sheets |
| `--color-surface-raised` | `#eef3ff` | Tinted panels behind product visuals |
| `--color-text` | `#07152f` | Ink navy — all reading text |
| `--color-text-muted` | `#5c6a82` | Secondary text (4.5:1 on bg) |
| `--color-accent` | `#1d3bff` | Royal blue — the only brand accent |
| `--color-accent-deep` | `#1026b8` | Hover/pressed accent |
| `--color-butter` / `--color-butter-soft` | `#ffc838` / `#fff3d1` | Celebration money moments only |
| `--color-coral` / `--color-coral-soft` | `#ff5c39` / `#ffe4dc` | Warning/pain money moments only |
| `--color-mint` | `#d9f4e6` | Positive insight fills |
| `--color-positive` / `--color-warning` / `--color-danger` | `#0e9f5b` / `#b45309` / `#dc2626` | Semantic status |

**Rules**
- Royal blue is the only decoration-grade accent. Butter/coral/mint appear
  *only* attached to a money meaning (a pain card, a nudge, a win) — never
  as ambient decoration.
- Dark sections (`#0b1226`-family, see TrustStrip/FinalCTA) bookend the
  page: one after the hero, one before the footer. Everything between
  stays light with alternating cool/warm paper bands.

## Typography

Switzer everywhere (Fontshare CDN, `font-display: swap`, Geist/system-ui
fallback). One family, weight does the work.

| Token | Size | Use |
|---|---|---|
| `--text-hero` | clamp(2.75–5.25rem) | H1 only |
| `--text-display` | clamp(2.1–3.4rem) | Section headlines |
| `--text-heading` | clamp(1.35–1.75rem) | Card titles |
| `--text-body-lg` | clamp(1.05–1.2rem) | Section subheads |
| `--text-body` | 1rem | Reading text |
| `--text-caption` | 0.8rem | Disclaimers, footnotes |

- Headlines: weight 600, tracking −0.02em, sentence case with a period.
  ("Money, but less messy." — the period is part of the voice.)
- Eyebrows: `f-eyebrow` — 11px uppercase mono-spaced tracking with a
  square accent tick. Every section opens with one.

## Space, radius, elevation

- Spacing scale `--space-1..10` (4→128px). Sections breathe at
  `--space-9/10`; cards pad at `--space-5/6`.
- Radii: cards 16px (`--radius-lg`), controls pill (`--radius-pill`),
  in-mockup elements 8px. Large narrative containers (dark bands, final
  CTA) use 28–32px — the "rounded room" that gives the page its
  consumer-app softness.
- Shadows are navy-tinted (`--shadow-card/raised/accent`), never gray.

## Motion

- Signature easing `--motion-ease: cubic-bezier(0.16, 1, 0.3, 1)` at
  120/220/600ms tiers.
- Entrances: word-mask `TextReveal` for headlines, fade-rise `Reveal`
  for blocks. Both carry a 900ms forced-reveal fallback so throttled
  tabs/WebViews never trap content invisible, and both collapse to
  static under `prefers-reduced-motion`.
- Ambient: `MidnightIntelligenceShader` — domain-warped fbm field in
  brand hues behind the hero. WebGL-gated with software-rasterizer
  detection; falls back to the CSS gradient painted behind the canvas.
  Pauses off-viewport and on hidden tabs.
- Scroll: Lenis + GSAP ScrollTrigger on one clock; disabled under
  reduced motion.

## Components (src/components/landing)

| Component | Role |
|---|---|
| `Header` | Pill nav, 4 anchors + accent CTA, scroll-condensing |
| `Hero` | Shader field, centered copy, phone rising into the fold |
| `AppMockup` | `PhoneFrame` + `HomeScreen` — the illustrative product |
| `TrustStrip` | Dark band, 4 icon+line promises |
| `Problem` | Warm band, 4 coral pain cards |
| `ProductChat` | Chat conversation in phone frame + prompt chips |
| `FeatureBands` | 5 alternating feature rows fed by `FEATURES` data |
| `FeatureVisuals` | Code-drawn product cards per feature (no screenshots) |
| `Comparison` | Honest-comparison table, Finu column tinted |
| `Testimonials` | 3 quote cards (butter/blue/mint), labelled as examples |
| `LandingFAQ` | Accordion, first item open |
| `FinalCTA` | Dark rounded room, display headline + accent CTA |

**Composition rules**
- All copy lives in `src/lib/landing-content.ts` — components never
  hard-code strings.
- Product UI is always drawn in code (cards, bars, chips) and labelled
  "illustrative" — never fake screenshots, never real user data.
- Trust moves: every expressive claim is paired with a concrete
  mechanic (chip, forecast bar, radar row) so the playfulness never
  outruns credibility.
