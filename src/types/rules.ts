/**
 * Rule engine types for CLASSY admission logic.
 *
 * Each rule is:
 *   - Versioned (rules change year-to-year)
 *   - Scoped to an authority (e.g. "JoSAA", "TNEA", "WBJEE")
 *   - Scoped to a pathway (e.g. "general", "home-state", "ews")
 *   - Tagged with a status for data quality transparency
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
/* Rule types                                                          */
/* ------------------------------------------------------------------ */

/** Top-level admission rule container. */
export interface AdmissionRule {
  id: AdmissionRuleId;
  /** Authority that publishes this rule (e.g. "JoSAA", "TNEA", "WBJEE Board"). */
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
  /** Where this data came from. */
  source: DataSourceId;
  /** When this rule was last verified. */
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
  /** What this rule checks (e.g. "minimum-age", "minimum-marks-12th"). */
  type: string;
  /** The condition operator. */
  operator: "gte" | "lte" | "eq" | "in" | "between";
  /** The value(s) to compare against. */
  value: number | number[] | string;
  /** Human-readable description. */
  description: string;
}

/** A calculation rule (e.g. "composite-score = 60% JEE + 40% board"). */
export interface CalculationRule {
  /** What this calculation produces. */
  outputField: string;
  /** Weighted components. */
  components: CalculationComponent[];
  /** Formula description for display. */
  formula: string;
}

/** One component of a composite score calculation. */
export interface CalculationComponent {
  /** Source exam type. */
  examType: ExamType;
  /** Weight as a fraction (0–1). */
  weight: number;
  /** How the raw score is normalized before weighting. */
  normalization?: string;
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
  /** Whether this subject is mandatory. */
  mandatory: boolean;
  /** Weight in composite, if applicable. */
  weight?: number;
}
