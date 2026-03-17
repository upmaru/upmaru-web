export type LlmTestSuiteMeta = {
  slug: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
};

export type LlmTestRunMeta = {
  slug: string;
  title: string;
  description: string;
  suites: LlmTestSuiteMeta[];
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
  {
    slug: "gemini-3-1",
    title: "Gemini 3.1 Flash Lite",
    description: "Test for Gemini 3.1 Flash Lite model in an agentic workflow",
    iconSrc: "/gemini-color.svg",
    iconAlt: "Gemini 3.1 Flash Lite icon",
  },
  {
    slug: "glm-5",
    title: "GLM 5",
    description: "Test for GLM 5 model in an agentic workflow",
    iconSrc: "/zai-logo.svg",
    iconAlt: "Z.ai logo",
  },
  {
    slug: "kimi-k-2-5",
    title: "Kimi K2.5",
    description: "Test for Kimi K2.5 model in an agentic workflow",
    iconSrc: "/kimi-color.svg",
    iconAlt: "Kimi icon",
  },
  {
    slug: "grok-4-1-fast",
    title: "Grok 4.1 Fast",
    description: "Test for Grok 4.1 Fast model in an agentic workflow",
    iconSrc: "/grok.svg",
    iconAlt: "Grok icon",
  },
  {
    slug: "grok-code-fast-1-suite",
    title: "Grok Code Fast 1 Suite",
    description:
      "Test for a Grok 4.1 Fast and Grok Code Fast 1 mixed suite in an agentic workflow",
    iconSrc: "/grok.svg",
    iconAlt: "Grok icon",
  },
  {
    slug: "gpt-oss-120b",
    title: "GPT OSS 120b",
    description: "Test for GPT OSS 120b model in an agentic workflow",
    iconSrc: "/openai.svg",
    iconAlt: "GPT OSS 120b icon",
  },
  {
    slug: "gpt-5-mini",
    title: "GPT 5 Mini",
    description: "Test for GPT 5 Mini model in an agentic workflow",
    iconSrc: "/openai.svg",
    iconAlt: "GPT 5 Mini icon",
  },
  {
    slug: "nemotron-3-super-120b",
    title: "Nemotron 3 Super 120b",
    description: "Test for Nemotron 3 Super 120b model in an agentic workflow",
    iconSrc: "/nvidia.svg",
    iconAlt: "NVIDIA icon",
  },
  {
    slug: "qwen-3-5",
    title: "Qwen 3.5",
    description: "Test for Qwen 3.5 model in an agentic workflow",
    iconSrc: "/qwen.svg",
    iconAlt: "Qwen icon",
  },
  {
    slug: "deepseek-3-2",
    title: "DeepSeek 3.2",
    description: "Test for DeepSeek 3.2 model in an agentic workflow",
    iconSrc: "/deepseek.svg",
    iconAlt: "DeepSeek icon",
  },
  {
    slug: "mistral-small-4",
    title: "Mistral Small 4",
    description: "Test for Mistral Small 4 model in an agentic workflow",
    iconSrc: "/m-rainbow.svg",
    iconAlt: "Mistral Small 4 icon",
  },
];

export const llmTestRunMeta: LlmTestRunMeta = {
  slug: "simple-tama-agentic-workflow-q1-2026",
  title: SIMPLE_TAMA_Q1_2026_RUN_LABEL,
  description:
    "LLM suite index for the Simple Tama Agentic Workflow test run in Q1 2026.",
  suites: simpleTamaQ12026Suites,
};
