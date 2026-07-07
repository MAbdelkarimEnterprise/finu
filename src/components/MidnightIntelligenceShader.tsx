"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/*
 * Midnight Intelligence field.
 *
 * Layers, back to front:
 *   1. depth      — very broad, very slow fbm; spatial backdrop
 *   2. warp field — domain-warped fbm (q → r → field) for the blue/violet flow
 *   3. filaments  — thin contour lines of the field, read as data paths
 *   4. pulses     — sparse cyan packets traveling along some filaments (~7s)
 *   5. pointer    — soft attraction that bends flow + a restrained glow
 *
 * OCTAVES / DETAIL are #defined by the TS wrapper (mobile gets fewer
 * octaves and no filament pass).
 */
const fragmentShaderBody = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_interaction;
uniform float u_velocity;

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
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + vec2(13.1, 7.7);
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 resolution = max(u_resolution, vec2(1.0));

  vec2 uv =
    (2.0 * gl_FragCoord.xy - resolution.xy) /
    min(resolution.x, resolution.y);

  float t = u_time;

  vec3 base     = vec3(0.9686, 0.9765, 1.0000); /* #F7F9FF */
  vec3 deep     = vec3(0.8900, 0.9180, 1.0000); /* #E3EAFF */
  vec3 electric = vec3(0.1137, 0.2314, 1.0000); /* #1D3BFF */
  vec3 violet   = vec3(0.4275, 0.2941, 1.0000); /* #6D4BFF */
  vec3 cyan     = vec3(0.1333, 0.7804, 0.9098); /* #22C7E8 */

  /* Ambient breathing (~20s): a gentle deepening pulse (brightening
     would clamp against the near-white ground). */
  float breathe =
    1.0 - 0.02 * (0.5 + 0.5 * sin(t * 0.314)) * (1.0 - u_interaction * 0.7);

  /* Broad electric/violet balance cycle (~21s). */
  float cycle = 0.5 + 0.5 * sin(t * 0.298);

  vec2 pointer =
    (2.0 * u_pointer - 1.0) * resolution / min(resolution.x, resolution.y);
  vec2 toPointer = pointer - uv;
  float pointerField = exp(-dot(toPointer, toPointer) * 2.6) * u_interaction;

  /* The pointer softly attracts nearby flow; velocity deepens the bend. */
  vec2 flowUv = uv + toPointer * pointerField * (0.14 + u_velocity * 0.06);

  float slow = t * 0.055;

  /* Domain warp: q warps r, r warps the final field. */
  vec2 q = vec2(
    fbm(flowUv * 0.62 + vec2(slow * 0.9, -slow * 0.6)),
    fbm(flowUv * 0.62 + vec2(5.2 - slow * 0.7, 1.3 + slow * 0.8))
  );
  vec2 r = vec2(
    fbm(flowUv * 0.9 + q * 1.35 + vec2(1.7 + slow * 1.2, 9.2)),
    fbm(flowUv * 0.9 + q * 1.35 + vec2(8.3, 2.8 - slow * 1.1))
  );
  float field = fbm(flowUv * 1.1 + r * (1.55 + u_velocity * 0.3));

  /* Depth layer: broader, slower, tiny pointer parallax. */
  float depth = fbm(
    uv * 0.38 +
    vec2(slow * 0.35, slow * 0.22) +
    (u_pointer - 0.5) * 0.06
  );

  vec3 color = base;
  color = mix(color, deep, smoothstep(0.12, 0.82, depth) * 0.9);
  color = mix(
    color,
    mix(deep, electric, 0.24),
    smoothstep(0.22, 0.88, q.x) * 0.5
  );
  color = mix(
    color,
    electric,
    smoothstep(0.36, 0.9, field) * (0.15 + 0.07 * (1.0 - cycle))
  );

  float violetMask = smoothstep(0.52, 0.94, r.y * 0.6 + field * 0.4);
  color = mix(color, violet, violetMask * (0.07 + 0.05 * cycle));

#if DETAIL == 1
  /* Filaments: thin contour lines of the warped field — mixed toward
     the accents (additive would clamp to white on this light ground). */
  float bands = field * 9.0;
  float cell = fract(bands);
  float filament = 1.0 - smoothstep(0.02, 0.075, abs(cell - 0.5));
  float filamentMask =
    smoothstep(0.32, 0.72, field) * (0.45 + 0.55 * depth);

  color = mix(color, electric, filament * filamentMask * 0.14);
  color = mix(color, cyan, filament * filamentMask * 0.05);

  /* Sparse royal packets traveling along some filaments (~7s). */
  float bandSeed = hash(vec2(floor(bands), 17.0));
  float pulseGate = step(0.55, bandSeed);
  float along = q.y * 2.6 + bandSeed * 7.0;
  float pulsePhase = fract(along - t * 0.14);
  float pulse = exp(-pow((pulsePhase - 0.5) * 12.0, 2.0));

  color = mix(color, electric, pulse * filament * filamentMask * pulseGate * 0.35);
