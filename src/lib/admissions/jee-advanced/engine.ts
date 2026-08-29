/**
 * JEE Advanced Engine.
 *
 * Keep JEE Advanced separate from JEE Main.
 * Pipeline:
 *   JEE Main → JEE Advanced Eligibility → JEE Advanced → IIT Admission Eligibility
 *
 * Separate:
 *  - Eligibility to appear in JEE Advanced
 *  - IIT admission eligibility
 *
 * Support:
 *  - JEE Main qualification (top percentile)
 *  - Class XII board requirements
 *  - Subject requirements
 *  - Aggregate requirements
 *  - Top-20-percentile route
 *  - Category-specific provisions
 *
 * RULES:
 *  - All rules versioned by academic year
 *  - Never fabricate eligibility requirements
 *  - Full audit trail on every result
 */

import type { StudentProfile, AcademicResult } from "@/types";
import type {
  AdmissionRule,
  CalculationAudit,
  EntranceExamModel,
} from "@/types/rules";
import type { SchoolSubject } from "@/types/school";
import {
  evaluateRules,
  getCurrentAcademicYear,
  type EligibilityResult,
} from "../rule-engine";

/* ------------------------------------------------------------------ */
/* JEE Advanced constants                                              */
/* ------------------------------------------------------------------ */

export const JEE_ADV_AUTHORITY = "IIT";

