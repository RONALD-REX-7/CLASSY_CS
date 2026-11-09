import { describe, it, expect } from "vitest";
import { classifyDegree } from "../degree_classification_engine";

describe("Degree Classification Engine", () => {
  it("awards distinction for CGPA >= 8.5 without arrears", () => {
    expect(classifyDegree(8.8, false)).toBe("FIRST_CLASS_DISTINCTION");
  });
  it("awards first class if CGPA >= 8.5 but had past arrears", () => {
    expect(classifyDegree(8.8, true)).toBe("FIRST_CLASS");
  });
});
