"use client";

import { useEffect, useRef, useState } from "react";
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
const H_STOPS = [12.5, 37.5, 62.5, 87.5];
const CYCLE = 7;
const TIMES = [0, 0.08, 0.28, 0.4, 0.6, 0.72, 0.92, 1];
const H_DOT_LEFT = [
  `${H_STOPS[0]}%`, `${H_STOPS[0]}%`,
  `${H_STOPS[1]}%`, `${H_STOPS[1]}%`,
  `${H_STOPS[2]}%`, `${H_STOPS[2]}%`,
  `${H_STOPS[3]}%`, `${H_STOPS[3]}%`,
];
const H_FILL_WIDTH = [
  "0%", "0%",
  `${H_STOPS[1] - H_STOPS[0]}%`, `${H_STOPS[1] - H_STOPS[0]}%`,
  `${H_STOPS[2] - H_STOPS[0]}%`, `${H_STOPS[2] - H_STOPS[0]}%`,
  `${H_STOPS[3] - H_STOPS[0]}%`, `${H_STOPS[3] - H_STOPS[0]}%`,
];
const GLOW_OPACITY = [1, 1, 1, 1, 1, 1, 1, 0];

export default function Process() {
  const gridRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [vStops, setVStops] = useState<number[] | null>(null);

  // Mobile stacks the steps in a single column, so the neon line/dot travel
  // vertically between icon centers instead of horizontally. Icon heights
  // vary with description length, so the stop positions are measured from
  // the DOM (via offsetTop, which ignores the entrance animation's
  // transform) rather than assumed from fixed percentages.
  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const centers = iconRefs.current.map((icon) => {
        if (!icon) return 0;
        let top = 0;
        let el: HTMLElement | null = icon;
        while (el && el !== grid) {
          top += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return top + icon.offsetHeight / 2;
      });
      setVStops(centers);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const vBase = vStops?.[0] ?? 0;
  const V_DOT_TOP = vStops && [
    `${vStops[0]}px`, `${vStops[0]}px`,
    `${vStops[1]}px`, `${vStops[1]}px`,
    `${vStops[2]}px`, `${vStops[2]}px`,
    `${vStops[3]}px`, `${vStops[3]}px`,
  ];
  const V_FILL_HEIGHT = vStops && [
    "0px", "0px",
    `${vStops[1] - vBase}px`, `${vStops[1] - vBase}px`,
    `${vStops[2] - vBase}px`, `${vStops[2] - vBase}px`,
    `${vStops[3] - vBase}px`, `${vStops[3] - vBase}px`,
  ];

  return (
    <section id="come-lavoro" className="px-6 pb-32 pt-20">
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
          ref={gridRef}
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
              left: `${H_STOPS[0]}%`,
              background: "linear-gradient(to right, transparent, var(--accent-2))",
              boxShadow: "0 0 8px var(--accent-2)",
            }}
            animate={{ width: H_FILL_WIDTH, opacity: GLOW_OPACITY }}
            transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-8 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
            style={{
              background: "var(--accent-2)",
              boxShadow: "0 0 10px 2px var(--accent-2), 0 0 22px 6px rgba(34,211,238,0.45)",
            }}
            animate={{ left: H_DOT_LEFT, opacity: GLOW_OPACITY }}
            transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
          />

          {vStops && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent sm:hidden"
              style={{ top: vStops[0], height: vStops[3] - vStops[0] }}
            />
          )}

          {vStops && V_FILL_HEIGHT && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2 sm:hidden"
              style={{
                top: vStops[0],
                background: "linear-gradient(to bottom, transparent, var(--accent-2))",
                boxShadow: "0 0 8px var(--accent-2)",
              }}
              animate={{ height: V_FILL_HEIGHT, opacity: GLOW_OPACITY }}
              transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {vStops && V_DOT_TOP && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full sm:hidden"
              style={{
                background: "var(--accent-2)",
                boxShadow: "0 0 10px 2px var(--accent-2), 0 0 22px 6px rgba(34,211,238,0.45)",
              }}
              animate={{ top: V_DOT_TOP, opacity: GLOW_OPACITY }}
              transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={item} className="relative text-center">
              <div
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="glass relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-accent"
              >
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
