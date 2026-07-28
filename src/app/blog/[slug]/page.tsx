import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/blog/store";
import Reveal from "@/components/Reveal";

export const revalidate = 300;

const BASE_URL = "https://intheboxstudio.it";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTimeMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { revalidateSeconds: 300 });
  if (!post) return {};

  return {
    title: `${post.title} | Blog IN THE BOX STUDIO`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { revalidateSeconds: 300 });

  if (!post) notFound();

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${BASE_URL}/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "IN THE BOX STUDIO",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "IN THE BOX STUDIO",
      url: BASE_URL,
    },
  };

  return (
    <main className="px-6 pb-32 pt-32 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna al blog
        </Link>

        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{readingTimeMinutes(post.bodyMarkdown)} min di lettura</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </Reveal>
        <p className="mt-2 text-right text-xs text-muted">
          Foto di{" "}
          <a
            href={post.coverImage.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-2 hover:text-foreground"
          >
            {post.coverImage.photographer}
          </a>{" "}
          su Pexels
        </p>

        <Reveal
          delay={0.15}
          className="prose prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:text-muted mt-12 max-w-none"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.bodyMarkdown}</ReactMarkdown>
        </Reveal>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="glass mt-12 rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Fonti</h2>
          <ul className="mt-4 space-y-3">
            {post.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  {source.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
