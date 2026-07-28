import Parser from "rss-parser";
import { TRUSTED_FEEDS } from "./sources";
import type { NewsItem } from "./types";

const USER_AGENT = "IntheboxstudioBlogBot/1.0 (+https://intheboxstudio.it/blog)";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": USER_AGENT },
});

function summarize(text: string | undefined, maxLength = 400): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength)}…` : clean;
}

/**
 * Fetches all trusted feeds and returns items published within the last
 * `windowHours`, each tagged with a sequential id so the LLM selection step
 * can reference items by number instead of restating (and risking
 * hallucinating) titles/URLs.
 */
export async function fetchRecentNews(windowHours = 36): Promise<NewsItem[]> {
  const cutoff = Date.now() - windowHours * 60 * 60 * 1000;
  const items: Omit<NewsItem, "id">[] = [];

  await Promise.all(
    TRUSTED_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of parsed.items) {
          if (!item.link || !item.title) continue;

          const publishedAt = item.isoDate ?? item.pubDate;
          if (!publishedAt) continue;

          const publishedTime = new Date(publishedAt).getTime();
          if (Number.isNaN(publishedTime) || publishedTime < cutoff) continue;

          items.push({
            source: feed.name,
            title: item.title,
            link: item.link,
            summary: summarize(item.contentSnippet ?? item.content),
            publishedAt: new Date(publishedTime).toISOString(),
          });
        }
      } catch (error) {
        console.error(`[blog] failed to fetch feed "${feed.name}":`, (error as Error).message);
      }
    }),
  );

  items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return items.map((item, index) => ({ id: index + 1, ...item }));
}
