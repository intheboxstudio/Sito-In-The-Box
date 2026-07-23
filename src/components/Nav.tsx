"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { href: "/#servizi", label: "Servizi" },
  { href: "/#progetti", label: "Progetti" },
  { href: "/#chi-sono", label: "Chi sono" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
          <img src="/logo-bianco.png" alt="" className="h-7 w-7 object-contain" />
          <span>
            IN THE BOX <span className="text-gradient">STUDIO</span>
          </span>
        </Link>
        <ul className="hidden items-center gap-8 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <MagneticButton
          href="/contatti"
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          Iniziamo
        </MagneticButton>
      </nav>
    </header>
  );
}
