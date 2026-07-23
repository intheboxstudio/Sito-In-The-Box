"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  CheckCircle2,
  Zap,
  RefreshCw,
  Search,
  Newspaper,
  Rocket,
  MessageCircleMore,
  LayoutTemplate,
  Code2,
  Lightbulb,
  PenTool,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import type { ServiceStage, StageIconKey } from "@/data/services";

const ICONS: Record<StageIconKey, LucideIcon> = {
  "message-square": MessageSquare,
  bot: Bot,
  "check-circle-2": CheckCircle2,
  zap: Zap,
  "refresh-cw": RefreshCw,
  search: Search,
  newspaper: Newspaper,
  rocket: Rocket,
  "message-circle-more": MessageCircleMore,
  "layout-template": LayoutTemplate,
  "code-2": Code2,
  lightbulb: Lightbulb,
  "pen-tool": PenTool,
  megaphone: Megaphone,
};

export default function ServiceHeroVisual({
  stages,
}: {
  stages: [ServiceStage, ServiceStage, ServiceStage];
}) {
  return (
    <div className="glass bg-grid relative overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-[16%] right-[16%] top-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.div
          className="absolute top-8 h-2 w-2 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
          style={{ left: "16%" }}
          animate={{ left: ["16%", "84%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-8 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_rgba(124,92,255,0.9)]"
          style={{ left: "16%" }}
          animate={{ left: ["16%", "84%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        <div className="relative flex items-start justify-between gap-4">
          {stages.map((stage, i) => {
            const Icon = ICONS[stage.icon];
            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-1 flex-col items-center gap-3 text-center"
              >
                <div className="glass flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="max-w-[9rem] text-xs font-medium text-muted sm:max-w-none sm:text-sm">
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
