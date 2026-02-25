export type LlmTestSuiteMeta = {
  slug: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
};

export const SIMPLE_TAMA_Q1_2026_RUN_LABEL =
  "Simple Tama Agentic Workflow - Q1 2026";

export const simpleTamaQ12026Suites: LlmTestSuiteMeta[] = [
  {
    slug: "mistral-suite",
    title: "Mistral Suite",
    description: "Test for Mistral's suite of models in an agentic workflow",
    iconSrc: "/m-rainbow.svg",
    iconAlt: "Mistral Suite icon",
  },
  {
    slug: "minimax-2-5",
    title: "Minimax 2.5",
    description: "Test for MiniMax 2.5 reasoning model in an agentic workflow",
    iconSrc: "/minimax-color.svg",
    iconAlt: "Minimax 2.5 icon",
  },
  {
    slug: "gemini-3",
    title: "Gemini 3",
    description: "Test for Gemini 3 model in an agentic workflow",
    iconSrc: "/gemini-color.svg",
    iconAlt: "Gemini 3 icon",
  },
];
