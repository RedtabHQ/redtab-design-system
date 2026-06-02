export const MIN_CREDIT_SCORE = 0;
export const MAX_CREDIT_SCORE = 850;

export const clampCreditScore = (score?: number | null): number => {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return MIN_CREDIT_SCORE;
  }
  return Math.min(Math.max(score, MIN_CREDIT_SCORE), MAX_CREDIT_SCORE);
};

export const getCreditScorePercent = (score?: number | null): number => {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return 0;
  }

  if (score <= 100) {
    return Math.max(score, 0);
  }

  const clamped = clampCreditScore(score);
  return (clamped / MAX_CREDIT_SCORE) * 100;
};
