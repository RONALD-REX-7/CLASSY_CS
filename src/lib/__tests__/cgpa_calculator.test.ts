import { describe, it, expect } from "vitest";
import { calculateCgpa } from "../cgpa_calculator";

describe("CGPA Calculator", () => {
  it("computes accurate weighted CGPA", () => {
    const courses = [
      { courseCode: "CS301", credits: 4, gradePoints: 10 },
      { courseCode: "CS302", credits: 3, gradePoints: 8 },
    ];
    // (40 + 24) / 7 = 64 / 7 = 9.14
    expect(calculateCgpa(courses)).toBe(9.14);
  });
});
