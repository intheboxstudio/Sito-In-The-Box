"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const SNIPPETS = [
  `def analyze_topic(topic="dolori articolari"):
    sources = fetch_authoritative_sources(topic)
    problems = extract_common_problems(sources)
    article = write_article(problems, sources)
    return recommend_products(article)`,
  `class SupportAgent:
    def handle_ticket(self, ticket):
        intent = classify(ticket.text)
        reply = generate_response(intent, tone="cordiale")
        return self.send(reply)`,
  `for lead in crm.new_leads(source="sito web"):
    profile = enrich(lead)
    score = qualify(profile)
    if score > THRESHOLD:
        schedule_followup(lead, channel="email")`,
];

function useTypewriterLoop(active: boolean) {
  const [text, setText] = useState("");
  const snippetIndex = useRef(0);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      if (cancelled) return;
      const snippet = SNIPPETS[snippetIndex.current % SNIPPETS.length];
      charIndex++;
      setText(snippet.slice(0, charIndex));

      if (charIndex < snippet.length) {
        timeoutId = setTimeout(typeNext, 28);
      } else {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          snippetIndex.current += 1;
          setText("");
          charIndex = 0;
          timeoutId = setTimeout(typeNext, 400);
        }, 1900);
      }
    };

    timeoutId = setTimeout(typeNext, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [active]);

  return text;
}

const KEYWORD_SPLIT_RE = /\b(def|class|for|if|return|in|self)\b/g;
const KEYWORD_TEST_RE = /^(def|class|for|if|return|in|self)$/;
const STRING_SPLIT_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
const STRING_TEST_RE = /^["'].*["']$/;

function renderLine(line: string, lineKey: number) {
  const stringParts = line.split(STRING_SPLIT_RE);
  return (
    <div key={lineKey}>
      {stringParts.map((part, i) => {
        if (STRING_TEST_RE.test(part)) {
          return (
            <span key={i} className="text-emerald-400">
              {part}
            </span>
          );
        }
        return part.split(KEYWORD_SPLIT_RE).map((word, j) =>
          KEYWORD_TEST_RE.test(word) ? (
            <span key={`${i}-${j}`} className="text-red-400">
              {word}
            </span>
          ) : (
            <span key={`${i}-${j}`}>{word}</span>
          ),
        );
      })}
    </div>
  );
}

type CodeBackdropProps = {
  className?: string;
};

export default function CodeBackdrop({ className = "inset-0" }: CodeBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const text = useTypewriterLoop(inView && !reduceMotion);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 10%, black 92%, transparent)",
      }}
    >
      {/* Anchored to the top so growing lines extend downward, away from
          the hero content above, instead of centering (and creeping up
          into it) as the snippet types out. */}
      <pre className="absolute left-1/2 top-0 w-[90vw] max-w-[2400px] -translate-x-1/2 whitespace-pre-wrap break-words px-6 font-mono text-base leading-relaxed text-white/40 sm:text-lg">
        {text.split("\n").map((line, i) => renderLine(line, i))}
        <span className="text-red-500">▍</span>
      </pre>
    </div>
  );
}