#endif

  /* Pointer glow: a royal bloom that deepens with movement. */
  color = mix(color, electric, pointerField * (0.1 + u_velocity * 0.06));
  color = mix(color, cyan, pointerField * 0.04);

  color *= breathe;

  /* Content-safe zone: keep the center light behind the navy headline. */
  float centerDist = length(uv * vec2(0.85, 1.1));
  float guardMask = 1.0 - smoothstep(0.25, 1.0, centerDist);
  color = mix(color, base, guardMask * 0.55);

  /* Edges settle a touch deeper so the frame reads intentional. */
  float vignette = smoothstep(0.6, 1.9, length(uv * vec2(0.72, 1.0)));
  color = mix(color, deep, vignette * 0.3);

  /* Fine grain against banding. */
  float grain = hash(gl_FragCoord.xy + fract(u_time) * 60.0) - 0.5;
  color += grain * 0.008;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

type ShaderProps = {
  className?: string;
};

export function MidnightIntelligenceShader({ className = "" }: ShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = isTouch || window.innerWidth < 768;

    /* Some in-app browsers (Telegram, WhatsApp) and locked-down
       WebViews either throw instead of returning null when WebGL is
       disabled by policy, or hand back a software rasterizer that is
       far too slow for a full-screen shader. Both cases must fall
       back to the plain CSS gradient already painted behind the
       canvas — never leave the page waiting on a context that can't
       carry the animation. */
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
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
      /* Renderer string isn't essential — keep going if it's unavailable. */
    }

    /* Quality tier: mobile drops an fbm octave and the filament pass. */
    const fragmentShaderSource =
      `#define OCTAVES ${isMobile ? 4 : 5}\n` +
      `#define DETAIL ${isMobile ? 0 : 1}\n` +
      fragmentShaderBody;

    const compileShader = (type: number, source: string) => {
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

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const interactionLocation = gl.getUniformLocation(program, "u_interaction");
    const velocityLocation = gl.getUniformLocation(program, "u_velocity");

    const pointer = {
      x: 0.66,
      y: 0.52,
      targetX: 0.66,
      targetY: 0.52,
      strength: 0,
      targetStrength: 0,
      velocity: 0,
      targetVelocity: 0,
      lastX: 0.66,
      lastY: 0.52,
      lastMove: 0,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        reducedMotion ? 1 : isMobile ? 1.25 : 1.75
      );
      const width = Math.max(1, Math.floor(rect.width * pixelRatio));
      const height = Math.max(1, Math.floor(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    /* Pointer events bind to the hero container, not the canvas — the
       canvas sits behind the hero content and rarely receives them. */
    const pointerHost: HTMLElement =
      canvas.closest<HTMLElement>(".hero") ?? canvas.parentElement ?? canvas;

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion || isTouch || event.pointerType === "touch") return;

      const rect = canvas.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const ny = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      const now = performance.now();
      const dt = Math.max(now - pointer.lastMove, 8);

      const travel = Math.hypot(nx - pointer.lastX, ny - pointer.lastY);
      pointer.targetVelocity = Math.min(
        1,
        pointer.targetVelocity + (travel / dt) * 900
      );

      pointer.lastX = nx;
      pointer.lastY = ny;
      pointer.lastMove = now;
      pointer.targetX = nx;
      pointer.targetY = ny;
      pointer.targetStrength = 1;
    };

    const handlePointerLeave = () => {
      pointer.targetStrength = 0;
    };

    pointerHost.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    pointerHost.addEventListener("pointerleave", handlePointerLeave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const startedAt = performance.now();
    let animationFrame = 0;
    let pageVisible = !document.hidden;
    let inViewport = true;
    let disposed = false;
    let started = false;

    const render = (now: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.04;

      /* Velocity decays quickly so bursts of movement read as energy. */
      pointer.targetVelocity *= 0.9;
      pointer.velocity += (pointer.targetVelocity - pointer.velocity) * 0.08;

      const elapsed = reducedMotion ? 0 : (now - startedAt) / 1000;

      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(
        interactionLocation,
        reducedMotion ? 0 : pointer.strength
      );
      gl.uniform1f(velocityLocation, reducedMotion ? 0 : pointer.velocity);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (pageVisible && inViewport && !reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    const restart = () => {
      if (disposed || !started) return;
      cancelAnimationFrame(animationFrame);
      if (pageVisible && inViewport && !reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      restart();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    /* Pause entirely when the hero is scrolled well out of view. */
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        restart();
      },
      { rootMargin: "120px" }
    );
    intersectionObserver.observe(canvas);

    /* Defer the first frame past initial paint/hydration so the shader
       never competes with getting real content on screen first — a
       plain requestAnimationFrame still runs inside the same paint
       cycle as everything else mounting, requestIdleCallback (with a
       timeout fallback for Safari, which lacks it) waits until the
       main thread is actually free. */
    const scheduleIdle: (cb: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(cb, { timeout: 400 })
        : (cb) => window.setTimeout(cb, 120);
    const cancelIdle: (id: number) => void =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const idleId = scheduleIdle(() => {
      started = true;
      if (disposed || !pageVisible || !inViewport) return;
      /* Reduced motion still gets one polished static frame. */
      animationFrame = requestAnimationFrame(render);
    });

    return () => {
      disposed = true;
      pageVisible = false;
      cancelIdle(idleId);
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      pointerHost.removeEventListener("pointermove", handlePointerMove);
      pointerHost.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`midnight-intelligence-shader ${className}`}
      aria-hidden="true"
    />
  );
}
