# Finu Landing — Design Handoff

Final system notes and implementation guidance for the Finu landing page.
Companion to [design-system.md](./design-system.md), which holds the token
and composition rules.

## What shipped

A single-route marketing page (`src/app/page.tsx`) composed of twelve
section components in `src/components/landing/`, all copy centralized in
`src/lib/landing-content.ts`, themed by `src/styles/tokens.css` under the
`.finu` scope. Reused primitives (`TextReveal`, `Reveal`, `MagneticButton`,
`Eyebrow`, `SmoothScroll`, `Footer`) live in `src/components/finu/`.

Narrative arc: **Hero** (promise + product) → **TrustStrip** (dark band,
4 proof lines) → **Problem** (warm band, 4 pains) → **ProductChat** (the
AI in action) → **FeatureBands** (5 capabilities, alternating) →
**Comparison** (honest table) → **Testimonials** (labelled examples) →
**FAQ** → **FinalCTA** (dark room).

## Motion contract

- Headlines enter with `TextReveal` (word mask), blocks with `Reveal`
  (fade-rise), both `once` and forced after 900 ms if IntersectionObserver
  never fires (WebView/throttled-tab insurance).
- Hero ambience is `MidnightIntelligenceShader` (WebGL, domain-warped fbm
  in brand hues). It self-disables on: no WebGL context, software
  rasterizers (SwiftShader/llvmpipe), `prefers-reduced-motion` (renders
  one static frame), hidden tabs, and off-viewport scroll. The CSS
  gradient behind the canvas is the designed fallback, not a degraded one.
- Lenis + GSAP share one ticker; both are skipped under reduced motion.
- Never animate layout properties; only transform/opacity.

## Accessibility state (audited)

- One `h1`; `h2` per section; `h3` for cards/FAQ items — clean outline.
- Landmarks: `header`, `nav[aria-label=Primary/Mobile/Footer]`, `main`,
  labelled `section`s, `footer`.
- Comparison is a real `<table>` with row/col `scope`, sr-only capability
  header, and sr-only Yes/No text behind the check/cross icons.
- Forecast chart is `role="img"` with a sentence-long `aria-label`; all
  decorative icons sit inside `aria-hidden` wrappers.
- Contrast (AA): ink 17.2:1, muted 5.2:1, white-on-accent 6.7:1,
  warning-on-butter 4.54:1. The one failure found (white on coral
  "Cancel?" chip, 3.07:1) was fixed to ink-on-coral (5.8:1).
- Focus: single global `:focus-visible` ring token. No positive tabindex.
- Reduced motion: every animated component has a static branch.

## QA results (390 / 360 / 768 / 1024 / 1280)

- No horizontal overflow at any width (`public/qa.html` harness).
- Mobile: CTAs stack, floating hero cards hide below `lg`, footer columns
  wrap; all product mockups stay legible.
- Desktop: floating bill/subscription cards were nudged out
  (`-left-52` / `-right-56`) so they overlap only the phone bezel.
- Testing caveat (automation): in a hidden/occluded Chrome tab, rAF and
  timers freeze, so entrance animations look stuck in screenshots. That
  is tab throttling, not a page bug — verify with a visible tab, or
  inject `[style*=transform]{transform:none!important;opacity:1!important}`
  when auditing layout in iframes.

## Social / sharing

- `public/images/og.jpg` (1200×630, 84 KB) — original code-drawn brand
  field artwork with wordmark and headline; wired into `openGraph.images`
  and `twitter.images` in `src/app/layout.tsx`.
- Regenerate by redrawing on canvas (the artwork recipe mirrors the hero
  shader: paper ground, royal flow field right, filaments, cyan packets,
  left text veil).

## Copy rules (originality)

- Voice: smart, playful, direct; never shaming, never corporate.
- Every line is original to Finu. Legacy Cleo-derived phrasing
  ("analyzes spending, calls out bad habits, makes you better at money")
  was rewritten in the unrendered legacy components too.
- No invented user counts or ratings; testimonials carry an explicit
  "example voices" disclaimer; product visuals are labelled illustrative.

## Deploy

- GitHub → Netlify auto-deploy on push to `main` (`@netlify/plugin-nextjs`).
- `netlify.app` may be ISP-blocked locally — verify deploys via the
  Netlify API rather than loading the URL.
- Switzer loads from Fontshare with `font-display: swap` and preconnect;
  Geist/system-ui fallbacks mean a blocked CDN never blanks text.

## Known trade-offs / next steps

- The legacy `src/components/finu/` marketing components (ProductExplorer,
  MetricsSection, ParticleNarrative, …) are no longer routed but remain in
  the tree; prune once the new page is confirmed in production.
- `public/qa.html` is a dev harness; exclude from production if desired.
- Figma workspace was intentionally skipped (view-only seat); the design
  system source of truth is this repo (`tokens.css` + docs).
