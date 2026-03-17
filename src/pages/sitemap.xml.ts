import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  collectLlmFeedEntries,
  type FeedRunMeta,
} from "../utils/llm-tests/feed";

export const prerender = true;

const runModules = import.meta.glob("/src/data/llm-tests/*/suites.ts", {
  eager: true,
}) as Record<string, { llmTestRunMeta?: FeedRunMeta }>;

const rawResultsByPath = import.meta.glob("/src/data/llm-tests/*/*/results.yml", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type SitemapUrl = {
  path: string;
  lastmod?: Date;
};

export const GET: APIRoute = async ({ site }) => {
  const canonicalSite = site ?? new URL("https://upmaru.com");
  const runMetas = Object.values(runModules)
    .map((module) => module.llmTestRunMeta)
    .filter((run): run is FeedRunMeta => Boolean(run));
  const llmEntries = collectLlmFeedEntries(runMetas, rawResultsByPath);
  const blogPosts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    }));

  const runLastmodBySlug = new Map<string, Date>();
  for (const entry of llmEntries) {
    const current = runLastmodBySlug.get(entry.runSlug);
    if (!current || entry.pubDate.getTime() > current.getTime()) {
      runLastmodBySlug.set(entry.runSlug, entry.pubDate);
    }
  }

  const urls: SitemapUrl[] = [
    { path: "/" },
    { path: "/blog", lastmod: blogPosts[0]?.lastmod },
    { path: "/llm-tests", lastmod: llmEntries[0]?.pubDate },
    { path: "/privacy" },
    { path: "/terms" },
    ...blogPosts,
    ...runMetas.map((run) => ({
      path: `/llm-tests/${run.slug}`,
      lastmod: runLastmodBySlug.get(run.slug),
    })),
    ...llmEntries.map((entry) => ({
      path: entry.link,
      lastmod: entry.pubDate,
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => {
      const absoluteUrl = new URL(url.path, canonicalSite).toString();
      return [
        "<url>",
        `<loc>${escapeXml(absoluteUrl)}</loc>`,
        url.lastmod ? `<lastmod>${url.lastmod.toISOString()}</lastmod>` : null,
        "</url>",
      ]
        .filter((value): value is string => Boolean(value))
        .join("");
    }),
    "</urlset>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
};
