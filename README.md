# Finu — Money talks. Finu talks back.

Marketing site for [Finu](https://meetfinu.com/): the AI financial
assistant for stablecoin payments, transfers, credit, swaps, and P2P.

Design direction: **Midnight Intelligence** — dark navy surfaces
(~75%), electric blue actions (~15%), violet + cyan reserved for AI
moments and live data (~10%).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3.4 + a token-driven design system in
  `src/styles/finu.css` (scoped under `.finu`)
- Framer Motion (reveals, tab transitions, magnetic buttons)
- Lenis smooth scrolling driven by the GSAP ticker (`SmoothScroll.tsx`)
- Plain WebGL hero shader — no Three.js / React Three Fiber

## Shader architecture

`src/components/MidnightIntelligenceShader.tsx` is a dependency-free
WebGL fragment shader:

- domain-warped FBM fields (blue/violet flow) over a slow depth layer
- thin contour filaments with sparse cyan pulses traveling along them
- pointer attraction + velocity response (events bind to the `.hero`
  container, not the canvas), damped in JS and fed in as uniforms
- ambient "breathing" while idle; ~16–24s broad color cycles
- lifecycle: pauses when the tab is hidden or the hero leaves the
  viewport (IntersectionObserver), DPR capped (1.75 desktop / 1.25
  mobile), fewer octaves + no filament pass on mobile, one static
  frame under `prefers-reduced-motion`, CSS gradient fallback when
  WebGL is unavailable, full GL resource cleanup on unmount

Below the fold, continuity comes from lightweight CSS/SVG systems
instead of more canvases: ambient light fields (`.f-ambient`), SVG
data paths with in-view pulses (`DataPath.tsx`), seam separators
(`.f-seam`), and a faint coordinate grid (`.f-grid-texture`).

## Interaction system

- `InteractiveSurface.tsx` — cursor-aware cards: ≤ ~2° tilt, an
  independent light highlight via `--px`/`--py`, border bloom; ref +
  rAF driven (no per-frame React state); inert on touch and reduced
  motion
- `MagneticButton.tsx` — damped magnetic pull on primary CTAs
- `AnimatedValue.tsx` — in-view count-up with compact formatting
  (412K → 1M, never "0M+"), final value exposed via `aria-label`
- Product tabs: ARIA tablist with arrow-key navigation, directional
  panel transitions, animated pill with periodic light sweep, mobile
  scroll cue

## Routes

- `/` — the complete homepage (hero, cards, product tabs, partners,
  metrics, community, FAQ, final CTA)

Product/company links point to their live pages on meetfinu.com. All
copy, metrics, testimonials, and brand assets mirror the live site —
nothing invented. Interface visuals are labelled illustrative.

## Develop

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy to Netlify

Preconfigured via `netlify.toml` + `@netlify/plugin-nextjs`. Pushing
to the connected GitHub repo's `main` branch triggers a production
deploy; no environment variables are required (`URL` is injected by
Netlify and used for sitemap/OpenGraph absolute URLs).

Manual deploy, if ever needed:

```bash
netlify deploy --build --prod
```
