import type { ReactNode } from "react";

/**
 * Standard page band: the rhythm system in component form. `loose`
 * widens the vertical breathing room (statement moments); `scrim`
 * frosts the band so text stays readable over the ocean depths;
 * `bare` drops the inner container for full-bleed children.
 */
export default function Section({
  id,
  ariaLabelledby,
  loose = false,
  scrim = false,
  bare = false,
  className = "",
  children,
}: {
  id?: string;
  ariaLabelledby?: string;
  loose?: boolean;
  scrim?: boolean;
  bare?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`${loose ? "f-section-loose" : "f-section"} ${
        scrim ? "f-scrim" : ""
      } relative scroll-mt-24 ${className}`}
    >
      {bare ? children : <div className="f-container">{children}</div>}
    </section>
  );
}
