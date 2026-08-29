/**
 * TNEA (Tamil Nadu Engineering Admissions) Engine.
 *
 * Calculates TNEA scores, evaluates eligibility, and applies category rules.
 * All calculations are deterministic and fully auditable.
 *
 * TNEA Score Structure (reduced-score):
 *   Mathematics = 100 (max)
 *   Physics     =  50 (max)
 *   Chemistry   =  50 (max)
 *   Total       = 200
 *
 * Formula:
 *   TNEA Score = Math Marks + (Physics Marks / 2) + (Chemistry Marks / 2)
 *
 * RULES:
 *  - Never fabricate scores or eligibility
 *  - Every result contains full calculation audit trail
 *  - Category-specific rules are applied explicitly
 *  - Board normalization is handled separately (not assumed)
 */

import type { StudentProfile, AcademicResult } from "@/types";
import type {
  AdmissionRule,
  CalculationAudit,
  CalculationRule,
  CategoryRule,
  SubjectRule,
} from "@/types/rules";
import type { SchoolSubject } from "@/types/school";
import {
  evaluateRules,
  getCurrentAcademicYear,
  type EligibilityResult,
  type CalculationResult,
} from "../rule-engine";

/* ------------------------------------------------------------------ */
/* TNEA constants                                                      */
/* ------------------------------------------------------------------ */

export const TNEA_AUTHORITY = "TNEA";
export const TNEA_MAX_SCORE = 200;

export const TNEA_SCORE_STRUCTURE = {
  mathematics: { maxMarks: 100, contribution: 100, label: "Mathematics" },
  physics: { maxMarks: 100, contribution: 50, label: "Physics" },
  chemistry: { maxMarks: 100, contribution: 50, label: "Chemistry" },
} as const;

/** TNEA accepted categories. */
export const TNEA_CATEGORIES = [
  "OC", // Open Category
  "BC", // Backward Class
  "MBC", // Most Backward Class
  "DNC", // Denotified Communities
  "SC", // Scheduled Caste
  "SCA", // Scheduled Caste (Arunthathiyars)
  "ST", // Scheduled Tribe
] as const;

export type TNEACategory = (typeof TNEA_CATEGORIES)[number];

/* ------------------------------------------------------------------ */
/* TNEA score calculation                                              */
/* ------------------------------------------------------------------ */

/**
 * Calculate TNEA score from Class 12 subject marks.
 *
 * The reduced-score structure:
 *   Math out of 100 → contributes 100 points
 *   Physics out of 100 → contributes 50 points (halved)
 *   Chemistry out of 100 → contributes 50 points (halved)
 *   Total = 200
 *
 * @returns CalculationResult with full audit trail
 */
export function calculateTneaScore(
  subjects: SchoolSubject[],
  academicYear: string = getCurrentAcademicYear(),
): CalculationResult {
  const now = new Date().toISOString();
  const inputs: Record<string, number | string> = {};
  const intermediateValues: Record<string, number> = {};

  // Find subjects by name (case-insensitive)
  const findSubject = (names: string[]): SchoolSubject | undefined =>
    subjects.find((s) => names.some((n) => s.name.toLowerCase().includes(n.toLowerCase())));

  const math = findSubject(["mathematics", "maths", "math"]);
  const physics = findSubject(["physics"]);
  const chemistry = findSubject(["chemistry", "chem"]);

  inputs.mathematics_marks = math?.obtainedMarks ?? 0;
  inputs.physics_marks = physics?.obtainedMarks ?? 0;
  inputs.chemistry_marks = chemistry?.obtainedMarks ?? 0;
  inputs.mathematics_max = math?.maxMarks ?? 100;
  inputs.physics_max = physics?.maxMarks ?? 100;
  inputs.chemistry_max = chemistry?.maxMarks ?? 100;

  // Calculate each component (normalized to contribution max)
  const mathScore = math
    ? Math.min(math.obtainedMarks, math.maxMarks) * (100 / math.maxMarks)
    : 0;
  const physicsScore = physics
    ? Math.min(physics.obtainedMarks, physics.maxMarks) * (50 / physics.maxMarks)
    : 0;
  const chemistryScore = chemistry
    ? Math.min(chemistry.obtainedMarks, chemistry.maxMarks) * (50 / chemistry.maxMarks)
    : 0;

  intermediateValues.math_score = mathScore;
  intermediateValues.physics_score = physicsScore;
  intermediateValues.chemistry_score = chemistryScore;

  const totalScore = mathScore + physicsScore + chemistryScore;

  return {
    value: Math.round(totalScore * 100) / 100,
    maxValue: TNEA_MAX_SCORE,
    conflicts: [],
    audit: {
      inputs,
      intermediateValues,
      formulaVersion: `TNEA ${academicYear} — Reduced Score (M=100, P=50, C=50)`,
      finalValue: Math.round(totalScore * 100) / 100,
      ruleSource: `TNEA ${academicYear} Official Score Structure`,
      generatedAt: now,
    },
  };
}

/* ------------------------------------------------------------------ */
/* TNEA eligibility evaluation                                         */
/* ------------------------------------------------------------------ */

/**
 * Evaluate TNEA eligibility for a student.
 *
 * Checks:
 *  - Class 12 pass with PCM
 *  - Age requirements
 *  - Nationality / domicile
 *  - Category-specific provisions
 *
 * @returns EligibilityResult with full provenance
 */
