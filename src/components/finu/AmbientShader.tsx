"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/* Original FINU ambient field: two slow domain-warped fbm layers in
   the Midnight palette, weighted toward the right so the CTA copy on
   the left keeps its dark, readable ground. */
const fragmentSource = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
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
    p = p * 2.03 + vec2(11.3, 5.7);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;
  vec2 p = (2.0 * gl_FragCoord.xy - res) / min(res.x, res.y);

  float t = u_time * 0.05;

  vec3 base     = vec3(0.051, 0.078, 0.157); // #0D1428
  vec3 deep     = vec3(0.031, 0.051, 0.129);
  vec3 electric = vec3(0.310, 0.486, 1.000); // #4F7CFF
  vec3 violet   = vec3(0.525, 0.408, 1.000); // #8668FF
  vec3 cyan     = vec3(0.220, 0.867, 0.973); // #38DDF8

  vec2 warp = vec2(
    fbm(p * 0.9 + vec2(t, -t * 0.6)),
    fbm(p * 0.9 + vec2(-t * 0.7, t))
  );
  float field = fbm(p * 0.7 + warp * 0.85 + vec2(t * 0.4, 0.0));

  vec3 color = mix(deep, base, smoothstep(0.15, 0.75, field));

  /* Blue bloom, strongest toward the upper right */
  float blueMask =
    smoothstep(0.35, 0.95, field) *
    smoothstep(-0.4, 1.1, p.x) *
    smoothstep(1.4, -0.4, p.y * 0.6 - 0.2);
  color = mix(color, electric, blueMask * 0.34);

  /* Violet undertow, lower left */
  float violetMask =
    smoothstep(0.45, 1.0, warp.y) *
    smoothstep(1.1, -0.6, p.x);
  color = mix(color, violet, violetMask * 0.2);

  /* A faint cyan thread where the two layers shear */
  float thread = 1.0 - smoothstep(0.0, 0.05, abs(field - warp.x * 0.9));
  color += cyan * thread * 0.05;

  /* Keep the left third calm for the copy */
  color = mix(color, deep, smoothstep(0.55, 0.0, uv.x) * 0.55);

  /* Soft frame vignette + grain against banding */
  float vig = 1.0 - smoothstep(0.5, 1.5, length(p * vec2(0.8, 1.05)));
  color *= mix(0.72, 1.0, vig);
  color += (hash(gl_FragCoord.xy + fract(u_time) * 40.0) - 0.5) * 0.014;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

/**
 * Second, lighter ambient shader — used once (final CTA) so the page
 * bookends with living light without exceeding two WebGL canvases.
 * Pauses offscreen and in hidden tabs; under reduced motion it never
 * mounts a context and the CSS gradient beneath it stands in.
 */
export default function AmbientShader({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
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
    />
  );
}
