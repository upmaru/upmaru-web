import type { APIRoute } from "astro";
import {
  buildRssXml,
  collectLlmFeedEntries,
  type FeedRunMeta,
} from "../../../utils/llm-tests/feed";
import { llmTestRunMeta } from "../../../data/llm-tests/simple-tama-agentic-workflow-q1-2026/suites";

export const prerender = true;

const rawResultsByPath = import.meta.glob(
  "/src/data/llm-tests/simple-tama-agentic-workflow-q1-2026/*/results.yml",
  {
    eager: true,
    query: "?raw",
    import: "default",
  },
) as Record<string, string>;

export const GET: APIRoute = ({ site }) => {
  const canonicalSite = site ?? new URL("https://upmaru.com");
  const items = collectLlmFeedEntries(
    [llmTestRunMeta as FeedRunMeta],
    rawResultsByPath,
  );
  const xml = buildRssXml({
    site: canonicalSite,
    feedPath: "/llm-tests/simple-tama-agentic-workflow-q1-2026/rss.xml",
    title: `${llmTestRunMeta.title} Feed`,
    description: `Feed for suite result publications and updates in ${llmTestRunMeta.title}.`,
    items,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
};