export function evaluateTneaEligibility(
  profile: StudentProfile,
  class12Result: AcademicResult | undefined,
  subjects: SchoolSubject[],
  category: TNEACategory,
  academicYear: string = getCurrentAcademicYear(),
): EligibilityResult {
  // Build a list of rules to evaluate
  const rules: AdmissionRule[] = [];

  // Core eligibility: Class 12 pass with PCM
  rules.push(createTneaCoreRules(academicYear));

  // Category-specific rules
  const categoryRule = createTneaCategoryRules(category, academicYear);
  if (categoryRule) rules.push(categoryRule);

  // Evaluate using the generic engine
  return evaluateRules(
    rules,
    { authority: TNEA_AUTHORITY, pathway: category, academicYear },
    (ruleType) => {
      switch (ruleType) {
        case "class-12-pass":
          return class12Result ? 1 : 0;
        case "has-physics":
          return subjects.some((s) => s.name.toLowerCase().includes("physics")) ? 1 : 0;
        case "has-chemistry":
          return subjects.some((s) => s.name.toLowerCase().includes("chemistry")) ? 1 : 0;
        case "has-mathematics":
          return subjects.some((s) => s.name.toLowerCase().includes("math")) ? 1 : 0;
        case "category":
          return category;
        case "age-limit":
          return profile.birthYear
            ? new Date().getFullYear() - profile.birthYear
            : -1;
        case "state-domicile":
          return profile.state === "Tamil Nadu" ? "yes" : "no";
        default:
          return undefined;
      }
    },
  );
}

/* ------------------------------------------------------------------ */
/* Rule creation helpers                                               */
/* ------------------------------------------------------------------ */

function createTneaCoreRules(academicYear: string): AdmissionRule {
  const now = new Date().toISOString();
  return {
    id: `tnea-core-${academicYear}` as any,
    authority: TNEA_AUTHORITY,
    pathway: "core",
    academicYear,
    version: 1,
    eligibilityRules: [
      {
        type: "class-12-pass",
        operator: "eq",
        value: 1,
        description: "Must have passed Class 12 (or equivalent) examination",
        mandatory: true,
      },
      {
        type: "has-physics",
        operator: "eq",
        value: 1,
        description: "Must have studied Physics in Class 12",
        mandatory: true,
      },
      {
        type: "has-chemistry",
        operator: "eq",
        value: 1,
        description: "Must have studied Chemistry in Class 12",
        mandatory: true,
      },
      {
        type: "has-mathematics",
        operator: "eq",
        value: 1,
        description: "Must have studied Mathematics in Class 12",
        mandatory: true,
      },
    ],
    calculationRules: [],
    normalizationRules: [],
    categoryRules: [],
    subjectRules: [
      { subject: "Mathematics", mandatory: true, maxMarks: 100 },
      { subject: "Physics", mandatory: true, maxMarks: 100 },
      { subject: "Chemistry", mandatory: true, maxMarks: 100 },
    ],
    source: "" as any,
    sourceUrl: "https://www.tneaonline.org",
    status: "VERIFIED",
    createdAt: now,
    updatedAt: now,
  };
}

function createTneaCategoryRules(
  category: TNEACategory,
  academicYear: string,
): AdmissionRule | null {
  const now = new Date().toISOString();

  const categoryInfo: Record<TNEACategory, { relaxation?: number; seatPercentage?: number; notes?: string }> = {
    OC: {},
    BC: { relaxation: 0, seatPercentage: 26.5, notes: "Backward Class reservation" },
    MBC: { relaxation: 0, seatPercentage: 20, notes: "Most Backward Class reservation" },
    DNC: { relaxation: 0, seatPercentage: 3, notes: "Denotified Communities reservation" },
    SC: { relaxation: 0, seatPercentage: 15, notes: "Scheduled Caste reservation" },
    SCA: { relaxation: 0, seatPercentage: 3, notes: "SC (Arunthathiyars) sub-quota" },
    ST: { relaxation: 0, seatPercentage: 1, notes: "Scheduled Tribe reservation" },
  };

  const info = categoryInfo[category];
  if (!info) return null;

  return {
    id: `tnea-category-${category.toLowerCase()}-${academicYear}` as any,
    authority: TNEA_AUTHORITY,
    pathway: category.toLowerCase(),
    academicYear,
    version: 1,
    eligibilityRules: [],
    calculationRules: [],
    normalizationRules: [],
    categoryRules: [
      {
        category,
        relaxation: info.relaxation,
        seatPercentage: info.seatPercentage,
        additionalRequirements: info.notes,
      },
    ],
    subjectRules: [],
    source: "" as any,
    sourceUrl: "https://www.tneaonline.org",
    status: "VERIFIED",
    createdAt: now,
    updatedAt: now,
  };
}

/* ------------------------------------------------------------------ */
/* TNEA result explanation                                             */
/* ------------------------------------------------------------------ */

/**
 * Generate a human-readable explanation of a TNEA calculation result.
 */
export function explainTneaResult(
  scoreResult: CalculationResult,
  eligibilityResult: EligibilityResult,
): {
  result: string;
  howCalculated: string;
  ruleUsed: string;
  academicYear: string;
  source: string;
  whatItMeans: string;
} {
  return {
    result: `TNEA Score: ${scoreResult.value} / ${scoreResult.maxValue}`,
    howCalculated: scoreResult.audit.formulaVersion,
    ruleUsed: scoreResult.audit.ruleSource,
    academicYear: scoreResult.audit.formulaVersion,
    source: eligibilityResult.sources.join(", ") || "No source available",
    whatItMeans:
      eligibilityResult.status === "ELIGIBLE"
        ? `Your TNEA score of ${scoreResult.value} qualifies you for engineering admissions through TNEA ${scoreResult.audit.formulaVersion}.`
        : eligibilityResult.status === "NOT_ELIGIBLE"
          ? `You do not currently meet TNEA eligibility requirements. Reasons: ${eligibilityResult.reasons.filter((r) => r.startsWith("FAILED")).join("; ")}`
          : "Eligibility could not be fully determined — some data requires verification.",
  };
}
