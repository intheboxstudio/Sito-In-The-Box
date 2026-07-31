import type { CoverImage } from "./types";

type PexelsPhoto = {
  id: number;
  src: { large2x: string; large: string };
  photographer: string;
  photographer_url: string;
  alt: string | null;
};

type PexelsSearchResponse = {
  photos?: PexelsPhoto[];
};

const PER_PAGE = 80;
const MAX_PAGES = 3;

async function searchPexels(
  query: string,
  page: number,
  apiKey: string,
): Promise<PexelsPhoto[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));

  try {
    const response = await fetch(url, { headers: { Authorization: apiKey } });
    if (!response.ok) {
      console.error(`[blog] Pexels search failed (${query}, p${page}): ${response.status}`);
      return [];
    }
    const data = (await response.json()) as PexelsSearchResponse;
    return data.photos ?? [];
  } catch (error) {
    console.error("[blog] Pexels search error:", (error as Error).message);
    return [];
  }
}

/**
 * Returns a landscape photo that has never been used by a published post.
 * Walks several result pages and then the fallback queries, so exhausting one
 * query's fresh results never forces a reuse. Returns null only when every
 * candidate is already taken — callers must then skip publication rather than
 * republish a known image.
 */
export async function pickCoverImage(
  queries: string[],
  usedImageIds: ReadonlySet<string>,
): Promise<CoverImage | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("[blog] PEXELS_API_KEY is not set");
    return null;
  }

  const attempted = new Set<string>();

  for (const rawQuery of queries) {
    const query = rawQuery.trim();
    if (!query || attempted.has(query.toLowerCase())) continue;
    attempted.add(query.toLowerCase());

    for (let page = 1; page <= MAX_PAGES; page++) {
      const photos = await searchPexels(query, page, apiKey);
      if (photos.length === 0) break;

      const photo = photos.find((candidate) => !usedImageIds.has(String(candidate.id)));
      if (photo) {
        return {
          id: String(photo.id),
          url: photo.src.large2x,
          photographer: photo.photographer,
          photographerUrl: photo.photographer_url,
          alt: photo.alt || query,
        };
      }

      if (photos.length < PER_PAGE) break;
    }
  }

  console.error("[blog] every candidate cover image was already used:", queries.join(" | "));
  return null;
}
