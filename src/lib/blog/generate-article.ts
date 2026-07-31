import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import {
  findSimilarPost,
  indexEntryFingerprint,
  normalizeStoryKey,
  normalizeUrl,
  usedImageIds,
  usedSourceUrls,
  usedStoryKeys,
} from "./dedupe";
import { extractFullText, type ExtractedArticle } from "./extract-article";
import { pickCoverImage } from "./pick-image";
import { getIndex, slugExists } from "./store";
import type { BlogIndexEntry, BlogPost, NewsItem, SourceRef } from "./types";

const MODEL = "claude-opus-5";
const MAX_SOURCES = 4;
const MIN_USABLE_SOURCES = 2;
const MAX_QUOTE_WORDS = 30;
/** How many different stories to try before giving up on today's run. */
const MAX_STORY_ATTEMPTS = 3;
/** How many published posts to show the model as "already covered" context. */
const PUBLISHED_CONTEXT_SIZE = 80;

const client = new Anthropic();

const StorySelectionSchema = z.object({
  matching_item_ids: z.array(z.number()),
  story_key: z.string(),
  is_primary_source_announcement: z.boolean(),
  duplicates_published_story_key: z.string().nullable(),
  rationale: z.string(),
});

const DuplicateVerdictSchema = z.object({
  is_already_covered: z.boolean(),
  matching_published_title: z.string().nullable(),
  reasoning: z.string(),
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

function buildPublishedContext(index: BlogIndexEntry[]): string {
  if (index.length === 0) return "(nessun articolo pubblicato finora)";

  return index
    .slice(0, PUBLISHED_CONTEXT_SIZE)
    .map(
      (entry) =>
        `- storyKey "${entry.storyKey}" (${entry.publishedAt.slice(0, 10)}): ${entry.title}\n  ${entry.excerpt}`,
    )
    .join("\n");
}

function buildSelectionPrompt(items: NewsItem[], publishedContext: string): string {
  const list = items
    .map(
      (item) =>
        `[${item.id}] (${item.source}, ${item.publishedAt}) ${item.title}\n${item.summary}`,
    )
    .join("\n\n");

  return `Sei un caporedattore esperto di intelligenza artificiale. Di seguito trovi le notizie AI pubblicate nelle ultime ore da fonti verificate (blog ufficiali dei laboratori AI e testate tecnologiche autorevoli).

Scegli LA notizia più interessante e rilevante della giornata per un pubblico italiano appassionato di tecnologia e AI. Dai priorità ad annunci di prodotto/modello importanti, ricerche con impatto reale, decisioni normative rilevanti, mosse strategiche di grandi aziende AI. Evita pettegolezzi, speculazioni non confermate, notizie minori o clickbait.

ARTICOLI GIÀ PUBBLICATI SUL BLOG:
${publishedContext}

REGOLA ANTI-DUPLICATO (la più importante di tutte): non puoi scegliere una notizia che racconta un evento già coperto da uno degli articoli qui sopra. Vale anche se la notizia di oggi aggiunge nuovi dettagli, nuove cifre, nuove reazioni o un'angolazione diversa: un evento = un solo articolo, per sempre. Se la notizia di oggi è il seguito, l'approfondimento o l'aggiornamento di una storia già pubblicata, NON sceglierla e passa alla notizia successiva per rilevanza. Se nessuna notizia dell'elenco è un evento nuovo, restituisci un elenco di ID vuoto.

REGOLA ANTI-RUMOR: puoi scegliere una notizia solo se è confermata da almeno 2 voci diverse nell'elenco, OPPURE se proviene da un annuncio ufficiale/primario (blog di OpenAI o Google DeepMind). Se nessuna notizia soddisfa questo criterio, restituisci un elenco di ID vuoto.

Notizie disponibili:

${list}

Restituisci:
- "matching_item_ids": gli ID di TUTTE le voci dell'elenco che parlano della notizia scelta (anche raccontata da fonti diverse);
- "story_key": un identificatore canonico dell'evento scelto, in inglese, minuscolo, 3-6 parole separate da trattini, che descriva l'EVENTO e non l'articolo (esempi: "openai-agent-huggingface-breach", "google-gemini-robotics-2-launch"). Due notizie che raccontano lo stesso evento devono produrre lo stesso story_key;
- "is_primary_source_announcement": true se la notizia arriva da un annuncio ufficiale/primario;
- "duplicates_published_story_key": lo storyKey dell'articolo già pubblicato che copre lo stesso evento, se esiste, altrimenti null;
- "rationale": il motivo della scelta.`;
}

function buildDuplicateCheckPrompt(candidateItems: NewsItem[], index: BlogIndexEntry[]): string {
  const candidate = candidateItems
    .map((item) => `- (${item.source}) ${item.title}\n  ${item.summary}`)
    .join("\n");

  const published = index
    .slice(0, PUBLISHED_CONTEXT_SIZE)
    .map((entry) => `- ${entry.publishedAt.slice(0, 10)} — ${indexEntryFingerprint(entry)}`)
    .join("\n");

  return `Verifica anti-duplicato per un blog di notizie AI. Hai una notizia candidata e l'elenco degli articoli già pubblicati su quel blog.

NOTIZIA CANDIDATA DI OGGI:
${candidate}

ARTICOLI GIÀ PUBBLICATI:
${published}

Domanda: la notizia candidata racconta lo stesso evento reale di uno degli articoli già pubblicati? Rispondi true anche se cambia l'angolazione, o se ci sono aggiornamenti, nuovi numeri, nuove dichiarazioni o nuove conseguenze dello stesso fatto. Rispondi false solo se si tratta di un evento realmente distinto (prodotto diverso, azienda diversa, fatto diverso e indipendente).`;
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

/** Second, independent opinion on whether the picked story is a rerun. */
async function isAlreadyCovered(
  candidateItems: NewsItem[],
  index: BlogIndexEntry[],
): Promise<boolean> {
  if (index.length === 0) return false;

  const verdict = await client.messages.parse({
    model: MODEL,
    max_tokens: 512,
    messages: [{ role: "user", content: buildDuplicateCheckPrompt(candidateItems, index) }],
    output_config: { format: zodOutputFormat(DuplicateVerdictSchema) },
  });

  const parsed = verdict.parsed_output;
  if (!parsed) return false;

  if (parsed.is_already_covered) {
    console.log(
      `[blog] duplicate check matched "${parsed.matching_published_title}": ${parsed.reasoning}`,
    );
  }
  return parsed.is_already_covered;
}

/**
 * Query ladder for the cover image: the model's own suggestion first, then the
 * tags, then generic fallbacks — so there is always somewhere else to look
 * when the best matches have already been used by earlier posts.
 */
function imageQueries(draft: z.infer<typeof ArticleOutputSchema>): string[] {
  return [
    draft.imageSearchQuery,
    ...draft.tags.slice(0, 4),
    `${draft.tags[0] ?? "artificial intelligence"} technology`,
    "artificial intelligence",
    "futuristic technology",
    "abstract technology background",
  ];
}

/**
 * Orchestrates the full pipeline: pick today's story, prove it has never been
 * covered before, cross-check it against corroborating sources, write the
 * article, pick a never-used cover image. Returns null at any point where the
 * pipeline decides not to publish today (no new corroborated story, too few
 * extractable sources, no unused image) — a valid, non-error outcome: skipping
 * a day is always preferable to repeating a story or an image.
 */
export async function generateDailyArticle(newsItems: NewsItem[]): Promise<BlogPost | null> {
  if (newsItems.length === 0) return null;

  const index = await getIndex();
  const takenUrls = usedSourceUrls(index);
  const takenStoryKeys = usedStoryKeys(index);
  const takenImageIds = usedImageIds(index);
  const publishedContext = buildPublishedContext(index);

  // Hardest and cheapest rule: an article already used as a source can never
  // be used again, so it never even reaches the selection step.
  const pool = newsItems.filter((item) => !takenUrls.has(normalizeUrl(item.link)));
  if (pool.length === 0) {
    console.log("[blog] every news item today was already used as a source");
    return null;
  }

  const rejectedIds = new Set<number>();

  for (let attempt = 1; attempt <= MAX_STORY_ATTEMPTS; attempt++) {
    const candidates = pool.filter((item) => !rejectedIds.has(item.id));
    if (candidates.length === 0) break;

    const selection = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: buildSelectionPrompt(candidates, publishedContext) }],
      output_config: { format: zodOutputFormat(StorySelectionSchema) },
    });

    const picked = selection.parsed_output;
    if (!picked || picked.matching_item_ids.length === 0) {
      console.log("[blog] no new story worth publishing today:", picked?.rationale ?? "no output");
      return null;
    }

    const rejectStory = (reason: string) => {
      console.log(`[blog] attempt ${attempt} rejected — ${reason}`);
      for (const id of picked.matching_item_ids) rejectedIds.add(id);
    };

    if (picked.duplicates_published_story_key) {
      rejectStory(`flagged as a rerun of "${picked.duplicates_published_story_key}"`);
      continue;
    }

    const storyKey = normalizeStoryKey(picked.story_key);
    if (!storyKey) {
      rejectStory("empty story key");
      continue;
    }
    if (takenStoryKeys.has(storyKey)) {
      rejectStory(`story "${storyKey}" is already published`);
      continue;
    }

    const enoughCorroboration =
      picked.matching_item_ids.length >= MIN_USABLE_SOURCES || picked.is_primary_source_announcement;
    if (!enoughCorroboration) {
      rejectStory(`not corroborated (${picked.rationale})`);
      continue;
    }

    const candidateItems = candidates.filter((item) => picked.matching_item_ids.includes(item.id));
    if (candidateItems.length === 0) {
      rejectStory("selection referenced unknown item ids");
      continue;
    }

    if (await isAlreadyCovered(candidateItems, index)) {
      rejectStory("duplicate check says the event is already covered");
      continue;
    }

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
      rejectStory("not enough extractable full-text sources");
      continue;
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
      rejectStory("quote guardrail triggered");
      continue;
    }

    const similar = findSimilarPost(
      `${draft.title}. ${draft.excerpt} ${draft.tags.join(", ")}`,
      index,
    );
    if (similar) {
      rejectStory(`the draft reads like the published post "${similar.slug}"`);
      continue;
    }

    const coverImage = await pickCoverImage(imageQueries(draft), takenImageIds);
    if (!coverImage) {
      console.log("[blog] no unused cover image found, aborting today's run");
      return null;
    }

    // The model occasionally rewrites source URLs; keep only the ones actually
    // read, so the recorded sourceUrls stay a truthful — and enforceable —
    // fingerprint of what this post was built from.
    const readUrls = new Set(usable.map(({ item }) => normalizeUrl(item.link)));
    let sources: SourceRef[] = draft.sources.filter((source) =>
      readUrls.has(normalizeUrl(source.url)),
    );
    if (sources.length === 0) {
      sources = usable.map(({ item }) => ({ name: item.source, url: item.link }));
    }

    return {
      slug: await uniqueSlug(slugify(draft.title)),
      storyKey,
      title: draft.title,
      excerpt: draft.excerpt,
      tags: draft.tags,
      bodyMarkdown: draft.bodyMarkdown,
      coverImage,
      sources,
      publishedAt: new Date().toISOString(),
    };
  }

  console.log(`[blog] nothing new to publish after ${MAX_STORY_ATTEMPTS} attempts`);
  return null;
}
