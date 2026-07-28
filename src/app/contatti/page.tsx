import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contatti | IN THE BOX STUDIO",
  description:
    "Scrivimi per parlare del tuo progetto di automazione o intelligenza artificiale. Con sede a Reggio Emilia, lavoro con aziende in tutta Italia.",
  alternates: {
    canonical: "/contatti",
  },
};

export default function ContattiPage() {
  return (
    <main className="px-6 pb-32 pt-40">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Parliamo del tuo progetto
        </h1>
        <p className="mt-4 text-muted">
          Compila il modulo con qualche informazione: ti risponderò
          personalmente il prima possibile.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
