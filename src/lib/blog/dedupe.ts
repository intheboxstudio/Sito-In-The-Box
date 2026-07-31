import type { BlogIndexEntry } from "./types";

/**
 * Uniqueness layer for the auto-generated blog. Every rule here exists to
 * enforce two invariants, in this order of reliability:
 *
 *   1. a source URL is never used by more than one post;
 *   2. a story (the underlying real-world event) is never covered twice;
 *   3. a cover image is never reused.
 *
 * These are deterministic checks over the published index — the LLM's own
 * judgement is an extra layer on top, never the only one.
 */

/** Strips scheme, `www.`, query and trailing slash so the same article linked
 * with different tracking params counts as one URL. */
export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    return `${host}${path}`.toLowerCase();
  } catch {
    return raw.trim().toLowerCase();
  }
}

/** Pexels URLs embed the photo id: `.../photos/37730212/pexels-photo-37730212.jpeg`. */
export function imageIdFromUrl(url: string): string {
  return url.match(/\/photos\/(\d+)\//)?.[1] ?? normalizeUrl(url);
}

export function normalizeStoryKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function usedSourceUrls(index: BlogIndexEntry[]): Set<string> {
  const used = new Set<string>();
  for (const entry of index) {
    if (!Array.isArray(entry.sourceUrls)) continue;
    for (const url of entry.sourceUrls) used.add(normalizeUrl(url));
  }
  return used;
}

export function usedImageIds(index: BlogIndexEntry[]): Set<string> {
  const used = new Set<string>();
  for (const entry of index) {
    // coverImageId is authoritative; the URL fallback keeps pre-existing
    // entries (written before the field existed) covered too.
    used.add(entry.coverImageId || imageIdFromUrl(entry.coverImageUrl));
  }
  return used;
}

export function usedStoryKeys(index: BlogIndexEntry[]): Set<string> {
  const used = new Set<string>();
  for (const entry of index) {
    if (entry.storyKey) used.add(normalizeStoryKey(entry.storyKey));
  }
  return used;
}

const STOPWORDS = new Set([
  "come",
  "cosa",
  "dopo",
  "essere",
  "hanno",
  "loro",
  "meno",
  "molto",
  "nella",
  "nelle",
  "nello",
  "ogni",
  "oltre",
  "però",
  "prima",
  "quando",
  "quello",
  "questa",
  "queste",
  "questi",
  "questo",
  "sono",
  "sopra",
  "sotto",
  "tutti",
  "tutto",
  "verso",
  "with",
  "that",
  "this",
  "from",
]);

function words(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));
}

/** Capitalised tokens (product names, companies, places) minus sentence-initial
 * noise — the most discriminating signal that two texts describe one event. */
function entities(text: string): Set<string> {
  const found = new Set<string>();
  for (const sentence of text.split(/(?<=[.!?:;\n])\s+/)) {
    const tokens = sentence.trim().split(/\s+/);
    tokens.forEach((token, index) => {
      const clean = token.replace(/[^\p{L}\p{N}\-]/gu, "");
      if (clean.length < 3) return;
      if (!/^\p{Lu}/u.test(clean)) return;
      if (index === 0 && !/\p{Lu}.*\p{Lu}/u.test(clean)) return; // skip plain sentence-start words
      found.add(clean.toLowerCase());
    });
  }
  return found;
}

function overlapCoefficient(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / Math.min(a.size, b.size);
}

function sharedCount(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const shared = sharedCount(a, b);
  return shared / (a.size + b.size - shared);
}

export function indexEntryFingerprint(entry: BlogIndexEntry): string {
  return `${entry.title}. ${entry.excerpt} ${entry.tags.join(", ")}`;
}

/**
 * Last-resort textual backstop: flags a draft that reads like an existing post
 * even when the URL, storyKey and LLM checks all let it through. Deliberately
 * conservative — the LLM duplicate verdict is the primary topic-level gate, so
 * this only needs to catch the blatant cases.
 */
export function findSimilarPost(
  draftText: string,
  index: BlogIndexEntry[],
): BlogIndexEntry | null {
  const draftWords = new Set(words(draftText));
  const draftEntities = entities(draftText);

  for (const entry of index) {
    const entryText = indexEntryFingerprint(entry);
    const entryEntities = entities(entryText);

    const entitiesMatch =
      draftEntities.size >= 3 &&
      entryEntities.size >= 3 &&
      sharedCount(draftEntities, entryEntities) >= 3 &&
      overlapCoefficient(draftEntities, entryEntities) >= 0.6;

    const wordsMatch = jaccard(draftWords, new Set(words(entryText))) >= 0.45;

    if (entitiesMatch || wordsMatch) return entry;
  }

  return null;
}
