"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
 * Screen-space port of the provided god-ray light shader: angular
 * noise sampled twice around the sun and scrolled against itself,
 * multiplied, ray-limited, then masked from the sun outward with a
 * mid-distance falloff — plus the glow term and the spectrum tint.
 * The rainbow ratios are dialed well down from the game defaults so
 * it reads as atmospheric light, not an effect. Value noise replaces
 * the noise texture; the sun sits above the top edge and the shafts
 * pour down behind the phone.
 */
const fragmentSource = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

/* Tuning — names map 1:1 to the source shader's uniforms. */
const float SCALE_U = 8.0;
const float OFFSET = 0.12;
const vec2  SPEED = vec2(0.010, 0.015);
const float RAINBOW_SCALE = 2.0;
const float RAY_LIMIT = 0.4;
const float RAY_OFFSET = 0.1;
const float RAY_MASK_POWER = 2.0;
const vec3  RAY_COLOR = vec3(1.0, 1.0, 1.0);
const float RAY_RAINBOW = 0.14;  /* 0.5 in-game — softened for realism */
const float GLOW = 0.5;
const vec3  GLOW_COLOR = vec3(1.0, 0.99, 0.955);
const float GLOW_RAINBOW = 0.07; /* 0.25 in-game — softened */

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

/* Rainbow color — verbatim from the source shader. */
vec3 spectrum(float t) {
  return clamp(
    abs(mod(t * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
    0.0,
    1.0
  );
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 p = (2.0 * gl_FragCoord.xy - res) / min(res.x, res.y);
  float screenY = gl_FragCoord.y / res.y;
  float t = u_time;

  /* Sun above the top edge; distance stands in for -v·l. */
  vec2 sunPos = vec2(0.0, 1.30);
  vec2 d = p - sunPos;
  float dist = length(d);

  /* U coordinate: angle around the sun, scaled like the original. */
  float u = atan(d.y, d.x) * SCALE_U / TAU;
  float vdotl = 1.0 - dist; /* 1 at the sun, falling with distance */

  /* Two scrolled samples, multiplied — the original's uv1/uv2. */
  float noi1 = noise(vec2(u + t * SPEED.x * 8.0, vdotl * 1.5));
  float noi2 = noise(vec2(u * 1.7 + 0.5 - t * SPEED.y * 8.0, (1.0 - vdotl) * 1.5));
  float noiX = noi1 * noi2 * 2.2;

  /* Limit ray count. */
  float noi = smoothstep(RAY_LIMIT, 1.0, noiX);

  /* Offset rays. */
  float v_offset = (noiX - 0.5) * RAY_OFFSET;

  /* Mask from the sun to the end of the rays. */
  float alpha_with_offset = clamp(-vdotl + v_offset + 0.85, 0.0, 1.0);

  /* Second mask peaking at half distance. */
  float alpha_mask =
    1.0 - abs(2.0 * clamp(-vdotl + OFFSET + 0.85, 0.0, 1.0) - 1.0);

  /* Combine. */
  float alpha = alpha_with_offset * pow(alpha_mask, RAY_MASK_POWER);

  float ray_alpha = smoothstep(0.0, 0.1, alpha * noi);
  float glow_alpha = clamp(1.0 - dist * 0.75, 0.0, 1.0) * GLOW;

  /* Final colors — structure mirrors the source shader. */
  vec3 rb_color = spectrum(alpha_with_offset * RAINBOW_SCALE);
  vec3 glo_color = mix(alpha_with_offset * GLOW_COLOR, rb_color, GLOW_RAINBOW) * GLOW;
  vec3 ry_color = mix(vec3(ray_alpha) * RAY_COLOR, rb_color, RAY_RAINBOW);
  vec3 final_color = ry_color * ray_alpha + glo_color * glow_alpha;

  /* Light sky base so the additive pass has something to bite on. */
  vec3 skyTop = vec3(0.788, 0.867, 0.973);
  vec3 skyLow = vec3(0.969, 0.976, 1.000);
  vec3 base = mix(skyLow, skyTop, smoothstep(0.15, 1.0, screenY));

  /* blend_add analog, clamped against the light ground. */
  vec3 color = base + final_color * 0.5;

  /* Settle the frame and break banding. */
  float vig = smoothstep(0.7, 2.0, length(p * vec2(0.75, 1.0)));
  color = mix(color, skyLow, vig * 0.35);
  color += (hash(gl_FragCoord.xy + fract(u_time) * 40.0) - 0.5) * 0.008;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/**
 * The hero backdrop canvas. Pauses offscreen and in hidden tabs,
 * caps DPR, clears to the sky color before the first frame, and
 * never mounts a GL context under reduced motion (the CSS gradient
 * behind it stands in).
 */
export default function SunRayShader({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo
        ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
        : "";
      if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
        return;
      }
    } catch {
      /* non-essential */
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
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
    const uTime = gl.getUniformLocation(program, "u_time");

    /* Sky color before the first frame — never a black flash. */
    gl.clearColor(0.969, 0.976, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

    const startedAt = performance.now();
    let raf = 0;
    let running = false;
    let visible = false;

    const render = (now: number) => {
      if (!running) return;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
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
          "linear-gradient(180deg, #c9ddf8 0%, #eaf2fc 55%, #ffffff 100%)",
      }}
    />
  );
}
