import type { Metadata } from "next";
import Image from "next/image";
import { getIndex } from "@/lib/blog/store";
import Reveal from "@/components/Reveal";
import SpotlightLink from "@/components/SpotlightLink";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | IN THE BOX STUDIO",
  description:
    "Ogni mattina un agente AI analizza le notizie più rilevanti sull'intelligenza artificiale e scrive un articolo originale in italiano, fonti alla mano. Il blog automatico che dimostra dal vivo il servizio di IN THE BOX STUDIO.",
  alternates: {
    canonical: "/blog",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getIndex({ revalidateSeconds: 300 });

  return (
    <main className="px-6 pb-32 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Il <span className="text-gradient">blog</span> che si scrive da solo
          </h1>
          <p className="mt-4 text-lg text-muted">
            Ogni mattina un agente AI legge le notizie del giorno sull&apos;intelligenza
            artificiale da fonti verificate, sceglie quella più rilevante e scrive un
            articolo originale in italiano — con tanto di fonti citate e immagine dedicata.
            Nessun intervento manuale: è la stessa tecnologia che progetto per i miei clienti,
            in funzione qui, dal vivo.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={0.1} className="glass mx-auto mt-16 max-w-xl rounded-2xl p-10 text-center">
            <p className="text-lg text-muted">
              Il primo articolo arriva a breve: l&apos;agente pubblica ogni giorno intorno
              alle 8:30.
            </p>
          </Reveal>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <SpotlightLink
                key={post.slug}
                href={`/blog/${post.slug}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col overflow-hidden rounded-2xl transition-colors hover:border-accent/40"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={post.publishedAt} className="text-xs font-medium text-muted">
                    {formatDate(post.publishedAt)}
                  </time>
                  <h2 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </SpotlightLink>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
