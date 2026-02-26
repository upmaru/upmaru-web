import type { APIRoute } from "astro";
import { generateOgImageForLlmTestRun } from "../../utils/generateOgImages";

type LlmTestRunMeta = {
  slug: string;
  title: string;
  description: string;
  suites: Array<{ iconSrc: string }>;
};

const runModules = import.meta.glob("/src/data/llm-tests/*/suites.ts", {
  eager: true,
}) as Record<string, { llmTestRunMeta?: LlmTestRunMeta }>;

const testRuns = Object.values(runModules)
  .map((module) => module.llmTestRunMeta)
  .filter((run): run is LlmTestRunMeta => Boolean(run));

export function getStaticPaths() {
  return testRuns.map((run) => ({
    params: { test: run.slug },
    props: { run },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { run } = props as { run: LlmTestRunMeta };
  const iconPaths = Array.from(
    new Set(
      run.suites
        .map((suite) => suite.iconSrc)
        .filter((iconPath): iconPath is string => Boolean(iconPath)),
    ),
  );

  return new Response(
    await generateOgImageForLlmTestRun({
      title: run.title,
      description: run.description,
      iconPaths,
    }),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
};
