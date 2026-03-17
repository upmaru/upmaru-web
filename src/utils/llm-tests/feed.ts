import { FAILSAFE_SCHEMA, load } from "js-yaml";
import { summarizeLatencyScore } from "./latency";
import { sumStepScores } from "./scoring";

export type FeedSuiteMeta = {
  slug: string;
  title: string;
  description: string;
};

export type FeedRunMeta = {
  slug: string;
  title: string;
  description: string;
  suites: FeedSuiteMeta[];
};

type ParsedTask = {
  id: number;
  score: number | null;
  insertedAtRaw: string;
  updatedAtRaw: string;
  outputRaw: string;
};

type ParsedTurn = {
  tasks: ParsedTask[];
};

type ParsedResultsDocument = {
  suite: string;
  inferenceProvider: string;
  publishedAtRaw: string;
  updatedAtRaw: string;
  turns: ParsedTurn[];
};

export type LlmFeedEntry = {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  runSlug: string;
  suiteSlug: string;
};

function normalizeScore(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized.length) return null;
  if (normalized === "pass") return 2;
  if (normalized === "partial") return 1;
  if (normalized === "fail") return 0;
  if (normalized === "0" || normalized === "1" || normalized === "2") {
    return Number(normalized);
  }
  return null;
}

function parseFlexibleTimestamp(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed.length) return null;

  const nativeParsed = new Date(trimmed);
  if (!Number.isNaN(nativeParsed.getTime())) return nativeParsed;

  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/,
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second, fraction = "0"] = match;
  const milliseconds = Math.floor(
    Number(`${fraction}000`.slice(0, 3)),
  );

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    milliseconds,
  );
}

function parseResultsDocument(rawYaml: string): ParsedResultsDocument | null {
  const parsed = load(rawYaml, { schema: FAILSAFE_SCHEMA }) as
    | Record<string, unknown>
    | undefined;

  if (!parsed || typeof parsed !== "object") return null;

  const turns = Array.isArray(parsed.turns)
    ? parsed.turns
        .map((rawTurn) => {
          const turnRecord =
            rawTurn && typeof rawTurn === "object"
              ? (rawTurn as Record<string, unknown>)
              : {};

          const tasks = Array.isArray(turnRecord.tasks)
            ? turnRecord.tasks
                .filter(
                  (task): task is Record<string, unknown> =>
                    Boolean(task) && typeof task === "object",
                )
                .map((task) => ({
                  id: Number(task.id ?? 0),
                  score: normalizeScore(task.score ?? task.result),
                  insertedAtRaw: String(task.inserted_at ?? ""),
                  updatedAtRaw: String(task.updated_at ?? ""),
                  outputRaw: String(task.output ?? ""),
                }))
            : [];

          return { tasks };
        })
        .filter((turn) => turn.tasks.length > 0)
    : [];

  return {
    suite: String(parsed.suite ?? "").trim(),
    inferenceProvider: String(parsed.inference_provider ?? "").trim(),
    publishedAtRaw: String(parsed.published_at ?? "").trim(),
    updatedAtRaw: String(parsed.updated_at ?? "").trim(),
    turns,
  };
}

function averageAcrossTurns(values: number[], totalTurns: number) {
  if (totalTurns <= 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / totalTurns).toFixed(1));
}

function summarizeScores(document: ParsedResultsDocument) {
  const outputScores: number[] = [];
  const latencyScores: number[] = [];

  for (const turn of document.turns) {
    const tasks = [...turn.tasks].sort((a, b) => a.id - b.id);
    const outputScopeTasks = tasks.filter(
      (task) => task.id >= 1 && task.id <= 5,
    );
    const hasAllOutputScores = [1, 2, 3, 4, 5].every((id) =>
      outputScopeTasks.some(
        (task) => task.id === id && typeof task.score === "number",
      ),
    );

    if (hasAllOutputScores) {
      outputScores.push(
        sumStepScores(outputScopeTasks, { fromStep: 1, toStep: 5 }).total,
      );
    }

    const waitingDurations = tasks
      .filter((task) => task.id >= 1 && task.id <= 4)
      .map((task) => {
        const start = parseFlexibleTimestamp(task.insertedAtRaw);
        const end = parseFlexibleTimestamp(task.updatedAtRaw);
        if (!start || !end) return null;
        return { durationMicros: Math.max(end.getTime() - start.getTime(), 1) * 1000 };
      })
      .filter((task): task is { durationMicros: number } => Boolean(task));

    const latencySummary = summarizeLatencyScore(waitingDurations, {
      expectedStepCount: 4,
    });
    if (latencySummary) latencyScores.push(latencySummary.normalizedScore);
  }

  return {
    outputScoreAvg: averageAcrossTurns(outputScores, document.turns.length),
    latencyScoreAvg: averageAcrossTurns(latencyScores, document.turns.length),
    completedTurns: document.turns.filter((turn) =>
      turn.tasks.some(
        (task) =>
          task.outputRaw.trim().length > 0 || typeof task.score === "number",
      ),
    ).length,
    totalTurns: document.turns.length,
  };
}

