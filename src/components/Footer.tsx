import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} IN THE BOX STUDIO — Tutti i diritti riservati</span>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/intheboxstudio/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="mailto:intheboxstudio.smm@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
