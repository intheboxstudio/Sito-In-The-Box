"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import SpotlightCard from "./SpotlightCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Services() {
  return (
    <section id="servizi" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Cosa posso costruire per te
          </h2>
          <p className="mt-4 text-muted">
            Dall&apos;idea al sistema in produzione: soluzioni AI pensate per
            risolvere problemi reali, non demo che restano sulla carta.
            Clicca su una scheda per scoprire come lavoro nel dettaglio.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <SpotlightCard
              key={service.slug}
              variants={item}
              whileHover={{ y: -4 }}
              className="group rounded-2xl p-0 transition-colors hover:border-accent/40"
            >
              <Link href={`/servizi/${service.slug}`} className="block p-6">
                <div className="mb-5 flex items-start justify-between">
                  <div className="inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-transform group-hover:scale-110">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.cardDescription}
                </p>
              </Link>
            </SpotlightCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
