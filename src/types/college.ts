/**
 * Extended College, Course, and Cutoff models for CLASSY.
 *
 * These extend the minimal foundation types with full context needed
 * for recommendations, comparisons, and what-if analysis.
 *
 * RULES:
 *  - Every cutoff must have enough context to be meaningful
 *  - Never store "College = X, Cutoff = 187" without context
 *  - All types are pure — no runtime code
 */

import type {
  CollegeId,
  CourseId,
  CutoffId,
  ExamType,
  StudentProfileId,
} from "./foundation";

/* ------------------------------------------------------------------ */
/* College (extended)                                                  */
/* ------------------------------------------------------------------ */

export interface CollegeExtended {
  id: CollegeId;
  name: string;
  /** Affiliated university. */
  university?: string;
  /** Short code (e.g. "IITB", "NITT"). */
  code?: string;
  /** Location. */
  city?: string;
  state?: string;
  /** Institution type. */
  type: InstitutionType;
  /** Official website URL. */
  officialUrl?: string;
  /** When this data was last verified. */
  verifiedAt?: string;
  /** Brief description. */
  description?: string;
}

export type InstitutionType =
  | "iit"
  | "nit"
  | "iiit"
  | "bits"
  | "state-govt"
  | "state-private"
  | "deemed"
  | "private"
  | "medical"
  | "dental"
  | "other";

/* ------------------------------------------------------------------ */
/* Course (extended)                                                   */
/* ------------------------------------------------------------------ */

export interface CourseExtended {
  id: CourseId;
  /** Parent college ID. */
  collegeId: CollegeId;
  /** Course display name (e.g. "Computer Science and Engineering"). */
  name: string;
  /** Discipline/branch (e.g. "CSE", "ECE", "MBBS"). */
  discipline: string;
  /** Degree type (e.g. "B.Tech", "MBBS", "B.Sc"). */
  degree: string;
  /** Admission pathways this course uses (e.g. ["TNEA", "JEE Main"]). */
  admissionPaths: string[];
  /** Eligibility requirements. */
  eligibility: CourseEligibility;
  /** Related career paths. */
  relatedCareers: string[];
  /** Duration in years. */
  durationYears?: number;
  /** Total seats. */
  totalSeats?: number;
  /** Whether this is a preferred course for the user. */
  isPreferred?: boolean;
}

export interface CourseEligibility {
  /** Required stream in Class 12 (e.g. "PCM", "PCB"). */
  requiredStream?: string[];
  /** Minimum Class 12 percentage. */
  minClass12Percentage?: number;
  /** Required subjects. */
  requiredSubjects?: string[];
  /** Minimum age. */
  minAge?: number;
  /** Additional requirements. */
  additionalRequirements?: string[];
}

/* ------------------------------------------------------------------ */
/* Cutoff (extended)                                                   */
/* ------------------------------------------------------------------ */

/**
 * Every cutoff must contain enough context to be meaningful.
 * Never store "College = X, Cutoff = 187" without context.
 */
export interface CutoffExtended {
  id: CutoffId;
  collegeId: CollegeId;
  courseId: CourseId;
  /** Authority that published this cutoff (e.g. "TNEA", "JoSAA"). */
  authority: string;
  /** Admission pathway (e.g. "general", "home-state", "ews"). */
  admissionPath: string;
  /** Category (e.g. "OC", "BC", "General", "OBC-NCL"). */
  category: string;
  /** Quota type (e.g. "state", "all-india", "management"). */
  quota: string;
  /** Year. */
  year: number;
  /** Counselling round (1, 2, 3, etc. or "spot"). */
  round: number | "spot";
  /** Type of cutoff value. */
  cutoffType: CutoffType;
  /** The closing value (rank, marks, or percentile). */
  cutoffValue: number;
  /** Source reference. */
  source?: string;
  /** Direct URL to source. */
  sourceUrl?: string;
  /** When this data was last verified. */
  verifiedAt?: string;
}

export type CutoffType =
  | "closing-rank"
  | "closing-marks"
  | "closing-percentile"
  | "opening-rank"
  | "opening-marks";

/* ------------------------------------------------------------------ */
/* Cutoff classification                                               */
/* ------------------------------------------------------------------ */

/**
 * Deterministic classification based on student score vs historical cutoff.
 * NEVER use "Guaranteed", "100% Admission", "Confirmed Seat".
 */
export type CutoffClassification =
  | "SAFE"
  | "TARGET"
  | "REACH"
  | "LOW_PROBABILITY"
  | "INELIGIBLE";

