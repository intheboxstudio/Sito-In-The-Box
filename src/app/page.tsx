import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import HeroChart from "@/components/HeroChart";
import Process from "@/components/Process";
import TerminalDemo from "@/components/TerminalDemo";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <TechMarquee />
      <Services />
      <div className="flex justify-center px-6">
        <HeroChart />
      </div>
      <Process />
      <TerminalDemo />
      <Projects />
      <Contact />
    </main>
  );
}
