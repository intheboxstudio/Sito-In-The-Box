"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = data.get("nome")?.toString() ?? "";
    const email = data.get("email")?.toString() ?? "";
    const telefono = data.get("telefono")?.toString() ?? "";
    const messaggio = data.get("messaggio")?.toString() ?? "";

    const subject = `Richiesta dal sito da parte di ${nome}`;
    const body = [
      `Nome: ${nome}`,
      `Email: ${email}`,
      telefono ? `Telefono: ${telefono}` : null,
      "",
      messaggio,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:intheboxstudio.smm@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto max-w-xl rounded-3xl px-8 py-16 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
        <h2 className="mt-4 text-2xl font-semibold">Quasi fatto</h2>
        <p className="mt-2 text-muted">
          Si è aperto il tuo programma di posta con il messaggio già
          compilato: ti basta premere invia. Se non si è aperto nulla,
          scrivimi direttamente a{" "}
          <a
            href="mailto:intheboxstudio.smm@gmail.com"
            className="text-accent hover:underline"
          >
            intheboxstudio.smm@gmail.com
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass mx-auto max-w-xl rounded-3xl px-6 py-10 text-left sm:px-10"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-muted">
            Nome e cognome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent/50"
            placeholder="Mario Rossi"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-muted">
            Telefono <span className="text-xs">(opzionale)</span>
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent/50"
            placeholder="+39 333 1234567"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent/50"
          placeholder="mario.rossi@email.com"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="messaggio" className="mb-1.5 block text-sm font-medium text-muted">
          Messaggio
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          rows={6}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent/50"
          placeholder="Raccontami cosa vorresti automatizzare o costruire..."
        />
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-105"
      >
        Invia messaggio
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="mt-4 text-xs text-muted">
        Inviando il modulo si aprirà il tuo programma di posta predefinito.
        Consulta la{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </a>{" "}
        per sapere come vengono trattati i tuoi dati.
      </p>
    </motion.form>
  );
}