export interface ClassificationResult {
  classification: CutoffClassification;
  /** Human-readable explanation. */
  explanation: string;
  /** The student's score used for comparison. */
  studentScore: number;
  /** The cutoff value compared against. */
  cutoffValue: number;
  /** Historical range (min–max across years). */
  historicalRange?: { min: number; max: number };
  /** Whether eligibility passed. */
  eligibilityPassed: boolean;
}

/* ------------------------------------------------------------------ */
/* Target ladder                                                       */
/* ------------------------------------------------------------------ */

/**
 * A curated set of recommendations organized by classification.
 * Approximately 3 Safe + 3 Target + 3 Reach when data is sufficient.
 */
export interface TargetLadder {
  safe: CollegeRecommendation[];
  target: CollegeRecommendation[];
  reach: CollegeRecommendation[];
  backup: CollegeRecommendation[];
}

/* ------------------------------------------------------------------ */
/* College recommendation                                              */
/* ------------------------------------------------------------------ */

/**
 * A single recommendation with full explanation.
 * Every recommended college/course must explain WHY it appeared.
 */
export interface CollegeRecommendation {
  collegeId: CollegeId;
  collegeName: string;
  courseId: CourseId;
  courseName: string;
  /** Classification. */
  classification: CutoffClassification;
  /** Human-readable explanation of why this was recommended. */
  explanation: string;
  /** The student's score. */
  studentScore: number;
  /** The relevant cutoff value. */
  cutoffValue: number;
  /** Historical range. */
  historicalRange?: { min: number; max: number };
  /** Score gap (positive = above cutoff, negative = below). */
  scoreGap: number;
  /** Authority that manages this admission. */
  authority: string;
  /** Admission pathway. */
  admissionPath: string;
  /** Category. */
  category: string;
  /** Whether eligibility was checked and passed. */
  eligibilityPassed: boolean;
  /** Sources referenced. */
  sources: string[];
  /** College location. */
  city?: string;
  state?: string;
  /** Institution type. */
  institutionType?: string;
}

/* ------------------------------------------------------------------ */
/* Recommendation audit                                                */
/* ------------------------------------------------------------------ */

/**
 * Internally stored audit trail for every recommendation.
 * Makes recommendations explainable and verifiable.
 */
