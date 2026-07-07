"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself.
 * Deliberately dependency-free (no imported CSS, no fonts) since the
 * layout that would normally provide those is what failed — this must
 * render on its own no matter what broke.
 */
export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#050816",
          color: "#F7F9FF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
          Something didn&apos;t load right.
        </h1>
        <p style={{ color: "#A8B3CC", maxWidth: 360, fontSize: "0.9rem" }}>
          The page hit an unexpected error. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#4F7CFF",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
