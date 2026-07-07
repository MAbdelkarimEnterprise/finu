import Image from "next/image";
import { Wifi } from "lucide-react";

type Variant = "royal" | "navy";

/* Gradient stops are shades of the brand primary (#4F7CFF) and the
   midnight surfaces — no colors outside the Finu family. */
const SKINS: Record<Variant, { background: string; glow: string }> = {
  royal: {
    background:
      "linear-gradient(140deg, #6a90ff 0%, #4f7cff 32%, #2e4fd9 72%, #24399f 100%)",
    glow: "radial-gradient(closest-side, rgba(247,249,255,0.45), transparent)",
  },
  navy: {
    background:
      "linear-gradient(135deg, #141f3a 0%, #0d1428 55%, #16264d 100%)",
    glow: "radial-gradient(closest-side, rgba(79,124,255,0.5), transparent)",
  },
};

/** EMV chip drawn in CSS — gold pads with contact lines. */
function Chip() {
  return (
    <span
      aria-hidden
      className="grid h-7 w-9 place-items-center rounded-md border border-[rgba(7,21,47,0.25)]"
      style={{
        background:
          "linear-gradient(135deg, #f2d693, #d9ab55 55%, #f2d693)",
      }}
    >
      <span className="h-3.5 w-5 rounded-sm border border-[rgba(7,21,47,0.3)]" />
    </span>
  );
}

/**
 * Reusable Finu card. A visual brand mark only — the VISA wordmark is
 * a text mark for the mockup and does not represent an issued product.
 */
export default function FinuCard({
  variant = "royal",
  holder = "MARIA SANTOS",
  expiry = "09/29",
  className = "",
}: {
  variant?: Variant;
  holder?: string;
  expiry?: string;
  className?: string;
}) {
  const skin = SKINS[variant];

  return (
    <div
      aria-label={`Finu ${variant} card`}
      className={`relative aspect-[1.586] w-full overflow-hidden rounded-[24px] border p-5 ${className}`}
      style={{
        borderColor: "rgba(247,249,255,0.18)",
        background: skin.background,
        boxShadow:
          "0 24px 50px -22px rgba(7,21,47,0.55), inset 0 1px 0 rgba(247,249,255,0.25)",
      }}
    >
      {/* Gloss + corner glow */}
      <div
        aria-hidden
        className="absolute -right-14 -top-20 h-48 w-48 rounded-full opacity-50"
        style={{ background: skin.glow }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 opacity-25"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35), transparent)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <Image
            src="/images/finu-logo.png"
            alt=""
            width={64}
            height={20}
            className="h-4 w-auto brightness-0 invert"
          />
          <Wifi
            className="h-5 w-5 rotate-90 text-[rgba(247,249,255,0.75)]"
            aria-hidden
          />
        </div>

        <Chip />

        <div>
          <p className="f-mono text-[0.72rem] tracking-[0.28em] text-[rgba(247,249,255,0.92)]">
            •••• •••• •••• 4021
          </p>
          <div className="mt-2.5 flex items-end justify-between">
            <div>
              <p className="f-mono text-[0.45rem] text-[rgba(247,249,255,0.55)]">
                CARDHOLDER
              </p>
              <p className="f-mono mt-0.5 text-[0.6rem] tracking-[0.12em] text-[rgba(247,249,255,0.9)]">
                {holder}
              </p>
            </div>
            <div>
              <p className="f-mono text-[0.45rem] text-[rgba(247,249,255,0.55)]">
                EXPIRES
              </p>
              <p className="f-mono mt-0.5 text-[0.6rem] text-[rgba(247,249,255,0.9)]">
                {expiry}
              </p>
            </div>
            <p
              className="text-[1rem] font-semibold italic tracking-tight text-white"
              aria-label="Visa"
            >
              VISA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
