import { Reveal } from "./TextReveal";

const CARDS = [
  {
    scene: "f-scene-field",
    title: "Get settlement off your mind.",
    body: "Finu tracks every payment from intent to finality, and reacts before you have to. No more chasing wires across time zones.",
  },
  {
    scene: "f-scene-night",
    title: "More adaptive than any playbook.",
    body: "Every transfer teaches Finu about your corridors, costs, and timing — so the next one routes smarter than the last.",
  },
];

/**
 * Two tall scene cards side by side, each with a caption anchored to
 * the bottom-left over a legibility scrim.
 */
export default function ImmersivePair() {
  return (
    <section className="grid gap-[var(--f-gutter)] px-[var(--f-gutter)] py-[var(--f-gutter)] md:grid-cols-2">
      {CARDS.map((card, i) => (
        <Reveal key={card.title} delay={i * 0.12} className="h-full">
          <article
            className={`f-scene f-scene-grain ${card.scene} !mx-0 flex h-full min-h-[68svh] flex-col justify-end md:min-h-[86svh]`}
          >
            {/* Scrim keeps the caption readable on any gradient */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,18,15,0.55), transparent)",
              }}
            />
            <div className="relative p-7 text-[var(--f-cream)] md:p-9">
              <h3 className="f-display text-xl md:text-2xl">{card.title}</h3>
              <p className="mt-3 max-w-sm text-[0.85rem] leading-relaxed text-[var(--f-cream-dim)]">
                {card.body}
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </section>
  );
}
