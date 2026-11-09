import { describe, it, expect } from "vitest";
import { countPendingArrears, isEligibleForPlacements } from "../backlog_clearance_tracker";

describe("Backlog Clearance Tracker", () => {
  it("counts standing arrears", () => {
    const list = [{ code: "MA3151", isCleared: false }, { code: "PH3151", isCleared: true }];
    expect(countPendingArrears(list)).toBe(1);
    expect(isEligibleForPlacements(1)).toBe(false);
  });
});
