export interface ArrearItem {
  code: string;
  isCleared: boolean;
}

export function countPendingArrears(arrears: ArrearItem[]): number {
  return arrears.filter(a => !a.isCleared).length;
}

export function isEligibleForPlacements(pendingArrears: number): boolean {
  return pendingArrears === 0;
}
