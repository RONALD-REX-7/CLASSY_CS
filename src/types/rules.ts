/**
 * Rule engine types for CLASSY admission logic.
 *
 * Each rule is:
 *   - Versioned (rules change year-to-year)
 *   - Scoped to an authority (e.g. "JoSAA", "TNEA", "WBJEE")
 *   - Scoped to a pathway (e.g. "general", "home-state", "ews")
 *   - Tagged with a status for data quality transparency
 *   - Traceable to its source document
 *
 * RULE: Never fabricate rules. Every rule should reference a real source.
 */

import type { AdmissionRuleId, DataSourceId, ExamType } from "./foundation";

/* ------------------------------------------------------------------ */
/* Rule status — data quality indicator                                */
/* ------------------------------------------------------------------ */

/**
 * How trustworthy is this rule?
 *
 * - VERIFIED:   Confirmed against official source document
 * - HISTORICAL: Based on past-year patterns, not yet confirmed for current year
 * - ESTIMATED:  Approximate, based on trends
 * - PARTIAL:    Only part of the rule is confirmed
 * - UNAVAILABLE: Source could not be reached
 */
export type RuleStatus =
  | "VERIFIED"
  | "HISTORICAL"
  | "ESTIMATED"
  | "PARTIAL"
  | "UNAVAILABLE";

/* ------------------------------------------------------------------ */
/* Conflict status                                                     */
/* ------------------------------------------------------------------ */

/**
 * When different sources disagree about a data point, we flag it
 * rather than silently selecting one.
 */
export type ConflictStatus =
  | "NO_CONFLICT"
  | "DATA_CONFLICT"
  | "REQUIRES_VERIFICATION";

export interface DataConflict {
  /** What the conflict is about. */
  field: string;
  /** Values from different sources. */
  conflictingValues: { source: string; value: number | string | number[]; authority: string }[];
  /** Which source takes priority (official > official-exam > official-counseling > institution > secondary). */
  prioritySource?: string;
  /** Whether the conflict is resolved. */
  resolved: boolean;
}

/* ------------------------------------------------------------------ */
/* Calculation audit trail                                             */
/* ------------------------------------------------------------------ */

/**
 * Every calculation must preserve full traceability.
 * This allows any result to explain exactly how it was calculated.
 */
