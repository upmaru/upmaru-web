import type { APIRoute } from "astro";
import {
  SIMPLE_TAMA_Q1_2026_RUN_LABEL,
  type LlmTestSuiteMeta,
  simpleTamaQ12026Suites,
} from "../../../data/llm-tests/simple-tama-agentic-workflow-q1-2026/suites";
import { generateOgImageForLlmTest } from "../../../utils/generateOgImages";

export const prerender = true;

export function getStaticPaths() {
  return simpleTamaQ12026Suites.map((suite) => ({
    params: { suite: suite.slug },
    props: { suite },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { suite } = props as { suite: LlmTestSuiteMeta };

  return new Response(
    await generateOgImageForLlmTest({
      runLabel: SIMPLE_TAMA_Q1_2026_RUN_LABEL,
      title: suite.title,
      description: suite.description,
      iconPath: suite.iconSrc,
    }),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
};
