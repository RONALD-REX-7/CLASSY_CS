import { describe, it, expect } from "vitest";
import { gradeToPoints } from "../grade_point_converter";

describe("Grade Point Converter", () => {
  it("converts O to 10 points", () => {
    expect(gradeToPoints("O")).toBe(10);
  });
  it("converts RA (reappear) to 0 points", () => {
    expect(gradeToPoints("RA")).toBe(0);
  });
});
