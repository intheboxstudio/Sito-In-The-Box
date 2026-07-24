"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  return (
    <section id="contatti" className="px-6 pb-32 pt-16 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="glass mx-auto max-w-4xl rounded-3xl px-8 py-16 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Hai un problema che l&apos;AI può risolvere?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Raccontami cosa vorresti automatizzare o costruire: rispondo
          personalmente a ogni richiesta.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            href="/contatti"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
          >
            <Mail className="h-4 w-4" />
            Compila il modulo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
        </div>
        <a
          href="mailto:intheboxstudio.smm@gmail.com"
          className="mt-4 inline-block text-sm text-muted transition-colors hover:text-foreground"
        >
          oppure scrivimi direttamente a intheboxstudio.smm@gmail.com
        </a>
      </motion.div>
    </section>
  );
}
