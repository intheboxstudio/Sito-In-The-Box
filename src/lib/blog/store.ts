import { put, head, del, BlobError } from "@vercel/blob";
import {
  imageIdFromUrl,
  normalizeStoryKey,
  normalizeUrl,
  usedImageIds,
  usedSourceUrls,
  usedStoryKeys,
} from "./dedupe";
import type { BlogIndexEntry, BlogPost } from "./types";

const INDEX_PATHNAME = "blog/index.json";
const postPathname = (slug: string) => `blog/posts/${slug}.json`;
const lockPathname = (date: string) => `blog/locks/${date}.lock`;

// Pass the token explicitly rather than relying on @vercel/blob's ambient
// auth detection: when a VERCEL_OIDC_TOKEN happens to be present but OIDC
// isn't provisioned for the current environment, the SDK prefers it over
// BLOB_READ_WRITE_TOKEN and fails even though a valid token is available.
const blobAuth = { token: process.env.BLOB_READ_WRITE_TOKEN };

async function resolveBlobUrl(pathname: string): Promise<string | null> {
  try {
    const result = await head(pathname, blobAuth);
    return result.url;
  } catch {
    return null;
  }
}

async function readJson<T>(pathname: string, revalidateSeconds?: number): Promise<T | null> {
  const url = await resolveBlobUrl(pathname);
  if (!url) return null;

  const response = await fetch(
    url,
    revalidateSeconds !== undefined
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" },
  );
  if (!response.ok) return null;

  return (await response.json()) as T;
}

async function writeJson(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    ...blobAuth,
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Index entries, newest first. Pass revalidateSeconds when reading from a page (ISR); omit for always-fresh pipeline reads. */
export async function getIndex(opts?: { revalidateSeconds?: number }): Promise<BlogIndexEntry[]> {
  const index = await readJson<BlogIndexEntry[]>(INDEX_PATHNAME, opts?.revalidateSeconds);
  return index ?? [];
}

export async function getPostBySlug(
  slug: string,
  opts?: { revalidateSeconds?: number },
): Promise<BlogPost | null> {
  return readJson<BlogPost>(postPathname(slug), opts?.revalidateSeconds);
}

export async function slugExists(slug: string): Promise<boolean> {
  return (await resolveBlobUrl(postPathname(slug))) !== null;
}

/**
 * Claims today's generation run. Returns false only when the lock blob
 * already exists (a run for this date has already started/completed,
 * closing the race window from Vercel's best-effort cron delivery
 * occasionally double-invoking the same schedule). Any other failure (bad
 * token, network error, suspended store, ...) is rethrown so the caller
 * surfaces a real error instead of silently treating it as "already ran".
 */
export async function acquireDailyLock(dateISO: string): Promise<boolean> {
  try {
    await put(lockPathname(dateISO), "locked", {
      ...blobAuth,
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "text/plain",
    });
    return true;
  } catch (error) {
    if (error instanceof BlobError && /already exists/i.test(error.message)) {
      return false;
    }
    throw error;
  }
}

export function indexEntryFor(post: BlogPost): BlogIndexEntry {
  return {
    slug: post.slug,
    storyKey: normalizeStoryKey(post.storyKey),
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    publishedAt: post.publishedAt,
    coverImageId: post.coverImage.id || imageIdFromUrl(post.coverImage.url),
    coverImageUrl: post.coverImage.url,
    coverImageAlt: post.coverImage.alt,
    sourceUrls: post.sources.map((source) => source.url),
  };
}

/**
 * Final, non-negotiable uniqueness gate at the write boundary. The generation
 * pipeline already filters duplicates much earlier; if anything still slips
 * through, publication fails loudly instead of putting a repeated story or a
 * repeated image on the blog.
 */
function assertUnique(post: BlogPost, index: BlogIndexEntry[]): void {
  if (index.some((entry) => entry.slug === post.slug)) {
    throw new Error(`[blog] refusing to overwrite existing post "${post.slug}"`);
  }

  const storyKey = normalizeStoryKey(post.storyKey);
  if (!storyKey) {
    throw new Error("[blog] refusing to publish a post without a storyKey");
  }
  if (usedStoryKeys(index).has(storyKey)) {
    throw new Error(`[blog] story "${storyKey}" has already been published`);
  }

  const imageId = post.coverImage.id || imageIdFromUrl(post.coverImage.url);
  if (usedImageIds(index).has(imageId)) {
    throw new Error(`[blog] cover image "${imageId}" has already been used`);
  }

  const takenUrls = usedSourceUrls(index);
  const reused = post.sources.find((source) => takenUrls.has(normalizeUrl(source.url)));
  if (reused) {
    throw new Error(`[blog] source "${reused.url}" was already used by another post`);
  }
}

/** Validates uniqueness, writes the post, then rewrites the index with it prepended. */
export async function savePost(post: BlogPost): Promise<void> {
  const currentIndex = await getIndex();
  assertUnique(post, currentIndex);

  await writeJson(postPathname(post.slug), post);

  const nextIndex = [indexEntryFor(post), ...currentIndex].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  await writeJson(INDEX_PATHNAME, nextIndex);
}

/** Removes a post and its index entry, freeing its story key and cover image. */
export async function deletePost(slug: string): Promise<boolean> {
  const url = await resolveBlobUrl(postPathname(slug));
  if (url) await del(url, blobAuth);

  const currentIndex = await getIndex();
  const nextIndex = currentIndex.filter((entry) => entry.slug !== slug);
  if (nextIndex.length !== currentIndex.length) {
    await writeJson(INDEX_PATHNAME, nextIndex);
  }

  return url !== null;
}