function derivePublishedAt(document: ParsedResultsDocument): Date | null {
  const explicitPublishedAt = parseFlexibleTimestamp(document.publishedAtRaw);
  if (explicitPublishedAt) return explicitPublishedAt;

  const timestamps = document.turns
    .flatMap((turn) => turn.tasks.map((task) => task.insertedAtRaw))
    .map(parseFlexibleTimestamp)
    .filter((value): value is Date => Boolean(value));

  if (!timestamps.length) return null;
  return new Date(Math.min(...timestamps.map((value) => value.getTime())));
}

function deriveUpdatedAt(document: ParsedResultsDocument): Date | null {
  const explicitUpdatedAt = parseFlexibleTimestamp(document.updatedAtRaw);
  if (explicitUpdatedAt) return explicitUpdatedAt;

  const timestamps = document.turns
    .flatMap((turn) => turn.tasks.map((task) => task.updatedAtRaw))
    .map(parseFlexibleTimestamp)
    .filter((value): value is Date => Boolean(value));

  if (!timestamps.length) return derivePublishedAt(document);
  return new Date(Math.max(...timestamps.map((value) => value.getTime())));
}

function formatScore(value: number | null) {
  return value === null ? "-" : `${value.toFixed(1)}/10`;
}

function buildItemDescription(
  runTitle: string,
  suiteDescription: string,
  provider: string,
  summary: ReturnType<typeof summarizeScores>,
) {
  const parts = [
    suiteDescription,
    `Run: ${runTitle}.`,
    provider ? `Provider: ${provider}.` : null,
    `Turns recorded: ${summary.completedTurns}/${summary.totalTurns}.`,
    `Output avg: ${formatScore(summary.outputScoreAvg)}.`,
    `Latency avg: ${formatScore(summary.latencyScoreAvg)}.`,
  ].filter((part): part is string => Boolean(part));

  return parts.join(" ");
}

export function collectLlmFeedEntries(
  runMetas: FeedRunMeta[],
  rawResultsByPath: Record<string, string>,
): LlmFeedEntry[] {
  const runMetaBySlug = new Map(runMetas.map((run) => [run.slug, run]));

  return Object.entries(rawResultsByPath)
    .map(([filePath, rawYaml]) => {
      const match = filePath.match(/\/src\/data\/llm-tests\/([^/]+)\/([^/]+)\/results\.yml$/);
      if (!match) return null;

      const [, runSlug, suiteSlug] = match;
      const runMeta = runMetaBySlug.get(runSlug);
      if (!runMeta) return null;

      const suiteMeta = runMeta.suites.find((suite) => suite.slug === suiteSlug);
      if (!suiteMeta) return null;

      const document = parseResultsDocument(rawYaml);
      if (!document) return null;

      const pubDate = deriveUpdatedAt(document) ?? derivePublishedAt(document);
      if (!pubDate) return null;

      const summary = summarizeScores(document);
      const suiteTitle = document.suite || suiteMeta.title;

      return {
        title: `${suiteTitle} | ${runMeta.title}`,
        description: buildItemDescription(
          runMeta.title,
          suiteMeta.description,
          document.inferenceProvider,
          summary,
        ),
        link: `/llm-tests/${runSlug}/${suiteSlug}`,
        pubDate,
        runSlug,
        suiteSlug,
      };
    })
    .filter((entry): entry is LlmFeedEntry => Boolean(entry))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssXml(options: {
  site: URL;
  feedPath: string;
  title: string;
  description: string;
  items: LlmFeedEntry[];
}) {
  const { site, feedPath, title, description, items } = options;
  const siteOrigin = site.origin;
  const channelLink = new URL(
    feedPath.endsWith("/rss.xml")
      ? feedPath.slice(0, -"/rss.xml".length) || "/"
      : "/",
    siteOrigin,
  ).toString();
  const selfHref = new URL(feedPath, siteOrigin).toString();
  const lastBuildDate = items[0]?.pubDate ?? new Date();

  const itemXml = items
    .map((item) => {
      const absoluteLink = new URL(item.link, siteOrigin).toString();
      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(absoluteLink)}</link>`,
        `<guid isPermaLink="true">${escapeXml(absoluteLink)}</guid>`,
        `<pubDate>${item.pubDate.toUTCString()}</pubDate>`,
        `<description>${escapeXml(item.description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(title)}</title>`,
    `<description>${escapeXml(description)}</description>`,
    `<link>${escapeXml(channelLink)}</link>`,
    `<language>en-us</language>`,
    `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(selfHref)}" rel="self" type="application/rss+xml" />`,
    itemXml,
    "</channel>",
    "</rss>",
  ].join("");
}
