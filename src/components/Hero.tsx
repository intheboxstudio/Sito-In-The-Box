"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroChart from "./HeroChart";
import MagneticButton from "./MagneticButton";
import CodeBackdrop from "./CodeBackdrop";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden px-6 pb-6 pt-24 text-center"
    >
      <div className="flex flex-1 flex-col items-center justify-center sm:justify-end">
        <div className="mb-6 flex w-full justify-center sm:mb-10">
          <HeroChart />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Disponibile per nuovi progetti
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.1] tracking-tight sm:text-7xl"
        >
          Costruisco agenti AI che{" "}
          <span className="text-gradient">lavorano al posto tuo</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-6 max-w-2xl text-balance text-lg text-muted sm:text-xl"
        >
          Automazione aziendale, chatbot su misura, siti che scrivono i propri
          articoli e strategie social gestite dall&apos;AI. Progetto e
          realizzo sistemi intelligenti che fanno crescere il tuo business.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            href="/contatti"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            Parliamo del tuo progetto
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          <a
            href="#progetti"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            Guarda i progetti
          </a>
        </motion.div>
      </div>

      <div className="hidden flex-1 sm:block" />

      <div className="relative hidden h-[clamp(6rem,14vh,9rem)] shrink-0 sm:block">
        <CodeBackdrop className="inset-0 -z-10" />
      </div>

      <div className="hidden flex-1 sm:block" />
    </section>
  );
}
