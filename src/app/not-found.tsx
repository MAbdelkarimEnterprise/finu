import Link from "next/link";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";

export default function NotFound() {
  return (
    <div className={finuFontClass}>
      <div className="finu flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="f-display text-[clamp(5rem,15vw,10rem)] text-[var(--f-ink-faint)]">
          404
        </p>
        <h1 className="f-display mt-2 text-2xl">This page doesn&apos;t exist.</h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--f-ink-dim)]">
          The value you&apos;re looking for has moved — or never settled.
        </p>
        <Link href="/" className="f-btn f-btn-dark mt-10">
          Back home
        </Link>
      </div>
    </div>
  );
}
