"use client";

import { motion, useReducedMotion } from "framer-motion";

// Traces a specific irregular story rather than a repeating zigzag: up,
// half retrace, higher high, a crash below the start, a small bounce, a
// small dip, a climb to the middle, a tiny dip, a run to the highest
// point, then a fall — every swing a different size, like real data.
const PATH =
  "M0,160 L85,55 L160,110 L250,25 L330,188 L400,165 L460,182 L560,95 L610,105 L700,12 L800,75";

const EASE = [0.65, 0, 0.35, 1] as const;

// One full loop: fade in, draw the line, hold, fade out, then repeat.
const CYCLE = 6.5;
const DRAW_START = 0.6 / CYCLE;
const DRAW_END = 5.0 / CYCLE;
const DOT_POP = 4.8 / CYCLE;
const DOT_SETTLE = 5.4 / CYCLE;

export default function HeroChart() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none h-28 w-full max-w-3xl sm:h-32"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.18, 0.8, 1],
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="h-full w-full"
      >
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-full w-full">
          <motion.path
            d={PATH}
            fill="none"
            stroke="#ff3b3b"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50 blur-xl"
            animate={{ pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: CYCLE,
              times: [0, DRAW_START, DRAW_END, 1],
              ease: EASE,
              repeat: Infinity,
            }}
          />
          <motion.path
            d={PATH}
            fill="none"
            stroke="#ff3b3b"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: CYCLE,
              times: [0, DRAW_START, DRAW_END, 1],
              ease: EASE,
              repeat: Infinity,
            }}
            style={{
              filter: "drop-shadow(0 0 6px #ff3b3b) drop-shadow(0 0 14px #ff3b3b)",
            }}
          />
          <motion.circle
            cx={800}
            cy={75}
            r={5}
            fill="#ff3b3b"
            animate={{ scale: [0, 0, 1.6, 1], opacity: [0, 0, 1, 1] }}
            transition={{
              duration: CYCLE,
              times: [0, DOT_POP, DOT_SETTLE, 1],
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{ filter: "drop-shadow(0 0 8px #ff3b3b)" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
