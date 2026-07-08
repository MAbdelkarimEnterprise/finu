"use client";

/*
 * Original FINU product symbols — dots, data lines, layers, orbital
 * nodes in the Midnight Intelligence palette. Pure SVG + CSS
 * keyframes; they idle quietly and speed up/brighten when their tile
 * is active (driven by the tile's --glyph-rate / opacity cascade).
 */

function AiSpark() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <circle cx="22" cy="22" r="3.2" fill="#8668FF" className="f-glyph-core" />
      <g stroke="rgba(134,104,255,0.55)" strokeWidth="1.2">
        <line x1="22" y1="6" x2="22" y2="13" />
        <line x1="22" y1="31" x2="22" y2="38" />
        <line x1="6" y1="22" x2="13" y2="22" />
        <line x1="31" y1="22" x2="38" y2="22" />
      </g>
      <g fill="#5aa8ff" className="f-glyph-orbit">
        <circle cx="22" cy="8" r="1.6" />
        <circle cx="36" cy="22" r="1.6" />
        <circle cx="22" cy="36" r="1.6" />
        <circle cx="8" cy="22" r="1.6" />
      </g>
    </svg>
  );
}

function CardLayers() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <rect
        x="8"
        y="16"
        width="28"
        height="18"
        rx="4"
        fill="rgba(79,124,255,0.16)"
        stroke="rgba(79,124,255,0.5)"
      />
      <rect
        x="12"
        y="10"
        width="28"
        height="18"
        rx="4"
        fill="#EEF3FF"
        stroke="#1e5eff"
        className="f-glyph-slide"
      />
      <rect x="16" y="15" width="8" height="2.4" rx="1.2" fill="#5aa8ff" />
      <circle cx="34" cy="23" r="2" fill="rgba(255, 255, 255,0.5)" />
    </svg>
  );
}

function TransferPath() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <path
        d="M6 30 C 16 12, 28 12, 38 26"
        fill="none"
        stroke="rgba(79,124,255,0.45)"
        strokeWidth="1.4"
        strokeDasharray="3 4"
      />
      <circle cx="6" cy="30" r="2.4" fill="#4F7CFF" />
      <circle cx="38" cy="26" r="2.4" fill="#39D98A" />
      <circle r="2" fill="#5aa8ff" className="f-glyph-travel" />
    </svg>
  );
}

function WalletStack() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <g className="f-glyph-breathe">
        <rect x="9" y="12" width="26" height="5" rx="2.5" fill="rgba(90, 168, 255,0.55)" />
      </g>
      <g className="f-glyph-breathe" style={{ animationDelay: "-1.2s" }}>
        <rect x="9" y="20" width="26" height="5" rx="2.5" fill="rgba(79,124,255,0.7)" />
      </g>
      <g className="f-glyph-breathe" style={{ animationDelay: "-2.4s" }}>
        <rect x="9" y="28" width="26" height="5" rx="2.5" fill="rgba(134,104,255,0.55)" />
      </g>
    </svg>
  );
}

function CreditMeter() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <path
        d="M8 32 A 16 16 0 1 1 36 32"
        fill="none"
        stroke="#E6EAF2"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M8 32 A 16 16 0 1 1 36 32"
        fill="none"
        stroke="#1e5eff"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
        className="f-glyph-meter"
      />
      <circle cx="22" cy="27" r="2.4" fill="#5aa8ff" />
    </svg>
  );
}

function SwapOrbit() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <path
        d="M12 16 A 12 12 0 0 1 32 16"
        fill="none"
        stroke="rgba(79,124,255,0.5)"
        strokeWidth="1.4"
      />
      <path
        d="M32 28 A 12 12 0 0 1 12 28"
        fill="none"
        stroke="rgba(90, 168, 255,0.5)"
        strokeWidth="1.4"
      />
      <g className="f-glyph-spin">
        <circle cx="22" cy="8" r="2.2" fill="#4F7CFF" />
        <circle cx="22" cy="36" r="2.2" fill="#5aa8ff" />
      </g>
    </svg>
  );
}

function P2PNodes() {
  return (
    <svg viewBox="0 0 44 44" className="f-glyph" aria-hidden>
      <line
        x1="13"
        y1="22"
        x2="31"
        y2="22"
        stroke="rgba(90, 168, 255,0.55)"
        strokeWidth="1.4"
        strokeDasharray="2.5 3.5"
        className="f-glyph-link"
      />
      <circle cx="10" cy="22" r="4" fill="#EEF3FF" stroke="#1e5eff" strokeWidth="1.6" />
      <circle cx="34" cy="22" r="4" fill="#EEF3FF" stroke="#4d7cff" strokeWidth="1.6" />
      <circle cx="10" cy="22" r="1.5" fill="#1e5eff" />
      <circle cx="34" cy="22" r="1.5" fill="#4d7cff" />
    </svg>
  );
}

const GLYPHS: Record<string, React.FC> = {
  "finu-ai": AiSpark,
  card: CardLayers,
  transfer: TransferPath,
  wallet: WalletStack,
  credit: CreditMeter,
  swap: SwapOrbit,
  p2p: P2PNodes,
};

export default function ProductGlyph({ id }: { id: string }) {
  const Glyph = GLYPHS[id] ?? AiSpark;
  return <Glyph />;
}

/**
 * FINU dotted-arrow: three blue/cyan nodes that resolve into a
 * directional arrow when the tile activates.
 */
export function DottedArrow() {
  return (
    <svg viewBox="0 0 40 16" className="f-dotted-arrow" aria-hidden>
      <circle cx="6" cy="8" r="1.8" className="f-da-dot" />
      <circle cx="14" cy="8" r="1.8" className="f-da-dot" style={{ transitionDelay: "40ms" }} />
      <circle cx="22" cy="8" r="1.8" className="f-da-dot" style={{ transitionDelay: "80ms" }} />
      <path
        d="M27 3 L 33 8 L 27 13"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="f-da-head"
      />
    </svg>
  );
}
