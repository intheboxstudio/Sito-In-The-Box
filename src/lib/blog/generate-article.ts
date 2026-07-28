import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { extractFullText, type ExtractedArticle } from "./extract-article";
import { pickCoverImage } from "./pick-image";
import { slugExists } from "./store";
import type { BlogPost, NewsItem } from "./types";

const MODEL = "claude-opus-5";
const MAX_SOURCES = 4;
const MIN_USABLE_SOURCES = 2;
const MAX_QUOTE_WORDS = 30;

const client = new Anthropic();

const StorySelectionSchema = z.object({
  matching_item_ids: z.array(z.number()),
  is_primary_source_announcement: z.boolean(),
  rationale: z.string(),
});

const ArticleOutputSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  imageSearchQuery: z.string(),
  bodyMarkdown: z.string(),
  sources: z.array(z.object({ name: z.string(), url: z.string() })),
});

const WRITING_SYSTEM_PROMPT = `Sei un giornalista italiano esperto di tecnologia e intelligenza artificiale, con anni di esperienza nello spiegare argomenti complessi a un pubblico curioso ma non necessariamente tecnico. Scrivi per il blog di IN THE BOX STUDIO.

STILE: voce umana, sicura, con opinioni e contesto originali — non un riassunto neutro. Frasi di lunghezza variabile, paragrafi brevi, qualche sottotitolo naturale (non robotico). Aggiungi sempre un angolo di analisi personale: perché questa notizia conta, cosa significa per chi lavora con l'AI o per le aziende, cosa succederà probabilmente dopo.

VIETATO:
- Copiare o parafrasare troppo da vicino le fonti: scrivi sempre con parole tue, sintetizzando i fatti.
- Frasi fatte da "articolo scritto da un'IA": non usare mai espressioni come "nel panorama in continua evoluzione", "è importante notare che", "in conclusione", "in un mondo sempre più connesso/digitale", aperture generiche, hedging eccessivo, struttura da elenco puntato ovunque.
- Citazioni dirette più lunghe di 25 parole. Se citi, usa le virgolette e attribuisci sempre la fonte nel testo.
- Inventare fatti, numeri o dichiarazioni non presenti nel materiale fornito.

FORMATO: markdown, con un attacco naturale nel primo paragrafo (non ripetere il titolo come intestazione), un paio di sottotitoli con ## se l'articolo è abbastanza lungo, paragrafi scorrevoli. Lunghezza: 600-900 parole. Non includere l'elenco delle fonti nel testo del corpo: verrà mostrato separatamente a partire dal campo "sources".`;

