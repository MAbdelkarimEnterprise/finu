import { Plus } from "lucide-react";
import { Reveal, TextReveal } from "./TextReveal";

const QA = [
  {
    q: "What is Finu?",
    a: "Finu is an AI-native orchestration layer for money. Businesses and platforms use it to route, settle, and optimize value across stablecoin and banking rails from one interface.",
  },
  {
    q: "How does Finu decide how money moves?",
    a: "Every transfer starts as an intent — amount, destination, deadline, constraints. Finu scores the available rails on speed, cost, and risk, selects the best one, and shows you the full decision from start to finish.",
  },
  {
    q: "Which rails does Finu support?",
    a: "Stablecoins such as USDC, USDT, and EURC across major blockchain networks, alongside banking and local payout rails — chosen per transaction, not per integration.",
  },
  {
    q: "Is Finu a bank?",
    a: "No. Finu is financial infrastructure — an intelligence layer that works across regulated rails rather than replacing them.",
  },
  {
    q: "How do I get started?",
    a: "Open Finu in your browser at app.meetfinu.com — no download required.",
  },
];

/**
 * FAQ styled as a conversation with Finu: question pills that expand
 * into answer bubbles. Native details/summary keeps it fully
 * keyboard-operable and JS-free.
 */
export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 px-[var(--f-gutter)] py-[var(--f-gutter)]"
    >
      <div className="f-scene f-scene-grain !mx-0 bg-[var(--f-bg-warm)] px-5 py-20 md:py-28">
        <div className="f-faq mx-auto w-full max-w-2xl">
          <Reveal>
            <p className="f-eyebrow text-[var(--f-ink-faint)]">Ask Finu</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="f-display mt-5 text-[clamp(2rem,4vw,3.2rem)]"
          >
            Questions, answered.
          </TextReveal>

          <div className="mt-12 space-y-4">
            {QA.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.05}>
                <details className="group">
                  <summary className="f-bubble-q flex w-fit max-w-full items-center gap-4 py-3 pl-5 pr-3">
                    <span className="text-[0.92rem] font-medium text-[var(--f-ink)]">
                      {item.q}
                    </span>
                    <span className="f-faq-icon grid h-8 w-8 flex-none place-items-center rounded-full border border-[rgba(33,29,25,0.1)] bg-white text-[var(--f-ink-dim)]">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </summary>
                  <div className="f-bubble-a mt-3 max-w-[90%] px-5 py-4 md:max-w-[80%]">
                    <p className="text-[0.88rem] leading-relaxed text-[var(--f-ink-dim)]">
                      {item.a}
                    </p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
