import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import Process from "@/components/Process";
import TerminalDemo from "@/components/TerminalDemo";
import Projects from "@/components/Projects";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <TechMarquee />
      <Services />
      <Process />
      <TerminalDemo />
      <Projects />
      <About />
      <FAQ />
      <Contact />
    </main>
  );
}