function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base: string): Promise<string> {
  const safeBase = base || "articolo";
  let candidate = safeBase;
  let n = 2;
  while (await slugExists(candidate)) {
    candidate = `${safeBase}-${n}`;
    n += 1;
  }
  return candidate;
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Cheap plagiarism guardrail: rejects the draft if any run of
 * MAX_QUOTE_WORDS+ consecutive words appears verbatim in one of the source
 * texts. Not full plagiarism detection, just a structural backstop on top of
 * the prompt's "quotes under 25 words" instruction.
 */
function hasOverlongQuote(bodyMarkdown: string, sourceTexts: string[]): boolean {
  const bodyWords = normalizeWords(bodyMarkdown);
  if (bodyWords.length < MAX_QUOTE_WORDS) return false;

  const sourceHaystacks = sourceTexts.map((text) => normalizeWords(text).join(" "));

  for (let i = 0; i <= bodyWords.length - MAX_QUOTE_WORDS; i++) {
    const window = bodyWords.slice(i, i + MAX_QUOTE_WORDS).join(" ");
    if (sourceHaystacks.some((haystack) => haystack.includes(window))) {
      return true;
    }
  }
  return false;
}

function buildSelectionPrompt(items: NewsItem[]): string {
  const list = items
    .map(
      (item) =>
        `[${item.id}] (${item.source}, ${item.publishedAt}) ${item.title}\n${item.summary}`,
    )
    .join("\n\n");

  return `Sei un caporedattore esperto di intelligenza artificiale. Di seguito trovi le notizie AI pubblicate nelle ultime ore da fonti verificate (blog ufficiali dei laboratori AI e testate tecnologiche autorevoli).

Scegli LA notizia più interessante e rilevante della giornata per un pubblico italiano appassionato di tecnologia e AI. Dai priorità ad annunci di prodotto/modello importanti, ricerche con impatto reale, decisioni normative rilevanti, mosse strategiche di grandi aziende AI. Evita pettegolezzi, speculazioni non confermate, notizie minori o clickbait.

REGOLA ANTI-RUMOR: puoi scegliere una notizia solo se è confermata da almeno 2 voci diverse nell'elenco, OPPURE se proviene da un annuncio ufficiale/primario (blog di OpenAI o Google DeepMind). Se nessuna notizia soddisfa questo criterio, restituisci un elenco di ID vuoto.

Notizie disponibili:

${list}

Restituisci gli ID di TUTTE le voci dell'elenco che parlano della stessa notizia scelta (anche raccontata da fonti diverse), se si tratta di un annuncio ufficiale/primario, e il motivo della scelta.`;
}

function buildWritingPrompt(usable: { item: NewsItem; article: ExtractedArticle }[]): string {
  const materials = usable
    .map(
      ({ item, article }, index) =>
        `FONTE ${index + 1}: ${item.source} — ${item.link}\nTitolo originale: ${article.title || item.title}\n\n${article.text.slice(0, 6000)}`,
    )
    .join("\n\n---\n\n");

  return `Scrivi un articolo originale in italiano sulla notizia raccontata in questi materiali di ricerca, sintetizzando i fatti principali e aggiungendo la tua analisi. Nel campo "sources" dell'output, elenca le fonti sopra con nome e URL esatti così come forniti qui sotto.

${materials}`;
}

/**
 * Orchestrates the full pipeline: pick today's story, cross-check it against
 * corroborating sources, write the article, pick a cover image. Returns null
 * at any point where the pipeline decides not to publish today (no
 * corroborated story, too few extractable sources, no image) — this is a
 * valid, non-error outcome.
 */
export async function generateDailyArticle(newsItems: NewsItem[]): Promise<BlogPost | null> {
  if (newsItems.length === 0) return null;

  const selection = await client.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: buildSelectionPrompt(newsItems) }],
    output_config: { format: zodOutputFormat(StorySelectionSchema) },
  });

  const picked = selection.parsed_output;
  if (!picked) return null;

  const enoughCorroboration =
    picked.matching_item_ids.length >= MIN_USABLE_SOURCES || picked.is_primary_source_announcement;
  if (!enoughCorroboration) {
    console.log("[blog] no sufficiently corroborated story today:", picked.rationale);
    return null;
  }

  const candidateItems = newsItems.filter((item) => picked.matching_item_ids.includes(item.id));
  if (candidateItems.length === 0) return null;

  const seenDomains = new Set<string>();
  const toExtract: NewsItem[] = [];
  for (const item of candidateItems) {
    let domain: string;
    try {
      domain = new URL(item.link).hostname;
    } catch {
      continue;
    }
    if (seenDomains.has(domain)) continue;
    seenDomains.add(domain);
    toExtract.push(item);
    if (toExtract.length >= MAX_SOURCES) break;
  }

  const extracted = await Promise.all(
    toExtract.map(async (item) => ({ item, article: await extractFullText(item.link) })),
  );

  const usable = extracted.filter(
    (entry): entry is { item: NewsItem; article: ExtractedArticle } => entry.article !== null,
  );

  if (usable.length < MIN_USABLE_SOURCES) {
    console.log("[blog] not enough extractable full-text sources today");
    return null;
  }

  const writing = await client.messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: WRITING_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildWritingPrompt(usable) }],
    output_config: { format: zodOutputFormat(ArticleOutputSchema) },
  });

  const draft = writing.parsed_output;
  if (!draft) return null;

  if (hasOverlongQuote(draft.bodyMarkdown, usable.map(({ article }) => article.text))) {
    console.error("[blog] rejected draft: quote guardrail triggered");
    return null;
  }

  const coverImage = await pickCoverImage(draft.imageSearchQuery);
  if (!coverImage) {
    console.log("[blog] no cover image found, aborting");
    return null;
  }

  const slug = await uniqueSlug(slugify(draft.title));
  const sources =
    draft.sources.length > 0
      ? draft.sources
      : usable.map(({ item }) => ({ name: item.source, url: item.link }));

  return {
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    tags: draft.tags,
    bodyMarkdown: draft.bodyMarkdown,
    coverImage,
    sources,
    publishedAt: new Date().toISOString(),
  };
}
