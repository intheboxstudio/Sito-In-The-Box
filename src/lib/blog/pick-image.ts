import type { CoverImage } from "./types";

type PexelsPhoto = {
  src: { large2x: string; large: string };
  photographer: string;
  photographer_url: string;
  alt: string | null;
};

type PexelsSearchResponse = {
  photos: PexelsPhoto[];
};

/**
 * Searches Pexels for a landscape photo matching the query. Returns null on
 * any failure or empty result set — callers should treat a missing image as
 * a reason to skip today's publication rather than publish without one.
 */
export async function pickCoverImage(query: string): Promise<CoverImage | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("[blog] PEXELS_API_KEY is not set");
    return null;
  }

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "5");

  try {
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      console.error(`[blog] Pexels search failed: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as PexelsSearchResponse;
    const photo = data.photos?.[0];
    if (!photo) return null;

    return {
      url: photo.src.large2x,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || query,
    };
  } catch (error) {
    console.error("[blog] Pexels search error:", (error as Error).message);
    return null;
  }
}
