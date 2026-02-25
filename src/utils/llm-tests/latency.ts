export type LatencyScore = 0 | 1 | 2;
export type TimedLatencyTask = {
  start: { epochMicroseconds: number };
  end: { epochMicroseconds: number };
};
export type DurationLatencyTask = {
  durationMicros: number;
};

export const LATENCY_STEP_SCORE_RULES = {
  fastMs: 2000,
  moderateMs: 5000,
  maxPerStep: 2,
} as const;

export const LATENCY_NORMALIZED_SCORE_SCALE = {
  min: 1,
  max: 10,
} as const;

export function scoreLatencyMs(latencyMs: number): LatencyScore {
  if (!Number.isFinite(latencyMs) || latencyMs < 0) return 0;
  if (latencyMs < LATENCY_STEP_SCORE_RULES.fastMs) return 2;
  if (latencyMs < LATENCY_STEP_SCORE_RULES.moderateMs) return 1;
  return 0;
}

export function scoreLatencyMicros(latencyMicros: number): LatencyScore {
  return scoreLatencyMs(latencyMicros / 1000);
}

export function summarizeLatencyScore<T extends DurationLatencyTask>(
  tasks: T[],
) {
  if (!tasks.length) return null;

  const rawTotal = tasks.reduce(
    (sum, task) => sum + scoreLatencyMicros(task.durationMicros),
    0,
  );
  const rawMax = tasks.length * LATENCY_STEP_SCORE_RULES.maxPerStep;
  const normalizedScore = Math.max(
    LATENCY_NORMALIZED_SCORE_SCALE.min,
    Math.min(
      LATENCY_NORMALIZED_SCORE_SCALE.max,
      Math.round((rawTotal / rawMax) * LATENCY_NORMALIZED_SCORE_SCALE.max) ||
        LATENCY_NORMALIZED_SCORE_SCALE.min,
    ),
  );

  return {
    rawTotal,
    rawMax,
    stepCount: tasks.length,
    normalizedScore,
  };
}

export function calculateWindowLatencyMicros<T extends TimedLatencyTask>(
  tasks: T[],
): number | null {
  if (!tasks.length) return null;

  const startMicros = Math.min(
    ...tasks.map((task) => task.start.epochMicroseconds),
  );
  const endMicros = Math.max(
    ...tasks.map((task) => task.end.epochMicroseconds),
  );

  return Math.max(endMicros - startMicros, 1);
}
