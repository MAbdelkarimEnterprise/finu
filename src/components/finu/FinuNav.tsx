"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Magnetic from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FinuNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-700 md:px-10 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,6,12,0.85), rgba(6,6,12,0.4) 70%, transparent)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            maskImage: "linear-gradient(to bottom, black 60%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)",
          }}
        />

        <Link
          href="/"
          className="f-display relative z-10 text-[1.35rem] tracking-tight"
        >
          finu
          <span className="text-[var(--f-mint)]">.</span>
        </Link>

        <nav className="relative z-10 hidden items-center gap-9 text-sm md:flex">
          <a href="/#platform" className="f-navlink">
            Platform
          </a>
          <a href="/#features" className="f-navlink">
            Features
          </a>
          <Link href="/company" className="f-navlink">
            Company
          </Link>
        </nav>

        <div className="relative z-10">
          <Magnetic strength={0.3}>
            <a href="#" className="f-btn f-btn-primary !px-6 !py-2.5 text-sm">
              Get Started
            </a>
          </Magnetic>
        </div>
      </div>
    </motion.header>
  );
}
