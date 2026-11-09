export function computeGpaTrend(semesterGpas: number[]): { average: number; isImproving: boolean } {
  if (semesterGpas.length === 0) return { average: 0, isImproving: false };
  const sum = semesterGpas.reduce((a, b) => a + b, 0);
  const average = Number((sum / semesterGpas.length).toFixed(2));
  const isImproving = semesterGpas.length > 1 && semesterGpas[semesterGpas.length - 1] > semesterGpas[0];
  return { average, isImproving };
}
