"use client";

import { motion } from "framer-motion";
import Counter from "./Counter";

const STATS = [
  {
    value: 3,
    suffix: "x/settimana",
    label: "articoli pubblicati in autonomia da un agente",
  },
  { value: 24, suffix: "/7", label: "chatbot e assistenti che non vanno mai offline" },
  { value: 100, suffix: "%", label: "soluzioni su misura, zero template" },
];

export default function About() {
  return (
    <section id="chi-sono" className="px-6 pb-32 pt-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Chi sono
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Mi chiamo <span className="text-foreground">Marco Losso</span>,
            sono un perito informatico esperto in intelligenza artificiale,
            agenti IA e automazioni aziendali: chatbot, cloni virtuali,
            gestione clienti, gestione documenti, statistiche e analisi dati.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Ho sviluppato agenti IA che analizzano il web per trovare i
            problemi reali che le persone cercano su un argomento, studiano le
            fonti più autorevoli in materia, scrivono un articolo di blog
            completo di immagine dedicata e, alla fine, consigliano il
            prodotto o servizio che risolve quel problema.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Costruisco anche agenti che sostituiscono completamente una
            segretaria, un ragioniere o un intero ufficio ticket di
            assistenza, e chatbot addestrati sulla tua azienda che rispondono
            a qualsiasi domanda, lasciandoti più tempo per le cose importanti.
            Mi occupo inoltre di social media management e copywriting, con
            grafiche, funnel di vendita, landing page, reel e campagne ADS
            automatizzate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          <div className="mx-auto w-48 overflow-hidden rounded-3xl border border-border sm:w-56 lg:mx-0 lg:w-full lg:max-w-xs">
            <img
              src="/marco-losso.png"
              alt="Marco Losso"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6">
                <div className="text-gradient text-3xl font-bold">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
