export function calculateTneaCutoff(maths: number, physics: number, chemistry: number): number {
  if (maths < 0 || maths > 100 || physics < 0 || physics > 100 || chemistry < 0 || chemistry > 100) {
    throw new Error("Marks must be between 0 and 100");
  }
  return Number((maths + (physics / 2) + (chemistry / 2)).toFixed(2));
}