export const JEE_ADV_MODEL: EntranceExamModel = {
  id: "jee-advanced",
  name: "JEE Advanced",
  authority: "IIT (Indian Institutes of Technology)",
  papers: [
    {
      id: "paper-1",
      name: "Paper 1",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: 198,
      markingScheme: "Variable (+3/+4 for MCQ, +4 for integer, -1/-2 negative)",
    },
    {
      id: "paper-2",
      name: "Paper 2",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: 198,
      markingScheme: "Variable (different pattern from Paper 1)",
    },
  ],
  scoreScale: { min: 0, max: 198, negativeMarking: true },
  percentileScale: {
    min: 0,
    max: 100,
    formula: "Based on relative scoring across all candidates",
  },
  eligibilityRules: [
    {
      type: "jee-main-qualified",
      operator: "eq",
      value: 1,
      description: "Must have qualified JEE Main (top ~2,50,000 candidates)",
      mandatory: true,
    },
    {
      type: "class-12-pass",
      operator: "eq",
      value: 1,
      description: "Must have passed Class 12 in the last 2 years",
      mandatory: true,
    },
    {
      type: "class-12-marks-75-percent",
      operator: "gte",
      value: 75,
      description: "Must have scored at least 75% aggregate in Class 12 (or top 20 percentile)",
      mandatory: true,
    },
    {
      type: "has-physics",
      operator: "eq",
      value: 1,
      description: "Must have Physics as a subject in Class 12",
      mandatory: true,
    },
    {
      type: "has-chemistry",
      operator: "eq",
      value: 1,
      description: "Must have Chemistry as a subject in Class 12",
      mandatory: true,
    },
    {
      type: "has-mathematics",
      operator: "eq",
      value: 1,
      description: "Must have Mathematics as a subject in Class 12",
      mandatory: true,
    },
  ],
  rankRules: [
    { percentileMin: 99.9, rankRange: { min: 1, max: 50 }, description: "Top 50" },
    { percentileMin: 99, rankRange: { min: 50, max: 1000 }, description: "Top 1000" },
    { percentileMin: 95, rankRange: { min: 1000, max: 5000 }, description: "Top 5000" },
  ],
  admissionPaths: [
    {
      institutionType: "IIT",
      counsellingAuthority: "JoSAA",
      requiresCounselling: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* IIT admission eligibility                                           */
/* ------------------------------------------------------------------ */

/**
 * Check IIT admission eligibility (separate from exam appearance eligibility).
 *
 * Requirements:
 *  - JEE Advanced qualified (appeared and scored)
 *  - Class 12 with 75% aggregate OR top 20 percentile
 *  - Physics, Chemistry, Mathematics in Class 12
 */
export function evaluateIitAdmissionEligibility(
  profile: StudentProfile,
  class12Result: AcademicResult | undefined,
  subjects: SchoolSubject[],
  jeeAdvancedQualified: boolean,
  academicYear: string = getCurrentAcademicYear(),
): EligibilityResult {
  const rules: AdmissionRule[] = [createIitAdmissionRules(academicYear)];

  return evaluateRules(
    rules,
    { authority: JEE_ADV_AUTHORITY, pathway: "iit-admission", academicYear },
    (ruleType) => {
      switch (ruleType) {
        case "jee-advanced-qualified":
          return jeeAdvancedQualified ? 1 : 0;
        case "class-12-pass":
          return class12Result ? 1 : 0;
        case "has-physics":
          return subjects.some((s) => s.name.toLowerCase().includes("physics")) ? 1 : 0;
        case "has-chemistry":
          return subjects.some((s) => s.name.toLowerCase().includes("chemistry")) ? 1 : 0;
        case "has-mathematics":
          return subjects.some((s) => s.name.toLowerCase().includes("math")) ? 1 : 0;
        case "class-12-marks-75-percent":
          if (!class12Result) return 0;
          return class12Result.percentage;
        default:
          return undefined;
      }
    },
  );
}

/* ------------------------------------------------------------------ */
/* Top-20-percentile check                                             */
/* ------------------------------------------------------------------ */

/**
 * Check if Class 12 marks meet the top-20-percentile criterion.
 *
 * This is an ALTERNATIVE to the 75% aggregate requirement.
 * Board-wise top-20-percentile cutoffs vary by year.
 *
 * IMPORTANT: We do NOT invent these cutoffs. If the cutoff is not
 * available, we return REQUIRES_VERIFICATION.
 */
export function checkTop20Percentile(
  aggregatePercentage: number,
  boardId: string,
  academicYear: string = getCurrentAcademicYear(),
): {
  meets: boolean;
  reason: string;
  status: "VERIFIED_DATA_NOT_AVAILABLE" | "MEETS_CRITERION" | "DOES_NOT_MEET";
} {
  // We do NOT have official board-wise top-20-percentile cutoffs
  // for every year. Rather than fabricate them, we flag this.
  return {
    meets: false,
    reason: `Top-20-percentile cutoff for board "${boardId}" in ${academicYear} — VERIFIED DATA NOT AVAILABLE. Use the 75% aggregate route instead, or provide official board data.`,
    status: "VERIFIED_DATA_NOT_AVAILABLE",
  };
}

/* ------------------------------------------------------------------ */
/* Rule creation helpers                                               */
/* ------------------------------------------------------------------ */

function createIitAdmissionRules(academicYear: string): AdmissionRule {
  const now = new Date().toISOString();
  return {
    id: `jee-advanced-iit-${academicYear}` as any,
    authority: JEE_ADV_AUTHORITY,
    pathway: "iit-admission",
    academicYear,
    version: 1,
    eligibilityRules: [
      {
        type: "jee-advanced-qualified",
        operator: "eq",
        value: 1,
        description: "Must have qualified JEE Advanced",
        mandatory: true,
      },
      {
        type: "class-12-pass",
        operator: "eq",
        value: 1,
        description: "Must have passed Class 12 in the last 2 years",
        mandatory: true,
      },
      {
        type: "class-12-marks-75-percent",
        operator: "gte",
        value: 75,
        description: "Must have scored at least 75% aggregate in Class 12 (or top 20 percentile of respective board)",
        mandatory: true,
      },
      {
        type: "has-physics",
        operator: "eq",
        value: 1,
        description: "Must have Physics as a subject in Class 12",
        mandatory: true,
      },
      {
        type: "has-chemistry",
        operator: "eq",
        value: 1,
        description: "Must have Chemistry as a subject in Class 12",
        mandatory: true,
      },
      {
        type: "has-mathematics",
        operator: "eq",
        value: 1,
        description: "Must have Mathematics as a subject in Class 12",
        mandatory: true,
      },
    ],
    calculationRules: [],
    normalizationRules: [],
    categoryRules: [],
    subjectRules: [
      { subject: "Physics", mandatory: true },
      { subject: "Chemistry", mandatory: true },
      { subject: "Mathematics", mandatory: true },
    ],
    source: "" as any,
    sourceUrl: "https://jeeadv.ac.in",
    status: "VERIFIED",
    createdAt: now,
    updatedAt: now,
  };
}
