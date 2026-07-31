#!/usr/bin/env node
/**
 * Maintenance CLI for the auto-generated blog stored in Vercel Blob.
 *
 *   node --env-file=.env.local scripts/blog-maintenance.mjs audit
 *   node --env-file=.env.local scripts/blog-maintenance.mjs delete <slug>
 *   node --env-file=.env.local scripts/blog-maintenance.mjs rebuild-index
 *
 * `audit` is read-only and reports the three uniqueness invariants the
 * pipeline enforces: one story per post, one cover image per post, one source
 * URL per post.
 */
import { list, put, del } from "@vercel/blob";

const INDEX_PATHNAME = "blog/index.json";
const POSTS_PREFIX = "blog/posts/";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN is not set — run with `node --env-file=.env.local`.");
  process.exit(1);
}
const auth = { token };

function normalizeUrl(raw) {
  try {
    const url = new URL(raw);
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return String(raw).trim().toLowerCase();
  }
}

function imageIdFromUrl(url) {
  return String(url).match(/\/photos\/(\d+)\//)?.[1] ?? normalizeUrl(url);
}

async function readAllPosts() {
  const { blobs } = await list({ ...auth, prefix: POSTS_PREFIX, limit: 1000 });
  const posts = await Promise.all(
    blobs.map(async (blob) => {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (!response.ok) throw new Error(`cannot read ${blob.pathname}: ${response.status}`);
      return { pathname: blob.pathname, post: await response.json() };
    }),
  );
  return posts.sort((a, b) => b.post.publishedAt.localeCompare(a.post.publishedAt));
}

function indexEntryFor(post) {
  return {
    slug: post.slug,
    storyKey: post.storyKey,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    publishedAt: post.publishedAt,
    coverImageId: post.coverImage.id ?? imageIdFromUrl(post.coverImage.url),
    coverImageUrl: post.coverImage.url,
    coverImageAlt: post.coverImage.alt,
    sourceUrls: (post.sources ?? []).map((source) => source.url),
  };
}

async function writeIndex(entries) {
  await put(INDEX_PATHNAME, JSON.stringify(entries), {
    ...auth,
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function reportCollisions(label, pairs) {
  const seen = new Map();
  let clashes = 0;
  for (const [key, slug] of pairs) {
    if (!key) continue;
    if (seen.has(key)) {
      console.log(`  ✗ ${label} "${key}" shared by:\n      ${seen.get(key)}\n      ${slug}`);
      clashes += 1;
    } else {
      seen.set(key, slug);
    }
  }
  if (clashes === 0) console.log(`  ✓ no duplicate ${label}`);
  return clashes;
}

async function audit() {
  const posts = await readAllPosts();
  console.log(`${posts.length} published posts\n`);

  let problems = 0;

  problems += reportCollisions(
    "story",
    posts.map(({ post }) => [post.storyKey, post.slug]),
  );
  problems += reportCollisions(
    "cover image",
    posts.map(({ post }) => [post.coverImage.id ?? imageIdFromUrl(post.coverImage.url), post.slug]),
  );
  problems += reportCollisions(
    "source URL",
    posts.flatMap(({ post }) =>
      (post.sources ?? []).map((source) => [normalizeUrl(source.url), post.slug]),
    ),
  );

  const missingStoryKey = posts.filter(({ post }) => !post.storyKey).map(({ post }) => post.slug);
  if (missingStoryKey.length > 0) {
    console.log(`  ✗ missing storyKey: ${missingStoryKey.join(", ")}`);
    problems += missingStoryKey.length;
  }

  console.log(`\n${problems === 0 ? "All uniqueness invariants hold." : `${problems} problem(s).`}`);
  if (problems > 0) process.exitCode = 1;
}

async function deletePost(slug) {
  if (!slug) {
    console.error("usage: delete <slug>");
    process.exit(1);
  }

  const { blobs } = await list({ ...auth, prefix: `${POSTS_PREFIX}${slug}.json`, limit: 1 });
  if (blobs.length === 0) {
    console.error(`no post found for slug "${slug}"`);
    process.exit(1);
  }

  await del(blobs[0].url, auth);
  console.log(`deleted ${blobs[0].pathname}`);
  await rebuildIndex();
}

async function rebuildIndex() {
  const posts = await readAllPosts();
  const missing = posts.filter(({ post }) => !post.storyKey).map(({ post }) => post.slug);
  if (missing.length > 0) {
    console.error(`refusing to rebuild: these posts have no storyKey:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }

  const entries = posts
    .map(({ post }) => indexEntryFor(post))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  await writeIndex(entries);
  console.log(`index rebuilt with ${entries.length} entries`);
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "audit":
    await audit();
    break;
  case "delete":
    await deletePost(args[0]);
    break;
  case "rebuild-index":
    await rebuildIndex();
    break;
  default:
    console.log("usage: blog-maintenance.mjs <audit|delete <slug>|rebuild-index>");
    process.exit(1);
}
