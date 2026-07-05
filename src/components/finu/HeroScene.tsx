"use client";

import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Preload, RoundedBox } from "@react-three/drei";

/* Shared GLSL simplex noise (Ashima / IQ) */
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const BLUE = new THREE.Color("#6e7bff");
const VIOLET = new THREE.Color("#a07bff");
const MINT = new THREE.Color("#4ff0c8");

/* ── Nebula backdrop: slow fbm gradient wash behind everything ── */
function Nebula() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBlue: { value: BLUE },
      uViolet: { value: VIOLET },
      uMint: { value: MINT },
    }),
    []
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={[0, 0, -14]} scale={[70, 42, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={mat}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uBlue, uViolet, uMint;
          ${NOISE_GLSL}
          float fbm(vec3 p){
            float v = 0.0, a = 0.5;
            for(int i = 0; i < 4; i++){ v += a * snoise(p); p *= 2.05; a *= 0.5; }
            return v;
          }
          void main(){
            vec2 p = vUv - 0.5;
            float t = uTime * 0.035;
            float n1 = fbm(vec3(p * 2.2, t));
            float n2 = fbm(vec3(p * 3.4 + 7.3, t * 1.4));
            vec3 col = vec3(0.024, 0.024, 0.047);
            col = mix(col, uBlue * 0.16, smoothstep(0.05, 0.75, n1));
            col = mix(col, uViolet * 0.13, smoothstep(0.15, 0.85, n2));
            col = mix(col, uMint * 0.05, smoothstep(0.55, 0.95, n1 * n2 + 0.3));
            float vign = smoothstep(1.05, 0.25, length(p * vec2(1.5, 1.9)));
            col *= vign;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* ── Particle field: noise-displaced glowing points ── */
function Particles({ count = 2600 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Flat ellipsoid cloud, denser toward the middle
      const r = Math.pow(Math.random(), 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * 15 * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * 7 * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * 6 * Math.cos(phi) - 2;
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBlue: { value: BLUE },
      uViolet: { value: VIOLET },
      uMint: { value: MINT },
    }),
    []
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          varying float vSeed;
          varying float vDepth;
          ${NOISE_GLSL}
          void main(){
            vSeed = aSeed;
            vec3 p = position;
            float t = uTime * 0.12;
            // Gentle volumetric drift — each particle rides the noise field
            p.x += snoise(position * 0.14 + vec3(t, 0.0, 0.0)) * 1.4;
            p.y += snoise(position * 0.14 + vec3(0.0, t, 4.7)) * 1.0;
            p.z += snoise(position * 0.14 + vec3(9.1, 0.0, t)) * 1.2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vDepth = -mv.z;
            gl_PointSize = (2.0 + aSeed * 5.0) * (16.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uBlue, uViolet, uMint;
          varying float vSeed;
          varying float vDepth;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float alpha = smoothstep(0.5, 0.05, d);
            float tw = 0.55 + 0.45 * sin(uTime * (0.6 + vSeed * 1.8) + vSeed * 40.0);
            vec3 col = mix(uBlue, uViolet, vSeed);
            col = mix(col, uMint, step(0.86, vSeed));
            float fade = smoothstep(30.0, 10.0, vDepth);
            gl_FragColor = vec4(col, alpha * tw * 0.5 * (0.4 + 0.6 * fade));
          }
        `}
      />
    </points>
  );
}

/* ── Blockchain network: nodes, edges, and pulses that travel them ── */
function buildNetwork(nodeCount: number) {
  const rng = (min: number, max: number) => min + Math.random() * (max - min);
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(
      new THREE.Vector3(rng(-6.5, 6.5), rng(-2.8, 2.8), rng(-2.5, 2.5))
    );
  }
  // Connect each node to its 2 nearest neighbours
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  const seen = new Set<string>();
  nodes.forEach((a, i) => {
    const byDist = nodes
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { j } of byDist) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([nodes[i], nodes[j]]);
      }
    }
  });
  return { nodes, edges };
}

function Network() {
  const { nodes, edges } = useMemo(() => buildNetwork(26), []);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    });
    return arr;
  }, [edges]);

  // Each pulse: which edge it rides, progress, speed, direction
  const pulses = useMemo(
    () =>
      Array.from({ length: 36 }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.4,
        dir: Math.random() > 0.5 ? 1 : -1,
      })),
    [edges.length]
  );

  useFrame((state, dt) => {
    const mesh = pulsesRef.current;
    if (mesh) {
      pulses.forEach((p, i) => {
        p.t += dt * p.speed;
        if (p.t > 1) {
          // Arrived — hop onto a fresh edge, like a settled transfer
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
          p.dir = Math.random() > 0.5 ? 1 : -1;
        }
        const [a, b] = edges[p.edge];
        const from = p.dir === 1 ? a : b;
        const to = p.dir === 1 ? b : a;
        dummy.position.lerpVectors(from, to, p.t);
        // Bright at departure, fading toward arrival glow
        const s = 0.045 + 0.05 * Math.sin(p.t * Math.PI);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
    const nm = nodesRef.current;
    if (nm) {
      const t = state.clock.elapsedTime;
      nodes.forEach((n, i) => {
        dummy.position.copy(n);
        dummy.scale.setScalar(0.055 + 0.02 * Math.sin(t * 1.4 + i * 2.1));
        dummy.updateMatrix();
        nm.setMatrixAt(i, dummy.matrix);
      });
      nm.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6e7bff"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color="#8d9aff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulses.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#4ff0c8"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

/* ── Stablecoin tokens and autonomous finance cards ── */
function Stablecoin({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.75}>
      <group position={position} scale={scale} rotation={[0.2, -0.35, -0.16]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.13, 64]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.82}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.12}
            emissive={color}
            emissiveIntensity={0.08}
          />
        </mesh>
        <mesh position={[0, -0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.035, 16, 64]} />
          <meshStandardMaterial
            color="#f7f8ff"
            metalness={0.8}
            roughness={0.22}
            emissive="#ffffff"
            emissiveIntensity={0.18}
          />
        </mesh>
        <group position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh scale={[0.08, 0.34, 0.035]}>
            <boxGeometry />
            <meshBasicMaterial color="#f7f8ff" />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0.65]} scale={[0.24, 0.045, 0.035]}>
            <boxGeometry />
            <meshBasicMaterial color="#f7f8ff" />
          </mesh>
          <mesh position={[0, -0.18, 0]} rotation={[0, 0, 0.65]} scale={[0.24, 0.045, 0.035]}>
            <boxGeometry />
            <meshBasicMaterial color="#f7f8ff" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function FinanceCard({
  position,
  rotation,
  accent,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  accent: string;
  scale?: number;
}) {
  return (
    <Float speed={0.85} rotationIntensity={0.14} floatIntensity={0.65}>
      <group position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[2.45, 1.38, 0.08]} radius={0.12} smoothness={5}>
          <meshPhysicalMaterial
            color="#111120"
            transparent
            opacity={0.72}
            roughness={0.22}
            metalness={0.4}
            transmission={0.16}
            thickness={0.8}
            clearcoat={1}
          />
        </RoundedBox>
        <mesh position={[-0.86, 0.43, 0.07]} scale={[0.35, 0.035, 0.025]}>
          <boxGeometry />
          <meshBasicMaterial color={accent} transparent opacity={0.95} />
        </mesh>
        <mesh position={[-0.56, 0.12, 0.07]} scale={[0.64, 0.07, 0.025]}>
          <boxGeometry />
          <meshBasicMaterial color="#f5f5f8" transparent opacity={0.82} />
        </mesh>
        <mesh position={[-0.73, -0.13, 0.07]} scale={[0.47, 0.03, 0.025]}>
          <boxGeometry />
          <meshBasicMaterial color="#f5f5f8" transparent opacity={0.28} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[0.18 + i * 0.19, -0.27 + Math.sin(i * 1.6) * 0.16, 0.07]}
            scale={[0.035, 0.13 + i * 0.035, 0.025]}
          >
            <boxGeometry />
            <meshBasicMaterial
              color={i > 2 ? "#4ff0c8" : accent}
              transparent
              opacity={0.45 + i * 0.09}
            />
          </mesh>
        ))}
        <mesh position={[0.82, 0.43, 0.07]}>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color="#4ff0c8" />
        </mesh>
      </group>
    </Float>
  );
}

function FinancialObjects() {
  return (
    <group>
      <Stablecoin position={[-5.8, 2.2, -0.6]} color="#6e7bff" scale={0.82} />
      <Stablecoin position={[5.35, -2.4, -1.2]} color="#4ff0c8" scale={0.58} />
      <Stablecoin position={[5.9, 2.65, -2.2]} color="#a07bff" scale={0.44} />
      <FinanceCard
        position={[-5.6, -2.2, -1.2]}
        rotation={[0.18, 0.34, -0.12]}
        accent="#6e7bff"
        scale={0.72}
      />
      <FinanceCard
        position={[5.3, 1.55, -1.4]}
        rotation={[-0.1, -0.34, 0.1]}
        accent="#a07bff"
        scale={0.62}
      />
    </group>
  );
}

/* ── Camera drift + mouse parallax on the whole scene ── */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const targetX = pointer.y * 0.08 + Math.sin(t * 0.07) * 0.04;
    const targetY = pointer.x * 0.14 + t * 0.015;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2, dt);
    g.position.y = Math.sin(t * 0.18) * 0.18;
  });
  return <group ref={group}>{children}</group>;
}

/**
 * The hero WebGL scene. `variant="ambient"` drops the network for a
 * quieter backdrop (used on /company).
 */
export default function HeroScene({
  variant = "full",
  className,
}: {
  variant?: "full" | "ambient";
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 11], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.46} color="#c7ceff" />
          <pointLight position={[-5, 4, 6]} intensity={36} color="#6e7bff" distance={18} />
          <pointLight position={[5, -3, 5]} intensity={28} color="#4ff0c8" distance={16} />
          <Rig>
            <Nebula />
            <Particles count={variant === "full" ? 2600 : 1400} />
            {variant === "full" && (
              <>
                <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.4}>
                  <Network />
                </Float>
                <FinancialObjects />
              </>
            )}
          </Rig>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
