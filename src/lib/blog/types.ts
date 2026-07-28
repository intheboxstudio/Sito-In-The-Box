export type SourceRef = {
  name: string;
  url: string;
};

export type CoverImage = {
  url: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
};

export type BlogPost = {
  slug: string;
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
  "slug" | "title" | "excerpt" | "tags" | "publishedAt"
> & {
  coverImageUrl: string;
  coverImageAlt: string;
};

export type NewsItem = {
  id: number;
  source: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
};
