import { extract } from "@extractus/article-extractor";

const USER_AGENT = "IntheboxstudioBlogBot/1.0 (+https://intheboxstudio.it/blog)";
const FETCH_TIMEOUT_MS = 8000;
const MIN_CONTENT_LENGTH = 400;

export type ExtractedArticle = {
  title: string;
  text: string;
};

function htmlToPlainText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Best-effort full-text extraction for one article URL. Returns null on
 * fetch failure, bot-blocking, or when the extracted text is too short to be
 * useful (paywall stub heuristic) — callers must drop the source rather than
 * fall back to a thin substitute.
 */
export async function extractFullText(url: string): Promise<ExtractedArticle | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const article = await extract(
      url,
      {},
      {
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal as unknown as object,
      },
    );

    if (!article?.content) return null;

    const text = htmlToPlainText(article.content);
    if (text.length < MIN_CONTENT_LENGTH) return null;

    return { title: article.title ?? "", text };
  } catch (error) {
    console.error(`[blog] extraction failed for ${url}:`, (error as Error).message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
