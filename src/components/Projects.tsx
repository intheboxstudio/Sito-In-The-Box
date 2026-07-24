"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircleMore } from "lucide-react";
import SpotlightLink from "./SpotlightLink";

type Project = {
  tag: string;
  title: string;
  url: string;
  linkLabel: string;
  description: string;
  action?: "chat";
};

const PROJECTS: Project[] = [
  {
    tag: "Chatbot AI su misura",
    title: "L'assistente AI di questo sito",
    url: "#",
    linkLabel: "Prova la chat qui in basso a destra",
    description:
      "Il pallino in basso a destra su questo sito non è decorativo: è un chatbot AI vero, che conosce servizi, processo e FAQ di IN THE BOX STUDIO e risponde con il tono che ho scelto per il mio brand. Lo stesso sistema si personalizza e si addestra sui contenuti della tua azienda (prodotti, procedure, tono di voce), diventando un assistente virtuale che risponde ai tuoi clienti al posto tuo.",
    action: "chat",
  },
  {
    tag: "Blog gestito da un agente IA",
    title: "Parafarmacia Emy",
    url: "https://parafarmaciaemy.it",
    linkLabel: "parafarmaciaemy.it",
    description:
      "Un agente IA scrive in autonomia 3 articoli a settimana su omeopatia, naturopatia ed erboristeria, partendo dai problemi reali che le persone cercano online. Ogni articolo si chiude con il consiglio di 3 prodotti in vendita nella parafarmacia della dottoressa Emy, trasformando i contenuti in un canale di vendita costante senza lavoro editoriale manuale.",
  },
  {
    tag: "Bot di analisi crypto",
    title: "Crypto Report Bot",
    url: "https://github.com/intheboxstudio/report_crypto_bot",
    linkLabel: "github.com/intheboxstudio/report_crypto_bot",
    description:
      "Un bot che si collega ai principali gruppi Telegram di news crypto, ai profili X, ai canali YouTube e ai siti di settore più autorevoli, incrociando le informazioni con l'andamento reale dei mercati. Alla fine restituisce un report chiaro su quali criptovalute conviene investire, per quanto tempo mantenere la posizione e il livello di rischio (basso, medio o alto).",
  },
];

export default function Projects() {
  return (
    <section id="progetti" className="px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Progetti reali
          </h2>
          <p className="mt-4 text-muted">
            Non demo: sistemi in produzione, che lavorano ogni giorno dentro
            un&apos;azienda vera.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5">
          {PROJECTS.map((project, i) => {
            const isChat = project.action === "chat";
            const Icon = isChat ? MessageCircleMore : ArrowUpRight;
            return (
              <SpotlightLink
                key={project.title}
                href={project.url}
                {...(isChat
                  ? {
                      onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        window.dispatchEvent(new Event("open-chat-widget"));
                      },
                    }
                  : { target: "_blank", rel: "noopener noreferrer" })}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group block overflow-hidden rounded-2xl p-8 transition-colors hover:border-accent/40 sm:p-10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                    {project.tag}
                  </span>
                  <Icon className="h-4 w-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                  {project.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {project.linkLabel}
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </SpotlightLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
