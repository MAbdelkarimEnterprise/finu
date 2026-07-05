# Finu — Where AI Meets Stablecoins

Marketing site for Finu: intelligent global payments powered by AI,
programmable finance, and stablecoin infrastructure.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Framer Motion (reveals, magnetic buttons, crossfades)
- GSAP ScrollTrigger (pinned scroll-scrubbed manifesto)
- Lenis (smooth scrolling, driven by the GSAP ticker)
- React Three Fiber + Drei + Three.js (hero WebGL: GLSL particle field,
  fbm nebula backdrop, blockchain network with traveling transfer pulses)

## Routes

- `/` — homepage (hero, trust marquee, pinned manifesto, sticky-storytelling features, closing CTA)
- `/company` — "Finu in Numbers" (count-up industry stats)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build && npm start
```

## Deploy to Netlify

The project is preconfigured for Netlify via `netlify.toml` and
`@netlify/plugin-nextjs` — no manual build settings needed.

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub → select the repo → Deploy**.

Netlify picks up the build command (`npm run build`) and publish
directory (`.next`) from `netlify.toml` automatically.

**Environment variables: none required.** The site is fully static —
no API keys, no database, no secrets. (`URL` is injected by Netlify
automatically and used for sitemap/OpenGraph absolute URLs.)

### Deployment checklist

- [x] `@netlify/plugin-nextjs` installed
- [x] `netlify.toml` with build command + plugin
- [x] All WebGL (React Three Fiber) scenes loaded with `dynamic(..., { ssr: false })`
- [x] All animation components are client components (`"use client"`)
- [x] Fonts self-hosted via `next/font` (zero layout shift, no external requests)
- [x] SEO metadata + OpenGraph + Twitter cards
- [x] `sitemap.xml` and `robots.txt` generated at build time
- [x] `npm run build` — zero errors, zero warnings, all routes static

All Finu-specific styling is scoped under the `.finu` class in
`src/styles/finu.css`; components live in `src/components/finu/`.
