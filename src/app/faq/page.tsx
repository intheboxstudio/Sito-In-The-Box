import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ | IN THE BOX STUDIO",
  description:
    "Le risposte alle domande più frequenti su agenti AI, automazione aziendale e collaborazione con IN THE BOX STUDIO.",
};

export default function FaqPage() {
  return (
    <main>
      <FAQ />
    </main>
  );
}
