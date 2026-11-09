import { describe, it, expect } from "vitest";
import { calculateTneaCutoff } from "../tnea_cutoff_evaluator";

describe("TNEA Cutoff Evaluator", () => {
  it("calculates 200 cutoff for perfect scores", () => {
    expect(calculateTneaCutoff(100, 100, 100)).toBe(200);
  });
  it("calculates accurate proportional cutoff", () => {
    // 95 + 45 + 40 = 180
    expect(calculateTneaCutoff(95, 90, 80)).toBe(180);
  });
});
