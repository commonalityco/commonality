import { ConformanceResult } from './get-conformance-results';

export function getConformanceScore(items: ConformanceResult[]): number {
  if (items.length === 0) {
    return 0;
  }

  const totalItems = items.length;

  // Define the weightage for each status
  const statusWeights: { [key: string]: number } = {
    pass: 1,
    warn: 0.5,
    fail: 0,
  };
  let totalScore = 0;

  for (const item of items) {
    const itemScore =
      statusWeights[item.status as keyof typeof statusWeights] || 0;
    totalScore += itemScore;
  }
  // Calculate the percentage score and round down to the nearest whole integer
  const percentageScore = Math.floor((totalScore / totalItems) * 100);

  return percentageScore;
}
