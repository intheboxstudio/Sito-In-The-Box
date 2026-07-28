import type { MetadataRoute } from "next";
import { SERVICES } from "@/data/services";
import { getIndex } from "@/lib/blog/store";

const BASE_URL = "https://intheboxstudio.it";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/chi-sono", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contatti", changeFrequency: "monthly" as const, priority: 0.9 },
  ].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceRoutes = SERVICES.map((service) => ({
    url: `${BASE_URL}/servizi/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogPosts = await getIndex();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