export interface CalculationAudit {
  /** What inputs went into the calculation. */
  inputs: Record<string, number | string>;
  /** Intermediate computed values. */
  intermediateValues: Record<string, number>;
  /** Which rule/formula version was used. */
  formulaVersion: string;
  /** The final computed value. */
  finalValue: number;
  /** Rule source reference. */
  ruleSource: string;
  /** ISO timestamp of when this calculation was performed. */
  generatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Rule types                                                          */
/* ------------------------------------------------------------------ */

/** Top-level admission rule container. */
export interface AdmissionRule {
  id: AdmissionRuleId;
  /** Authority that publishes this rule (e.g. "TNEA", "JoSAA", "NTA"). */
  authority: string;
  /** Pathway this rule applies to (e.g. "general", "home-state", "ews"). */
  pathway: string;
  /** Academic year this rule is for (e.g. "2025-26"). */
  academicYear: string;
  /** Rule version for tracking updates within the same year. */
  version: number;
  /** Individual eligibility checks. */
  eligibilityRules: EligibilityRule[];
  /** Score/marks calculation rules. */
  calculationRules: CalculationRule[];
  /** Normalization rules (e.g. percentile to marks conversion). */
  normalizationRules: NormalizationRule[];
  /** Category-specific rules (reservation quotas, relaxation). */
  categoryRules: CategoryRule[];
  /** Subject-specific requirements. */
  subjectRules: SubjectRule[];
  /** Where this data came from (DataSource ID). */
  source: DataSourceId;
  /** Direct URL to the source document (e.g. official gazette). */
  sourceUrl?: string;
  /** When this rule was last verified against the source. */
  verifiedAt?: string;
  /** Current status. */
  status: RuleStatus;
  /** ISO date. */
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Sub-rule types                                                      */
/* ------------------------------------------------------------------ */

/** A single eligibility condition. */
export interface EligibilityRule {
  /** What this rule checks (e.g. "minimum-marks-12th", "age-limit"). */
  type: string;
  /** The condition operator. */
  operator: "gte" | "lte" | "eq" | "in" | "between";
  /** The value(s) to compare against. */
  value: number | number[] | string;
  /** Human-readable description. */
  description: string;
  /** Subject name if this rule is subject-specific. */
  subject?: string;
  /** Whether this is a hard requirement or soft preference. */
  mandatory: boolean;
}

/** A calculation rule (e.g. "TNEA score = M*2.5 + P*1.25 + C*1.25"). */
export interface CalculationRule {
  /** What this calculation produces (e.g. "tnea-score", "composite-rank"). */
  outputField: string;
  /** Weighted components. */
  components: CalculationComponent[];
  /** Formula description for display. */
  formula: string;
  /** Maximum possible score. */
  maxValue?: number;
}

/** One component of a composite score calculation. */
export interface CalculationComponent {
  /** Source subject or exam. */
  source: string;
  /** Weight as a multiplier (e.g. 2.5 for Mathematics in TNEA). */
  weight: number;
  /** How the raw score is normalized before weighting. */
  normalization?: string;
  /** Maximum marks for this component. */
  maxMarks?: number;
}

/** Normalization rule (e.g. percentile → normalized marks). */
export interface NormalizationRule {
  /** Which exam this applies to. */
  examType: ExamType;
  /** Method name (e.g. "NTA-normalization", "linear-mapping"). */
  method: string;
  /** Parameters for the method (method-specific). */
  params: Record<string, number>;
  description: string;
}

/** Category-specific rule (reservation, relaxation, quota). */
export interface CategoryRule {
  /** Category name (e.g. "OBC-NCL", "SC", "ST", "EWS"). */
  category: string;
  /** Marks/rank relaxation, if any. */
  relaxation?: number;
  /** Percentage of seats reserved. */
  seatPercentage?: number;
  /** Additional requirements, if any. */
  additionalRequirements?: string;
}

/** Subject-specific requirement. */
export interface SubjectRule {
  /** Subject name (e.g. "Physics", "Mathematics"). */
  subject: string;
  /** Minimum marks required. */
  minMarks?: number;
  /** Maximum marks for this subject. */
  maxMarks?: number;
  /** Whether this subject is mandatory. */
  mandatory: boolean;
  /** Weight in composite, if applicable. */
  weight?: number;
}

/* ------------------------------------------------------------------ */
/* Generic entrance exam model                                         */
/* ------------------------------------------------------------------ */

/**
 * Extensible entrance exam definition.
 * Future exams should be addable without changing core architecture.
 */
export interface EntranceExamModel {
  /** Unique exam identifier. */
  id: string;
  /** Display name (e.g. "JEE Main", "NEET UG"). */
  name: string;
  /** Authority that conducts this exam. */
  authority: string;
  /** Papers offered (e.g. ["Paper 1", "Paper 2A", "Paper 2B"]). */
  papers: EntranceExamPaper[];
  /** Score scale information. */
  scoreScale: ScoreScale;
  /** Percentile scale information. */
  percentileScale?: PercentileScale;
  /** Eligibility rules for appearing in the exam. */
  eligibilityRules: EligibilityRule[];
  /** Rules for rank calculation from percentile. */
  rankRules?: RankRule[];
  /** Admission pathways this exam feeds into. */
  admissionPaths: AdmissionPath[];
}

export interface EntranceExamPaper {
  id: string;
  name: string;
  /** Subjects in this paper. */
  subjects: string[];
  /** Total marks. */
  totalMarks: number;
  /** Marking scheme (e.g. "+4 / -1"). */
  markingScheme: string;
}

export interface ScoreScale {
  /** Minimum score. */
  min: number;
  /** Maximum score. */
  max: number;
  /** Whether negative marking applies. */
  negativeMarking: boolean;
  /** Negative mark per wrong answer, if applicable. */
  negativeMarkPerWrong?: number;
}

export interface PercentileScale {
  min: number;
  max: number;
  /** How percentile is calculated. */
  formula: string;
}

export interface RankRule {
  /** Percentile threshold. */
  percentileMin: number;
  /** Approximate rank range at this percentile. */
  rankRange: { min: number; max: number };
  description: string;
}

export interface AdmissionPath {
  /** Target institution type. */
  institutionType: string;
  /** Counselling authority. */
  counsellingAuthority: string;
  /** Whether this path requires additional steps beyond the exam. */
  requiresCounselling: boolean;
}
