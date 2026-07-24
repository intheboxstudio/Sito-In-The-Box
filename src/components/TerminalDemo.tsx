"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Line = { type: "cmd" | "out"; text: string };

const SCRIPTS: Line[][] = [
  [
    { type: "cmd", text: 'agent.run("analizza_topic", topic="dolori articolari")' },
    { type: "out", text: "→ 214 fonti trovate, 6 autorevoli selezionate" },
    { type: "out", text: "→ 3 problemi ricorrenti individuati" },
    { type: "cmd", text: "agent.write_article()" },
    { type: "out", text: "→ articolo generato (742 parole) + immagine creata" },
    { type: "cmd", text: "agent.recommend_products()" },
    { type: "out", text: "→ 3 prodotti abbinati e pubblicati su parafarmaciaemy.it" },
  ],
  [
    { type: "cmd", text: 'support_agent.handle_ticket(ticket_id="10432")' },
    { type: "out", text: "→ intento rilevato: reso prodotto" },
    { type: "out", text: "→ risposta generata e inviata al cliente" },
    { type: "cmd", text: "crm.qualify_leads()" },
    { type: "out", text: "→ 12 lead analizzati, 4 pronti per il follow-up" },
    { type: "cmd", text: "scheduler.send_followups()" },
    { type: "out", text: "→ follow-up inviati, nessun intervento manuale richiesto" },
  ],
  [
    { type: "cmd", text: 'social_agent.generate_calendar(weeks=2)' },
    { type: "out", text: "→ 14 post creati con copy, hashtag e immagine" },
    { type: "cmd", text: "social_agent.schedule_posts()" },
    { type: "out", text: "→ pubblicazione programmata su Instagram e LinkedIn" },
    { type: "cmd", text: "social_agent.reply_to_comments()" },
    { type: "out", text: "→ 23 commenti letti, 19 risposte automatiche inviate" },
  ],
  [
    { type: "cmd", text: 'invoice_agent.read_inbox()' },
    { type: "out", text: "→ 8 fatture fornitori trovate negli allegati" },
    { type: "cmd", text: "invoice_agent.extract_data()" },
    { type: "out", text: "→ importi, scadenze e P.IVA estratti automaticamente" },
    { type: "cmd", text: "invoice_agent.sync_to_gestionale()" },
    { type: "out", text: "→ 8 fatture registrate, 0 inserite manualmente" },
  ],
  [
    { type: "cmd", text: 'booking_agent.handle_whatsapp("Vorrei prenotare per venerdì")' },
    { type: "out", text: "→ disponibilità controllata sul calendario" },
    { type: "out", text: "→ appuntamento confermato e promemoria impostato" },
    { type: "cmd", text: "booking_agent.send_reminder(hours_before=24)" },
    { type: "out", text: "→ promemoria inviato, 0 no-show questa settimana" },
  ],
];

function useTerminalScript(active: boolean) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let scriptIdx = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeouts.push(id);
    };

    function playScript() {
      const script = SCRIPTS[scriptIdx % SCRIPTS.length];
      let lineIdx = 0;
      setLines([]);
      setTyping("");

      function nextLine() {
        if (cancelled) return;
        if (lineIdx >= script.length) {
          schedule(() => {
            scriptIdx += 1;
            playScript();
          }, 2600);
          return;
        }
        const line = script[lineIdx];
        if (line.type === "cmd") {
          let charIdx = 0;
          const typeChar = () => {
            if (cancelled) return;
            charIdx++;
            setTyping(line.text.slice(0, charIdx));
            if (charIdx < line.text.length) {
              schedule(typeChar, 22);
            } else {
              schedule(() => {
                setLines((prev) => [...prev, line]);
                setTyping("");
                lineIdx++;
                nextLine();
              }, 200);
            }
          };
          typeChar();
        } else {
          schedule(() => {
            setLines((prev) => [...prev, line]);
            lineIdx++;
            nextLine();
          }, 380);
        }
      }

      nextLine();
    }

    playScript();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [active]);

  return { lines, typing };
}

export default function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const { lines, typing } = useTerminalScript(inView && !reduceMotion);

  return (
    <section className="px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Cosa succede dietro le quinte
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Alcuni esempi reali di come lavorano i miei agenti, dall&apos;analisi
            al risultato finale.
          </p>
        </motion.div>

        <div ref={ref} className="glass overflow-hidden rounded-2xl text-left">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-muted">agent.py</span>
          </div>
          <div className="min-h-[220px] p-6 font-mono text-sm leading-relaxed sm:text-[15px]">
            {lines.map((line, i) => (
              <div
                key={i}
                className={line.type === "out" ? "text-accent-2/90" : "text-foreground"}
              >
                {line.type === "cmd" && <span className="text-accent">$ </span>}
                {line.text}
              </div>
            ))}
            {typing && (
              <div className="text-foreground">
                <span className="text-accent">$ </span>
                {typing}
                <span className="animate-pulse">▍</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
