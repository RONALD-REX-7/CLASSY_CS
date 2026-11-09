import { describe, it, expect } from "vitest";
import { validateElectiveCredits } from "../elective_credit_validator";

describe("Elective Credit Validator", () => {
  it("validates fulfilled elective requirements", () => {
    expect(validateElectiveCredits(18, 9)).toBe(true);
    expect(validateElectiveCredits(15, 9)).toBe(false);
  });
});
