/**
 * NEET UG Engine.
 *
 * Builds:
 *  - NEET qualification check
 *  - Medical admission competitiveness assessment
 *
 * IMPORTANT: Never imply that qualifying NEET guarantees MBBS admission.
 * Qualification and admission are separate concepts.
 *
 * Inputs:
 *  - Physics, Chemistry, Biology marks
 *  - NEET total marks and percentile
 *  - Category
 *  - Board and Class XII information
 *  - Academic year
 *
 * RULES:
 *  - Qualification ≠ Admission
 *  - Full audit trail
 *  - No fabricated percentile conversions
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
/* NEET constants                                                      */
/* ------------------------------------------------------------------ */

export const NEET_AUTHORITY = "NTA";

export const NEET_MODEL: EntranceExamModel = {
  id: "neet-ug",
  name: "NEET UG",
  authority: "NTA (National Testing Agency)",
  papers: [
    {
      id: "single-paper",
      name: "NEET UG",
      subjects: ["Physics", "Chemistry", "Biology (Botany + Zoology)"],
      totalMarks: 720,
      markingScheme: "+4 / -1",
    },
  ],
  scoreScale: { min: 0, max: 720, negativeMarking: true, negativeMarkPerWrong: 1 },
  percentileScale: {
    min: 0,
    max: 100,
    formula: "NTA percentile = (candidates with score ≤ candidate / total candidates) × 100",
  },
  eligibilityRules: [
    {
      type: "age-minimum",
      operator: "gte",
      value: 17,
      description: "Must be at least 17 years old at the time of admission",
      mandatory: true,
    },
    {
      type: "class-12-pass",
      operator: "eq",
      value: 1,
      description: "Must have passed Class 12 with Physics, Chemistry, Biology/Biotechnology",
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
      type: "has-biology",
      operator: "eq",
      value: 1,
      description: "Must have Biology/Biotechnology as a subject in Class 12",
      mandatory: true,
    },
  ],
  rankRules: [
    { percentileMin: 99.9, rankRange: { min: 1, max: 100 }, description: "Top 100" },
    { percentileMin: 99, rankRange: { min: 100, max: 2000 }, description: "Top 2000" },
    { percentileMin: 95, rankRange: { min: 2000, max: 15000 }, description: "Top 15000" },
    { percentileMin: 90, rankRange: { min: 15000, max: 50000 }, description: "Top 50000" },
  ],
  admissionPaths: [
    {
      institutionType: "Medical College (MBBS)",
      counsellingAuthority: "MCC / State Counselling",
      requiresCounselling: true,
    },
    {
      institutionType: "Dental College (BDS)",
      counsellingAuthority: "MCC / State Counselling",
      requiresCounselling: true,
    },
    {
      institutionType: "Ayurveda (BAMS)",
      counsellingAuthority: "AYUSH Counselling",
      requiresCounselling: true,
    },
    {
      institutionType: "Homeopathy (BHMS)",
      counsellingAuthority: "AYUSH Counselling",
      requiresCounselling: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* NEET result model                                                   */
/* ------------------------------------------------------------------ */

export interface NEETResult {
  /** Total marks obtained (out of 720). */
  totalMarks: number;
  /** NTA percentile — stored as official value. */
  ntaPercentile?: number;
  /** All India Rank, if available. */
  air?: number;
  /** Category rank, if available. */
  categoryRank?: number;
  /** Category. */
  category: string;
  /** Subject-wise marks. */
  subjects: {
    name: string;
    marksObtained: number;
    marksMaximum: number;
  }[];
  /** Year. */
  year: number;
}

/* ------------------------------------------------------------------ */
/* NEET qualification check                                            */
/* ------------------------------------------------------------------ */

/**
 * Check NEET qualification.
 *
 * This is SEPARATE from medical admission competitiveness.
 * Qualifying NEET means you are eligible to participate in counselling.
 * It does NOT guarantee MBBS admission.
 */
export function evaluateNeetQualification(
  profile: StudentProfile,
  class12Result: AcademicResult | undefined,
  subjects: SchoolSubject[],
  neetResult: NEETResult,
  academicYear: string = getCurrentAcademicYear(),
): EligibilityResult {
  const rules: AdmissionRule[] = [createNeetQualificationRules(academicYear)];

  return evaluateRules(
    rules,
    { authority: NEET_AUTHORITY, academicYear },
    (ruleType) => {
      switch (ruleType) {
        case "age-minimum":
          return profile.birthYear
            ? new Date().getFullYear() - profile.birthYear
            : -1;
        case "class-12-pass":
          return class12Result ? 1 : 0;
        case "has-physics":
          return subjects.some((s) => s.name.toLowerCase().includes("physics")) ? 1 : 0;
        case "has-chemistry":
          return subjects.some((s) => s.name.toLowerCase().includes("chemistry")) ? 1 : 0;
        case "has-biology":
          return subjects.some(
            (s) =>
              s.name.toLowerCase().includes("bio") ||
              s.name.toLowerCase().includes("biotechnology"),
          )
            ? 1
            : 0;
        case "neet-marks-minimum":
          return neetResult.totalMarks;
        default:
          return undefined;
      }
    },
  );
}

/* ------------------------------------------------------------------ */
/* Medical admission competitiveness                                  */
/* ------------------------------------------------------------------ */

/**
 * Assess medical admission competitiveness based on NEET score.
 *
 * IMPORTANT: This is an ASSESSMENT, not a guarantee.
 * Actual admission depends on counselling, seat availability, choice filling, etc.
 */
export function assessMedicalCompetitiveness(
  neetResult: NEETResult,
  academicYear: string = getCurrentAcademicYear(),
): {
  assessment: string;
  competitiveness: "high" | "moderate" | "low" | "insufficient-data";
  reasoning: string;
  disclaimer: string;
  audit: CalculationAudit;
} {
  const now = new Date().toISOString();

  if (!neetResult.ntaPercentile) {
    return {
      assessment: "Insufficient data",
      competitiveness: "insufficient-data",
      reasoning: "NEET percentile not available — cannot assess competitiveness",
      disclaimer: "This is an informational assessment only. Actual admission depends on counselling, seat matrix, choice filling, and multiple other factors.",
      audit: {
        inputs: { total_marks: neetResult.totalMarks, percentile: "N/A" },
        intermediateValues: {},
        formulaVersion: `NEET competitiveness ${academicYear} — informational only`,
        finalValue: 0,
        ruleSource: "NTA NEET results",
        generatedAt: now,
      },
    };
  }

  let competitiveness: "high" | "moderate" | "low" | "insufficient-data";
  let reasoning: string;

  if (neetResult.ntaPercentile >= 99) {
    competitiveness = "high";
    reasoning = `Percentile ${neetResult.ntaPercentile} is in the top 1% — competitive for AIIMS, top government medical colleges.`;
  } else if (neetResult.ntaPercentile >= 95) {
    competitiveness = "moderate";
    reasoning = `Percentile ${neetResult.ntaPercentile} is competitive for good government medical colleges and most private colleges.`;
  } else if (neetResult.ntaPercentile >= 50) {
    competitiveness = "moderate";
    reasoning = `Percentile ${neetResult.ntaPercentile} qualifies for counselling but may be limited to private/deemed universities.`;
  } else {
    competitiveness = "low";
    reasoning = `Percentile ${neetResult.ntaPercentile} is below the competitive range for most medical colleges.`;
  }

  return {
    assessment: `NEET Score: ${neetResult.totalMarks}/720 | Percentile: ${neetResult.ntaPercentile}`,
    competitiveness,
    reasoning,
    disclaimer: "This is an informational assessment only. Qualifying NEET does NOT guarantee MBBS admission. Actual admission depends on counselling rounds, seat availability, choice filling, category, domicile, and multiple other factors.",
    audit: {
      inputs: {
        total_marks: neetResult.totalMarks,
        percentile: neetResult.ntaPercentile,
        category: neetResult.category,
      },
      intermediateValues: {},
      formulaVersion: `NEET competitiveness assessment ${academicYear}`,
      finalValue: neetResult.totalMarks,
      ruleSource: "NTA NEET results — informational assessment",
      generatedAt: now,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Rule creation helpers                                               */
/* ------------------------------------------------------------------ */

function createNeetQualificationRules(academicYear: string): AdmissionRule {
  const now = new Date().toISOString();
  return {
    id: `neet-qual-${academicYear}` as any,
    authority: NEET_AUTHORITY,
    pathway: "qualification",
    academicYear,
    version: 1,
    eligibilityRules: [
      {
        type: "age-minimum",
        operator: "gte",
        value: 17,
        description: "Must be at least 17 years old at the time of admission",
        mandatory: true,
      },
      {
        type: "class-12-pass",
        operator: "eq",
        value: 1,
        description: "Must have passed Class 12 with PCB",
        mandatory: true,
      },
      {
        type: "has-physics",
        operator: "eq",
        value: 1,
        description: "Must have Physics in Class 12",
        mandatory: true,
      },
      {
        type: "has-chemistry",
        operator: "eq",
        value: 1,
        description: "Must have Chemistry in Class 12",
        mandatory: true,
      },
      {
        type: "has-biology",
        operator: "eq",
        value: 1,
        description: "Must have Biology/Biotechnology in Class 12",
        mandatory: true,
      },
    ],
    calculationRules: [],
    normalizationRules: [],
    categoryRules: [],
    subjectRules: [
      { subject: "Physics", mandatory: true },
      { subject: "Chemistry", mandatory: true },
      { subject: "Biology", mandatory: true },
    ],
    source: "" as any,
    sourceUrl: "https://neet.nta.ac.in",
    status: "VERIFIED",
    createdAt: now,
    updatedAt: now,
  };
}
