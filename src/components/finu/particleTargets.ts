/*
 * Deterministic particle formations for the FINU scroll narrative.
 * Seeded so the composition is stable between renders and resizes
 * only recompute positions, never the story.
 */

export type Pt = { x: number; y: number };

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

/**
 * Four formations, `count` points each:
 * 0 — scattered financial activity
 * 1 — connected global network (wireframe globe)
 * 2 — AI intelligence pulse (radial spokes + core)
 * 3 — clean circular settlement signal
 */
export function makeFormations(
  width: number,
  height: number,
  count: number
): Pt[][] {
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(width, height) * 0.34;

  const scatter: Pt[] = [];
  const globe: Pt[] = [];
  const pulse: Pt[] = [];
  const ring: Pt[] = [];

  const rand = mulberry32(20260706);

  for (let i = 0; i < count; i++) {
    const u = i / count;

    /* 0 — scatter */
    scatter.push({
      x: width * (0.06 + rand() * 0.88),
      y: height * (0.08 + rand() * 0.84),
    });

    /* 1 — globe: outer ring + equator + meridian */
    if (u < 0.55) {
      const a = (i / (count * 0.55)) * TAU + rand() * 0.06;
      const r = R * (0.98 + rand() * 0.05);
      globe.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    } else if (u < 0.78) {
      const a = rand() * TAU;
      globe.push({
        x: cx + Math.cos(a) * R * 0.98,
        y: cy + Math.sin(a) * R * 0.3,
      });
    } else {
      const a = rand() * TAU;
      globe.push({
        x: cx + Math.cos(a) * R * 0.3,
        y: cy + Math.sin(a) * R * 0.98,
      });
    }

    /* 2 — pulse: eight spokes, denser toward the core */
    if (u < 0.85) {
      const spoke = Math.floor(rand() * 8);
      const a = (spoke / 8) * TAU + (rand() - 0.5) * 0.09;
      const r = Math.pow(rand(), 1.6) * R * 1.05;
      pulse.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    } else {
      const a = rand() * TAU;
      const r = rand() * R * 0.12;
      pulse.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }

    /* 3 — settlement ring */
    const a = u * TAU + rand() * 0.02;
    const r = R * (0.74 + rand() * 0.08);
    ring.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }

  return [scatter, globe, pulse, ring];
}

export type Particle = {
  x: number;
  y: number;
  glyph: number; // 0 circle · 1 square · 2 plus · 3 dash
  size: number;
  tone: string;
  stagger: number;
  phase: number;
};

export function makeParticles(count: number): Particle[] {
  const rand = mulberry32(97);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const t = rand();
    particles.push({
      x: 0,
      y: 0,
      glyph: Math.floor(rand() * 4),
      size: 1.4 + rand() * 1.8,
      tone:
        t < 0.7
          ? "rgba(29, 59, 255, 0.8)"
          : t < 0.88
            ? "rgba(56, 221, 248, 0.85)"
            : "rgba(109, 75, 255, 0.8)",
      stagger: rand(),
      phase: rand() * TAU,
    });
  }
  return particles;
}
