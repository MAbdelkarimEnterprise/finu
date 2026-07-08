"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
 * Underwater light field: a vertical depth gradient (light surface →
 * teal → deep blue) with layered fbm caustics near the surface and
 * god-ray shafts filtering down. The pointer displaces the sample
 * space by at most ~3% for a slow parallax. Palette arrives as
 * uniforms from the design tokens.
 */
const fragmentSource = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;     /* 0..1, damped */
uniform float u_time;
uniform vec3 u_light;       /* surface water   */
uniform vec3 u_mid;         /* open water      */
uniform vec3 u_deep;        /* depth           */

const float TAU = 6.28318530718;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p = p * 2.04 + vec2(17.3, 9.1);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 p = (2.0 * gl_FragCoord.xy - res) / min(res.x, res.y);
  float screenY = gl_FragCoord.y / res.y;
  float t = u_time * 0.05; /* very slow — calm water */

  /* Pointer parallax: at most ~3% displacement of the sample space. */
  vec2 par = (u_pointer - 0.5) * 0.06;
  vec2 q = p + par;

  /* Gentle wave distortion of the whole field. */
  q.x += sin(q.y * 2.1 + t * 2.2) * 0.02;
  q.y += cos(q.x * 1.7 - t * 1.8) * 0.015;

  /* Depth gradient: light at the surface, deep at the bottom. */
  vec3 color = mix(u_deep, u_mid, smoothstep(-0.1, 0.75, screenY));
  color = mix(color, u_light, smoothstep(0.62, 1.05, screenY));

  /* Caustics: two ridged fbm sheets drifting against each other,
     strongest near the surface, dissolving with depth. */
  float c1 = fbm(q * 2.6 + vec2(t * 0.9, -t * 0.5));
  float c2 = fbm(q * 3.1 - vec2(t * 0.7, t * 0.4) + 4.7);
  float caustic = pow(1.0 - abs(c1 - c2), 6.0);
  float surface = smoothstep(0.35, 0.95, screenY);
  color += vec3(0.65, 0.85, 0.95) * caustic * surface * 0.16;

  /* Light shafts filtering down from above the frame. */
  vec2 sunPos = vec2(0.15, 1.35);
  vec2 d = p * vec2(1.0, 1.4) - sunPos;
  float ang = atan(d.y, d.x) * 8.0 / TAU;
  float dist = length(d);
  float r1 = noise(vec2(ang * 1.0 + t * 0.5, 2.7));
  float r2 = noise(vec2(ang * 1.9 - t * 0.4 + 7.0, 5.3));
  float shafts = smoothstep(0.42, 1.0, r1 * r2 * 2.1);
  float reach = (1.0 - smoothstep(0.3, 1.9, dist)) * smoothstep(0.15, 0.7, dist);
  color += vec3(0.75, 0.9, 0.98) * shafts * reach * 0.22;

  /* Sparse drifting motes catching the light. */
  float motes = smoothstep(0.985, 1.0, noise(q * 22.0 + vec2(t * 1.6, -t * 2.2)));
  color += vec3(0.9, 0.97, 1.0) * motes * surface * 0.5;

  /* Frame + grain. */
  float vig = smoothstep(0.75, 2.1, length(p * vec2(0.75, 1.0)));
  color = mix(color, u_deep, vig * 0.25);
  color += (hash(gl_FragCoord.xy + fract(u_time) * 40.0) - 0.5) * 0.008;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/** Reads an `--token` from the .finu scope and parses it to [r,g,b] 0..1. */
function tokenRGB(el: Element | null, name: string, fallback: [number, number, number]) {
  if (!el) return fallback;
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as [
    number,
    number,
    number,
  ];
}

/**
 * The hero's underwater canvas. Raw WebGL (no three.js — one quad
 * doesn't justify ~700KB); palette pulled from the CSS tokens at
 * mount; pauses offscreen and in hidden tabs; DPR capped (1.25 on
 * mobile); never creates a GL context under reduced motion — the
 * CSS gradient fallback on the canvas stands in.
 */
export default function OceanShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
    } catch {
      gl = null;
    }
    if (!gl) return;

    try {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
        : "";
      if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return;
    } catch {
      /* non-essential */
    }

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vertexSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    gl.useProgram(program);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uTime = gl.getUniformLocation(program, "u_time");

    /* Palette from tokens — ocean shades derived from the brand family. */
    const scope = canvas.closest(".finu");
    const light = tokenRGB(scope, "--ocean-light", [0.804, 0.894, 0.969]);
    const mid = tokenRGB(scope, "--ocean-mid", [0.278, 0.545, 0.769]);
    const deep = tokenRGB(scope, "--ocean-deep", [0.055, 0.161, 0.322]);
    gl.uniform3f(gl.getUniformLocation(program, "u_light"), ...light);
    gl.uniform3f(gl.getUniformLocation(program, "u_mid"), ...mid);
    gl.uniform3f(gl.getUniformLocation(program, "u_deep"), ...deep);

    gl.clearColor(light[0], light[1], light[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* Damped pointer for the parallax. */
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = 1 - e.clientY / window.innerHeight;
    };
    if (!isMobile) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const startedAt = performance.now();
    let raf = 0;
    let running = false;
    let visible = false;

    const render = (now: number) => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uTime, (now - startedAt) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    const setRunning = () => {
      const next = visible && !document.hidden;
      if (next && !running) {
        running = true;
        raf = requestAnimationFrame(render);
      } else if (!next && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        setRunning();
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);
    const onVisibility = () => setRunning();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!isMobile) window.removeEventListener("pointermove", onPointerMove);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(180deg, #cde4f7 0%, #7ba9d6 55%, #16345c 100%) ",
      }}
    />
  );
}
