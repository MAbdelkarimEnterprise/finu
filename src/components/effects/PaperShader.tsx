"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
 * Raw-WebGL port of the TONED background-paper-shader plane. The
 * fragment math is carried over intact — the two-frequency animated
 * noise, the color1/color2 mix, the white lift on noise peaks, and
 * the radial glow — and the original's vertex wobble becomes an
 * equivalent domain distortion so a fullscreen quad reads the same
 * without a mesh. Same uniform family: time, intensity, color1,
 * color2. Defaults are the Finu hero gradient pair.
 */
const fragmentSource = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
  vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
  float time = u_time;

  /* The plane wobble, folded into the sample space. */
  uv.y += sin(uv.x * 10.0 + time) * 0.02 * u_intensity;
  uv.x += cos(uv.y * 8.0 + time * 1.5) * 0.01 * u_intensity;

  /* Animated noise pattern — same two frequency bands. */
  float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
  noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;

  /* Mix colors on the noise; lift the peaks toward white. */
  vec3 color = mix(u_color1, u_color2, noise * 0.5 + 0.5);
  color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * u_intensity * 0.35);

  /* Radial glow from the center. */
  float glow = 1.0 - length(uv - 0.5) * 1.6;
  glow = pow(max(glow, 0.0), 2.0);

  vec3 ground = mix(u_color1 * 0.85, u_color1, uv.y);
  gl_FragColor = vec4(mix(ground, color, glow * 0.85), 1.0);
}
`;

function hexToRGB(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Fullscreen paper-shader background. Ported from the TONED project
 * onto Finu's dependency-free WebGL pipeline: pauses offscreen and
 * in hidden tabs, caps DPR, clears to color1 before the first frame,
 * and skips the GL context under reduced motion (the CSS gradient
 * fallback stands in).
 */
export default function PaperShader({
  color1 = "#1E5EFF",
  color2 = "#5AA8FF",
  className = "",
}: {
  color1?: string;
  color2?: string;
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
    const uTime = gl.getUniformLocation(program, "u_time");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    const c1 = hexToRGB(color1);
    const c2 = hexToRGB(color2);
    gl.uniform3f(gl.getUniformLocation(program, "u_color1"), ...c1);
    gl.uniform3f(gl.getUniformLocation(program, "u_color2"), ...c2);

    gl.clearColor(c1[0], c1[1], c1[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const isMobile =
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
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

    const startedAt = performance.now();
    let raf = 0;
    let running = false;
    let visible = false;

    const render = (now: number) => {
      if (!running) return;
      const t = (now - startedAt) / 1000;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      /* Original tempo, slowed a touch for a marketing surface. */
      gl.uniform1f(uTime, t * 0.6);
      gl.uniform1f(uIntensity, 1.0 + Math.sin(t * 2.0) * 0.3);
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
  }, [color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      aria-hidden="true"
      style={{
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
      }}
    />
  );
}
