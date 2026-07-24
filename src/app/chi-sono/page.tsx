import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "Chi sono | IN THE BOX STUDIO",
  description:
    "Marco Losso, perito informatico esperto in intelligenza artificiale, agenti IA e automazioni aziendali.",
};

export default function ChiSonoPage() {
  return (
    <main>
      <About />
    </main>
  );
}
