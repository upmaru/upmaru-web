import type { APIRoute } from "astro";
import {
  buildRssXml,
  collectLlmFeedEntries,
  type FeedRunMeta,
} from "../../utils/llm-tests/feed";

export const prerender = true;

const runModules = import.meta.glob("/src/data/llm-tests/*/suites.ts", {
  eager: true,
}) as Record<string, { llmTestRunMeta?: FeedRunMeta }>;

const rawResultsByPath = import.meta.glob(
  "/src/data/llm-tests/*/*/results.yml",
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
) as Record<string, string>;

const runMetas = Object.values(runModules)
  .map((module) => module.llmTestRunMeta)
  .filter((run): run is FeedRunMeta => Boolean(run));

export const GET: APIRoute = ({ site }) => {
  const canonicalSite = site ?? new URL("https://upmaru.com");
  const items = collectLlmFeedEntries(runMetas, rawResultsByPath);
  const xml = buildRssXml({
    site: canonicalSite,
    feedPath: "/llm-tests/rss.xml",
    title: "Upmaru LLM Tests Feed",
    description:
      "Global feed for LLM benchmark publications and updates on Upmaru.",
    items,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
};
