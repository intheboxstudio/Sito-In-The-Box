export type SourceRef = {
  name: string;
  url: string;
};

export type CoverImage = {
  /** Pexels photo id — the uniqueness key that prevents an image being reused. */
  id: string;
  url: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
};

export type BlogPost = {
  slug: string;
  /**
   * Canonical id of the underlying news event ("openai-agent-huggingface-breach"),
   * shared by every outlet reporting it. Two posts must never share a storyKey:
   * one event = one article, forever.
   */
  storyKey: string;
  title: string;
  excerpt: string;
  tags: string[];
  bodyMarkdown: string;
  coverImage: CoverImage;
  sources: SourceRef[];
  publishedAt: string;
};

export type BlogIndexEntry = Pick<
  BlogPost,
  "slug" | "storyKey" | "title" | "excerpt" | "tags" | "publishedAt"
> & {
  coverImageId: string;
  coverImageUrl: string;
  coverImageAlt: string;
  /** Source URLs this post was written from — never reused by a later post. */
  sourceUrls: string[];
};

export type NewsItem = {
  id: number;
  source: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
};
