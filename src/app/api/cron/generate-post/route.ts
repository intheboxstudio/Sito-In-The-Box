import { NextResponse, type NextRequest } from "next/server";
import { fetchRecentNews } from "@/lib/blog/fetch-news";
import { generateDailyArticle } from "@/lib/blog/generate-article";
import { acquireDailyLock, savePost } from "@/lib/blog/store";

export const runtime = "nodejs";
export const maxDuration = 180;

function todayInRome(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayInRome();

  const gotLock = await acquireDailyLock(today);
  if (!gotLock) {
    return NextResponse.json({ status: "already-ran", date: today }, { status: 200 });
  }

  try {
    const newsItems = await fetchRecentNews();
    const post = await generateDailyArticle(newsItems);

    if (!post) {
      return NextResponse.json({ status: "skipped", date: today }, { status: 200 });
    }

    await savePost(post);

    return NextResponse.json({ status: "published", date: today, slug: post.slug }, { status: 200 });
  } catch (error) {
    console.error("[blog] cron run failed:", error);
    return NextResponse.json(
      { status: "error", date: today, message: (error as Error).message },
      { status: 500 },
    );
  }
}
