"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FinuNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 180 && y > lastY.current + 4);
        if (Math.abs(y - lastY.current) > 4) lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 md:px-5"
    >
      <div
        className={`pointer-events-auto mx-auto mt-3 flex max-w-[1360px] items-center justify-between rounded-full border px-4 transition-all duration-700 md:px-5 ${
          scrolled
            ? "f-nav-glass border-white/10 py-2.5"
            : "border-transparent bg-transparent py-4"
        }`}
      >
        <Link
          href="/"
          className="f-display relative z-10 px-2 text-[1.4rem] tracking-[-0.06em]"
          aria-label="Finu home"
        >
          finu
          <span className="text-[var(--f-lime)]">.</span>
        </Link>

        <nav className="relative z-10 hidden items-center gap-10 text-[0.82rem] md:flex">
          <a href="/#thesis" className="f-navlink">
            Thesis
          </a>
          <a href="/#features" className="f-navlink">
            Platform
          </a>
          <a href="/#numbers" className="f-navlink">
            Numbers
          </a>
          <a href="/#infrastructure" className="f-navlink">
            Infrastructure
          </a>
        </nav>

        <div className="relative z-10">
          <Magnetic strength={0.3}>
            <a
              href="https://app.meetfinu.com"
              className="f-btn f-btn-primary group !px-5 !py-2.5 text-sm"
            >
              Open Finu
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
        </div>
      </div>
    </motion.header>
  );
}
