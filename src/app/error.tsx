"use client";

import { useEffect } from "react";
import Link from "next/link";
import "@/styles/finu.css";
import { finuFontClass } from "@/components/finu/fonts";

/**
 * Route-level error boundary. If a client render throws anywhere on
 * the page (a third-party script conflict, an animation library
 * failing in a restrictive in-app browser, a WebGL driver quirk),
 * this replaces the crash with real, readable content and a way back
 * — instead of leaving the visitor staring at a blank, stuck page.
 */
export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={finuFontClass}>
      <div className="finu flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="f-display text-2xl">Something didn&apos;t load right.</h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
          The page hit an unexpected error. Reloading usually fixes it.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="f-btn f-btn-primary">
            Try again
          </button>
          <Link href="/" className="f-btn f-btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
