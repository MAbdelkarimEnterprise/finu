import { CalendarCheck, Eye, LockKeyhole, Table2 } from "lucide-react";
import { TRUST_STRIP } from "@/lib/landing-content";

const ICONS = [Table2, CalendarCheck, Eye, LockKeyhole] as const;

/**
 * Credibility band directly under the hero — four short value
 * statements, no invented numbers. This is the section the hero's
 * clipped phone "lands" on.
 */
export default function TrustStrip() {
  return (
    <section aria-label="Why people trust Finu" className="relative bg-[#0b1530] text-white">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-x-10 gap-y-8 px-5 pb-14 pt-48 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:pt-44">
        {TRUST_STRIP.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <div key={item.title} className="flex items-start gap-3.5">
              <span
                className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-white/[0.07]"
                aria-hidden
              >
                <Icon className="h-[1.1rem] w-[1.1rem] text-[#8fa2ff]" />
              </span>
              <div>
                <p className="text-[0.95rem] font-medium">{item.title}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-white/55">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