export interface RecommendationAudit {
  /** The recommendation this audit belongs to. */
  recommendationId: string;
  /** College and course. */
  collegeId: CollegeId;
  courseId: CourseId;
  /** Whether eligibility passed. */
  eligibilityPassed: boolean;
  /** Score comparison details. */
  scoreComparison: {
    studentScore: number;
    cutoffValue: number;
    historicalRange?: { min: number; max: number };
    gap: number;
  };
  /** Cutoff data used. */
  cutoffData: {
    year: number;
    round: number | "spot";
    authority: string;
    category: string;
    source?: string;
    sourceUrl?: string;
  };
  /** Final classification. */
  classification: CutoffClassification;
  /** Reasons for this classification. */
  reasons: string[];
  /** Data sources. */
  sources: string[];
  /** When this recommendation was generated. */
  generatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Target gap analyzer                                                 */
/* ------------------------------------------------------------------ */

export interface TargetGap {
  /** College/course being analyzed. */
  collegeName: string;
  courseName: string;
  /** Student's current score. */
  currentScore: number;
  /** Historical target range. */
  targetRange: { min: number; max: number };
  /** Gap to reach the target (positive = need more). */
  gap: number;
  /** Classification. */
  classification: CutoffClassification;
  /** Explanation. */
  explanation: string;
}

/* ------------------------------------------------------------------ */
/* What-if scenario (extended)                                         */
/* ------------------------------------------------------------------ */

export interface WhatIfScenario {
  /** Unique scenario ID. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Profile this scenario is based on. */
  profileId: StudentProfileId;
  /** Modified exam scores. */
  modifiedScores: {
    examType?: ExamType;
    /** New total marks. */
    totalMarks?: number;
    /** New subject-wise marks. */
    subjects?: { name: string; marks: number }[];
  }[];
  /** Recomputed results. */
  recomputedResults: {
    academicPercentage?: number;
    normalizedScore?: number;
    eligibility: boolean;
    targetPosition?: string;
  };
  /** When this scenario was created. */
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Scenario comparison                                                 */
/* ------------------------------------------------------------------ */

export interface ScenarioComparison {
  /** Current state. */
  current: {
    score: number;
    classification?: string;
    compatibleTargets: number;
  };
  /** What-if state. */
  scenario: {
    score: number;
    classification?: string;
    compatibleTargets: number;
  };
  /** Difference summary. */
  difference: {
    scoreDelta: number;
    additionalTargets: number;
    summary: string;
  };
}

/* ------------------------------------------------------------------ */
/* Multi-pathway comparison                                            */
/* ------------------------------------------------------------------ */

export interface PathwayComparison {
  /** Each pathway being compared. */
  pathways: {
    name: string;
    examType?: ExamType;
    eligible: boolean;
    score: number;
    competitiveness: string;
    availableTargets: number;
  }[];
  /** Summary. */
  summary: string;
}

/* ------------------------------------------------------------------ */
/* College comparison (up to 4)                                        */
/* ------------------------------------------------------------------ */

export interface CollegeComparisonItem {
  collegeId: CollegeId;
  collegeName: string;
  courseName: string;
  authority: string;
  cutoffValue: number;
  cutoffType: CutoffType;
  category: string;
  year: number;
  studentScore: number;
  difference: number;
  classification: CutoffClassification;
  source?: string;
}

/* ------------------------------------------------------------------ */
/* Admission readiness                                                 */
/* ------------------------------------------------------------------ */

/**
 * NOT an official admission score.
 * Uses categories: STRONG, MODERATE, NEEDS_ATTENTION.
 */
export type AdmissionReadinessLevel = "STRONG" | "MODERATE" | "NEEDS_ATTENTION";

export interface AdmissionReadiness {
  level: AdmissionReadinessLevel;
  /** Breakdown of readiness factors. */
  factors: {
    eligibilityCompleteness: { score: number; max: number; label: string };
    academicReadiness: { score: number; max: number; label: string };
    entranceReadiness: { score: number; max: number; label: string };
    targetCompetitiveness: { score: number; max: number; label: string };
    profileCompleteness: { score: number; max: number; label: string };
  };
  /** Human-readable summary. */
  summary: string;
}

/* ------------------------------------------------------------------ */
/* Course explorer                                                      */
/* ------------------------------------------------------------------ */

export interface CourseOption {
  /** Discipline code (e.g. "CSE", "ECE"). */
  code: string;
  /** Display name. */
  name: string;
  /** Category. */
  category: "engineering" | "medical" | "other";
  /** Typical admission pathways. */
  pathways: string[];
  /** Brief description. */
  description: string;
}

/* ------------------------------------------------------------------ */
/* Action plan                                                          */
/* ------------------------------------------------------------------ */

export interface ActionPlan {
  /** Ordered list of next steps. */
  actions: ActionItem[];
}

export interface ActionItem {
  /** Action title. */
  title: string;
  /** Human-readable explanation. */
  explanation: string;
  /** Priority. */
  priority: "high" | "medium" | "low";
  /** Category. */
  category: "eligibility" | "academic" | "entrance" | "application" | "profile";
}

/* ------------------------------------------------------------------ */
/* Insufficient data signal                                            */
/* ------------------------------------------------------------------ */

export interface InsufficientData {
  /** What data is missing. */
  missingData: string[];
  /** Human-readable explanation. */
  explanation: string;
  /** Allow student to save manually. */
  allowManualSave: boolean;
}

/* ------------------------------------------------------------------ */
/* Classification constants                                            */
/* ------------------------------------------------------------------ */

export const CLASSIFICATION_LABELS: Record<CutoffClassification, string> = {
  SAFE: "Safe",
  TARGET: "Target",
  REACH: "Reach",
  LOW_PROBABILITY: "Low Probability",
  INELIGIBLE: "Ineligible",
};

export const CLASSIFICATION_COLORS: Record<CutoffClassification, string> = {
  SAFE: "text-emerald-600 dark:text-emerald-400",
  TARGET: "text-sky-600 dark:text-sky-400",
  REACH: "text-amber-600 dark:text-amber-400",
  LOW_PROBABILITY: "text-orange-600 dark:text-orange-400",
  INELIGIBLE: "text-red-600 dark:text-red-400",
};

export const CLASSIFICATION_BG: Record<CutoffClassification, string> = {
  SAFE: "bg-emerald-500/10",
  TARGET: "bg-sky-500/10",
  REACH: "bg-amber-500/10",
  LOW_PROBABILITY: "bg-orange-500/10",
  INELIGIBLE: "bg-red-500/10",
};
