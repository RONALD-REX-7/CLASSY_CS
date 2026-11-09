import { describe, it, expect } from "vitest";
import { computeGpaTrend } from "../semester_gpa_trend";

describe("Semester GPA Trend", () => {
  it("identifies positive improvement trend", () => {
    const trend = computeGpaTrend([8.0, 8.5, 9.0]);
    expect(trend.isImproving).toBe(true);
    expect(trend.average).toBe(8.5);
  });
});
