export type TrustedFeed = {
  name: string;
  url: string;
  /** Official/primary source (AI lab's own blog) vs. independent press coverage. */
  isPrimarySource: boolean;
};

// Verified live (fetched + parsed) on 2026-07-28. Re-check periodically —
// publishers occasionally move or retire feed URLs without redirects.
export const TRUSTED_FEEDS: TrustedFeed[] = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml", isPrimarySource: true },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", isPrimarySource: true },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    isPrimarySource: false,
  },
  { name: "Ars Technica", url: "https://arstechnica.com/ai/feed/", isPrimarySource: false },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    isPrimarySource: false,
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    isPrimarySource: false,
  },
  {
    name: "VentureBeat",
    url: "https://venturebeat.com/category/ai/feed/",
    isPrimarySource: false,
  },
  { name: "Wired", url: "https://www.wired.com/feed/tag/ai/latest/rss", isPrimarySource: false },
];
