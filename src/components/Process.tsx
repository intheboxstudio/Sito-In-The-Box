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

// The neon line and dot travel step-by-step between icon centers: arrive,
// hold briefly, move to the next, fading out right at the end so the reset
// back to the start happens while invisible instead of as a visible jump.
const CYCLE = 7;
const TIMES = [0, 0.08, 0.28, 0.4, 0.6, 0.72, 0.92, 1];
const GLOW_OPACITY = [1, 1, 1, 1, 1, 1, 1, 0];

type Point = { x: number; y: number };

export default function Process() {
  const gridRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // The grid reflows from 1 to 2 to 4 columns across breakpoints, so the
  // connecting line is drawn from the icons' real measured centers rather
  // than an assumed layout — it automatically follows whatever order the
  // icons land in at any screen size, tablet included. Positions come from
  // the offsetLeft/offsetTop chain (unaffected by the entrance animation's
  // transform) instead of getBoundingClientRect.
  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const pts = iconRefs.current.map((icon) => {
        if (!icon) return { x: 0, y: 0 };
        let x = 0;
        let y = 0;
        let el: HTMLElement | null = icon;
        while (el && el !== grid) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return { x: x + icon.offsetWidth / 2, y: y + icon.offsetHeight / 2 };
      });
      setPoints(pts);
      setSize({ width: grid.clientWidth, height: grid.clientHeight });
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

  let pathD: string | null = null;
  let pathLengthKeyframes: number[] | null = null;
  let dotX: number[] | null = null;
  let dotY: number[] | null = null;

  if (points && points.length === STEPS.length) {
    pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;

    const segmentLengths = points.slice(0, -1).map((p, i) => {
      const next = points[i + 1];
      return Math.hypot(next.x - p.x, next.y - p.y);
    });
    const total = segmentLengths.reduce((a, b) => a + b, 0) || 1;
    const cumulative = [0];
    segmentLengths.forEach((len) => cumulative.push(cumulative[cumulative.length - 1] + len));
    const frac = cumulative.map((c) => c / total);

    pathLengthKeyframes = [0, 0, frac[1], frac[1], frac[2], frac[2], frac[3], frac[3]];
    dotX = [
      points[0].x, points[0].x,
      points[1].x, points[1].x,
      points[2].x, points[2].x,
      points[3].x, points[3].x,
    ];
    dotY = [
      points[0].y, points[0].y,
      points[1].y, points[1].y,
      points[2].y, points[2].y,
      points[3].y, points[3].y,
    ];
  }

  return (
    <section id="come-lavoro" className="px-6 pb-16 pt-20 sm:pb-32">
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
          {pathD && size.width > 0 && size.height > 0 && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0"
              width="100%"
              height="100%"
              viewBox={`0 0 ${size.width} ${size.height}`}
              preserveAspectRatio="none"
            >
              <path d={pathD} stroke="var(--border)" strokeWidth={1} fill="none" />
              <motion.path
                d={pathD}
                stroke="var(--accent-2)"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
                style={{ filter: "drop-shadow(0 0 6px var(--accent-2))" }}
                animate={{ pathLength: pathLengthKeyframes ?? undefined, opacity: GLOW_OPACITY }}
                transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                r={5}
                fill="var(--accent-2)"
                style={{ filter: "drop-shadow(0 0 8px var(--accent-2))" }}
                animate={{ cx: dotX ?? undefined, cy: dotY ?? undefined, opacity: GLOW_OPACITY }}
                transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
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
