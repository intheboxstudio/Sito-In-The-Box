"use client";

import { motion } from "framer-motion";
import { PhoneCall, ClipboardList, Code2, LifeBuoy, type LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: PhoneCall,
    title: "Chiamata conoscitiva gratuita",
    description:
      "Ci sentiamo per capire di cosa ha davvero bisogno la tua azienda, senza impegno e senza tecnicismi.",
  },
  {
    icon: ClipboardList,
    title: "Proposta chiara",
    description:
      "Ti presento cosa costruirò, i tempi previsti e il costo, senza sorprese nascoste dopo.",
  },
  {
    icon: Code2,
    title: "Sviluppo con aggiornamenti",
    description:
      "Costruisco la soluzione tenendoti aggiornato passo dopo passo, così sai sempre a che punto siamo.",
  },
  {
    icon: LifeBuoy,
    title: "Lancio e supporto continuo",
    description:
      "Il sistema va online e resto a disposizione per sistemare imprevisti e adattarlo quando cambiano le tue esigenze.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

// Icon centers for a 4-column grid (12.5%, 37.5%, 62.5%, 87.5%). The neon
// line and dot travel step-by-step between them: arrive, hold briefly, move
// to the next, fading out right at the end so the reset back to the start
// happens while invisible instead of as a visible jump.
const STOPS = [12.5, 37.5, 62.5, 87.5];
const CYCLE = 7;
const TIMES = [0, 0.08, 0.28, 0.4, 0.6, 0.72, 0.92, 1];
const DOT_LEFT = [
  `${STOPS[0]}%`, `${STOPS[0]}%`,
  `${STOPS[1]}%`, `${STOPS[1]}%`,
  `${STOPS[2]}%`, `${STOPS[2]}%`,
  `${STOPS[3]}%`, `${STOPS[3]}%`,
];
const FILL_WIDTH = [
  "0%", "0%",
  `${STOPS[1] - STOPS[0]}%`, `${STOPS[1] - STOPS[0]}%`,
  `${STOPS[2] - STOPS[0]}%`, `${STOPS[2] - STOPS[0]}%`,
  `${STOPS[3] - STOPS[0]}%`, `${STOPS[3] - STOPS[0]}%`,
];
const GLOW_OPACITY = [1, 1, 1, 1, 1, 1, 1, 0];

export default function Process() {
  return (
    <section id="come-lavoro" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Come lavoro</h2>
          <p className="mt-4 text-muted">
            Nessun prezzo fisso a listino, ma un processo trasparente dalla prima chiamata al
            supporto dopo il lancio.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-8 hidden h-px lg:block"
            style={{
              left: `${STOPS[0]}%`,
              background: "linear-gradient(to right, transparent, var(--accent-2))",
              boxShadow: "0 0 8px var(--accent-2)",
            }}
            animate={{ width: FILL_WIDTH, opacity: GLOW_OPACITY }}
            transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-8 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
            style={{
              background: "var(--accent-2)",
              boxShadow: "0 0 10px 2px var(--accent-2), 0 0 22px 6px rgba(34,211,238,0.45)",
            }}
            animate={{ left: DOT_LEFT, opacity: GLOW_OPACITY }}
            transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
          />

          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={item} className="relative text-center">
              <div className="glass relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-accent">
                <step.icon className="h-6 w-6" />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
