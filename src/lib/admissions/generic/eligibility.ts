/**
 * Generic eligibility engine.
 *
 * Conceptually equivalent to:
 *   checkEligibility(studentProfile, admissionPath, academicYear)
 *
 * Returns status, reasons, rulesApplied, sources — fully traceable.
 */

import type { StudentProfile, AcademicResult } from "@/types";
import type { AdmissionRule } from "@/types/rules";
import type { SchoolSubject } from "@/types/school";
import {
  evaluateRules,
  getCurrentAcademicYear,
  type EligibilityResult,
  type CalculationResult,
} from "../rule-engine";

/* ------------------------------------------------------------------ */
/* Generic check                                                       */
/* ------------------------------------------------------------------ */

/**
 * Generic eligibility check for any admission path.
 *
 * @param profile - Student profile
 * @param rules - Applicable admission rules
 * @param context - Authority, pathway, academic year
 * @param getFieldValue - Function to resolve field values from the student's data
 */
export function checkEligibility(
  profile: StudentProfile,
  rules: AdmissionRule[],
  context: {
    authority: string;
    pathway?: string;
    academicYear?: string;
  },
  getFieldValue: (fieldType: string) => number | string | undefined,
): EligibilityResult {
  const academicYear = context.academicYear ?? getCurrentAcademicYear();

  return evaluateRules(
    rules,
    { ...context, academicYear },
    getFieldValue,
  );
}

/**
 * Common field resolver for board + entrance exam context.
 */
export function createFieldValueResolver(
  profile: StudentProfile,
  class12Result: AcademicResult | undefined,
  subjects: SchoolSubject[],
) {
  return (fieldType: string): number | string | undefined => {
    switch (fieldType) {
      case "class-12-pass":
        return class12Result ? 1 : 0;
      case "has-physics":
        return subjects.some((s) => s.name.toLowerCase().includes("physics")) ? 1 : 0;
      case "has-chemistry":
        return subjects.some((s) => s.name.toLowerCase().includes("chemistry")) ? 1 : 0;
      case "has-mathematics":
        return subjects.some((s) => s.name.toLowerCase().includes("math")) ? 1 : 0;
      case "has-biology":
        return subjects.some(
          (s) => s.name.toLowerCase().includes("bio") || s.name.toLowerCase().includes("biotech"),
        ) ? 1 : 0;
      case "age-limit":
      case "age-minimum":
        return profile.birthYear
          ? new Date().getFullYear() - profile.birthYear
          : -1;
      case "category":
        return profile.category ?? "General";
      case "state-domicile":
        return profile.state ?? "Unknown";
      case "class-12-marks-75-percent":
        return class12Result?.percentage ?? 0;
      default:
        return undefined;
    }
  };
}
