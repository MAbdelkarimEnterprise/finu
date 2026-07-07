import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { APP_URL } from "./links";
import AmbientShader from "./AmbientShader";
import MagneticButton from "./MagneticButton";
import { Reveal, TextReveal } from "./TextReveal";

export default function FinalCTA() {
  return (
    <section
      id="download"
      aria-labelledby="download-title"
      className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="f-cta-frame relative mx-auto max-w-[1200px] rounded-[var(--f-radius)] border border-[var(--f-border-soft)]">
        {/* Living ambient field over a static gradient fallback — the
            page's second (and last) WebGL canvas, bookending the hero. */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-[inherit]"
          style={{
            background:
              "radial-gradient(80% 120% at 78% 20%, rgba(79,124,255,0.28), transparent 55%), radial-gradient(60% 100% at 20% 90%, rgba(134,104,255,0.22), transparent 60%), #0d1428",
          }}
        >
          <AmbientShader />
        </div>
        <div className="relative grid gap-12 p-8 md:grid-cols-[1.4fr_1fr] md:p-16">
          <div>
            {/* Explicit light text: this card is a deliberate navy
                anchor on the light page, so tokens don't apply here. */}
            <TextReveal
              as="h2"
              className="f-display max-w-xl text-[clamp(2rem,4.6vw,3.4rem)] text-[#f7f9ff]"
            >
              Start your stablecoin payment journey with Finu
            </TextReveal>
            <span id="download-title" className="sr-only">
              Start your stablecoin payment journey with Finu
            </span>

            <Reveal delay={0.15}>
              <p className="f-display mt-6 text-lg text-[rgba(247,249,255,0.72)] md:text-xl">
                Swift<span className="text-[var(--color-accent)]">.</span>{" "}
                Seamless<span className="text-[var(--color-accent)]">.</span>{" "}
                Secure<span className="text-[var(--color-accent)]">.</span>
              </p>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              <MagneticButton href={APP_URL} className="f-btn f-btn-primary group">
                Get App
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticButton>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex items-center justify-center md:justify-end">
            <div className="f-card f-card-raised f-card-hover flex flex-col items-center gap-4 p-7">
              <div className="rounded-xl bg-white p-3">
                <Image
                  src="/images/qr.png"
                  alt="QR code to download the Finu app"
                  width={148}
                  height={148}
                  className="h-36 w-36"
                />
              </div>
              <p className="f-mono text-[0.62rem] text-[var(--color-text-secondary)]">
                Scan to Download
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
