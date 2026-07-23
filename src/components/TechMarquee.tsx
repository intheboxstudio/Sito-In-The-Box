const TOOLS = [
  "Python",
  "OpenAI",
  "LangChain",
  "n8n",
  "Zapier",
  "WhatsApp API",
  "Telegram Bot",
  "Meta Ads",
  "Google Analytics",
  "Make",
  "Claude Code",
  "Manus",
  "Codex",
  "Claude Cowork",
];

// Repeated enough times that two consecutive halves are always wider than
// any viewport, so the -50% loop never reveals empty space on wide screens.
const REPEATED = Array.from({ length: 6 }, () => TOOLS).flat();

export default function TechMarquee() {
  return (
    <div className="relative border-y border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-accent-2/10 to-transparent"
      />
      <div className="relative flex items-stretch">
        <div className="glass hidden shrink-0 items-center gap-2 border-r border-border px-6 py-5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-xs font-semibold tracking-widest text-muted">
            IL MIO STACK
          </span>
        </div>

        <div
          className="relative flex-1 overflow-hidden py-5"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="animate-marquee flex w-max gap-3 whitespace-nowrap">
            {REPEATED.map((tool, i) => (
              <span
                key={i}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
