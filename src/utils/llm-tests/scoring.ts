type ScoredStep = {
  id: number;
  score: number | null | undefined;
};

type SumStepScoreOptions = {
  fromStep: number;
  toStep: number;
  stepMaxScore?: number;
};

export function sumStepScores(
  steps: ScoredStep[],
  options: SumStepScoreOptions,
) {
  const { fromStep, toStep, stepMaxScore = 2 } = options;
  const scopedSteps = steps.filter(
    (step) => step.id >= fromStep && step.id <= toStep,
  );

  const total = scopedSteps.reduce(
    (sum, step) =>
      sum +
      (typeof step.score === "number" && Number.isFinite(step.score)
        ? step.score
        : 0),
    0,
  );

  const stepCount = Math.max(toStep - fromStep + 1, 0);
  const max = stepCount * stepMaxScore;

  return {
    total,
    max,
    stepCount,
  };
}
