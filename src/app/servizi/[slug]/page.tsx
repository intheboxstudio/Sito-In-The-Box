import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/data/services";
import ServiceHeroVisual from "@/components/ServiceHeroVisual";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.title} | IN THE BOX STUDIO`,
    description: service.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <main className="px-6 pb-32 pt-32 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#servizi"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna ai servizi
        </Link>

        <Reveal className="mt-8 text-center">
          <div className="glass mx-auto mb-6 inline-flex items-center justify-center rounded-2xl p-4 text-accent">
            <service.icon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {service.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted">
            {service.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <ServiceHeroVisual stages={service.stages} />
        </Reveal>

        <div className="mt-20 space-y-20">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Cos&apos;è, in parole semplici
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {service.intro.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Perché è una soluzione ottimale per un&apos;azienda
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {service.whyOptimal.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Esempi pratici di cosa può fare
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {service.examples.map((example) => (
                <div key={example.title} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground">{example.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Cosa può sostituire o affiancare in azienda
            </h2>
            <ul className="mt-6 space-y-3">
              {service.replaces.map((line) => (
                <li key={line} className="flex items-start gap-3 text-muted">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="glass rounded-2xl p-8 text-center sm:p-12">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              {service.closing}
            </p>
            <MagneticButton
              href="/contatti"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background"
            >
              Parliamo del tuo progetto
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
