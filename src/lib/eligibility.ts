/**
 * Eligibility engine — pure functions for evaluating admission rules.
 *
 * This sits between the rule data and any future UI. It is intentionally
 * UI-free, testable, and deterministic.
 *
 * Current state: skeleton implementation. Real logic will be added when
 * actual rules are loaded. The function signatures are the contract that
 * the admission recommendation UI will consume.
 */

import type {
  AcademicResult,
  CollegeId,
  CourseId,
  ScenarioId,
  StudentProfile,
} from "@/types";
import type { AdmissionRule, EligibilityRule } from "@/types/rules";

/* ------------------------------------------------------------------ */
/* Eligibility evaluation                                              */
/* ------------------------------------------------------------------ */

export interface EligibilityResult {
  /** Is the student eligible? */
  eligible: boolean;
  /** Which rules were checked. */
  evaluatedRules: number;
  /** Which rules failed (if any). */
  failures: RuleFailure[];
}

export interface RuleFailure {
  ruleType: string;
  description: string;
  actualValue: number | string;
  requiredValue: number | number[] | string;
}

/**
 * Check whether a student profile + results meet all eligibility rules
 * for a given authority + pathway.
 *
 * This is a skeleton — it returns "eligible" until real rules are loaded.
 * The signature is stable and will not change.
 */
export function evaluateEligibility(
  _profile: StudentProfile,
  _results: AcademicResult[],
  _rules: AdmissionRule[],
  _options?: {
    authority?: string;
    pathway?: string;
    academicYear?: string;
  },
): EligibilityResult {
  if (!_rules.length) {
    return { eligible: true, evaluatedRules: 0, failures: [] };
  }

  // TODO: Implement real rule evaluation when rules are loaded.
  // For now, all students are eligible if no rules are defined.
  return { eligible: true, evaluatedRules: _rules.length, failures: [] };
}

/**
 * Evaluate a single eligibility rule against a numeric value.
 * Pure utility — no side effects.
 */
export function evaluateSingleRule(
  rule: EligibilityRule,
  actualValue: number,
): boolean {
  switch (rule.operator) {
    case "gte":
      return actualValue >= (rule.value as number);
    case "lte":
      return actualValue <= (rule.value as number);
    case "eq":
      return actualValue === (rule.value as number);
    case "in":
      return (rule.value as number[]).includes(actualValue);
    case "between": {
      const [min, max] = rule.value as [number, number];
      return actualValue >= min && actualValue <= max;
    }
    default:
      return true;
  }
}
