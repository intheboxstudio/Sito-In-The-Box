"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type SpotlightLinkProps = Omit<HTMLMotionProps<"a">, "children"> & {
  children: ReactNode;
};

export default function SpotlightLink({
  className = "",
  children,
  ...props
}: SpotlightLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`glass relative ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgba(124,92,255,0.16), transparent 40%)`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.a>
  );
}
