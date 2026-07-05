import { Reveal } from "./TextReveal";

const CARDS = [
  {
    scene: "f-scene-night",
    tone: "cream",
    text: "24/7, 365. Settlement that never waits for Monday.",
  },
  {
    scene: "f-scene-dawn",
    tone: "ink",
    text: "150+ markets reachable from one interface.",
  },
  {
    scene: "f-scene-field",
    tone: "cream",
    text: "Guardrails built in — anomalies held in milliseconds.",
  },
  {
    scene: "f-scene-sky",
    tone: "ink",
    text: "Every payment carries rules, logic, and intent.",
  },
  {
    scene: "f-scene-dusk",
    tone: "cream",
    text: "One layer across banks, blockchains, and local payouts.",
  },
  {
    scene: "f-scene-sand",
    tone: "ink",
    text: "No black boxes. Full transaction state, in plain sight.",
  },
];

/**
 * Slow-panning gallery of tilted capability cards. Pure CSS animation
 * (paused on hover, disabled under reduced motion), duplicated track
 * for a seamless loop.
 */
export default function SkewGallery() {
  const doubled = [...CARDS, ...CARDS];
  return (
    <section aria-label="Finu capabilities" className="overflow-hidden py-20 md:py-28">
      <Reveal>
        <div
          className="f-skew-track items-center gap-6 pr-6"
          style={{ "--f-pan-duration": "70s" } as React.CSSProperties}
        >
          {doubled.map((card, i) => (
            <div
              key={i}
              aria-hidden={i >= CARDS.length}
              className={`f-scene f-scene-grain ${card.scene} !mx-0 flex h-[21rem] w-[17rem] flex-none flex-col justify-between rounded-[1.4rem] p-6 md:h-[24rem] md:w-[19rem] ${
                i % 2 ? "rotate-[2.2deg]" : "-rotate-[2.2deg]"
              } ${
                card.tone === "ink"
                  ? "text-[var(--f-ink)]"
                  : "text-[var(--f-cream)]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 ${
                  card.tone === "ink" ? "bg-[var(--f-ink)]" : "bg-[var(--f-cream)]"
                }`}
              />
              <p className="text-[1.05rem] font-medium leading-snug md:text-lg">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
