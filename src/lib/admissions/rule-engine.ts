/**
 * Core admission rule engine — deterministic, traceable, versioned.
 *
 * This engine evaluates rules against student profiles and produces
 * fully auditable results. Every result contains:
 *   - inputs
 *   - intermediateValues
 *   - formulaVersion
 *   - finalValue
 *   - ruleSource
 *   - generatedAt
 *
 * RULES:
 *  - No AI/LLM involvement in calculations
 *  - No fabrication of data
 *  - Conflict detection between sources
 *  - Stale rule labeling
 *  - Full provenance on every result
 */

import type {
  StudentProfile,
  AcademicResult,
} from "@/types";
import type {
  AdmissionRule,
  CalculationAudit,
  ConflictStatus,
  DataConflict,
  EligibilityRule,
  RuleStatus,
} from "@/types/rules";

/* ------------------------------------------------------------------ */
/* Result types                                                        */
/* ------------------------------------------------------------------ */

export type EligibilityStatus = "ELIGIBLE" | "NOT_ELIGIBLE" | "REQUIRES_VERIFICATION";

export interface EligibilityResult {
  /** Overall eligibility status. */
  status: EligibilityStatus;
  /** Human-readable reasons for the status. */
  reasons: string[];
  /** Which rules were evaluated. */
  rulesApplied: string[];
  /** Data sources referenced. */
  sources: string[];
  /** Conflicts detected during evaluation. */
  conflicts: DataConflict[];
  /** Calculation audit trail. */
  audit: CalculationAudit;
}

export interface CalculationResult {
  /** The computed value. */
  value: number;
  /** Maximum possible value. */
  maxValue: number;
  /** How the value was calculated. */
  audit: CalculationAudit;
  /** Any conflicts detected. */
  conflicts: DataConflict[];
}

/* ------------------------------------------------------------------ */
/* Utility: current academic year                                      */
/* ------------------------------------------------------------------ */

/** Returns the current academic year string (e.g. "2025-26"). */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${String(year + 1).slice(2)}`;
}

/* ------------------------------------------------------------------ */
/* Stale rule detection                                                */
/* ------------------------------------------------------------------ */

/**
 * Check if a rule is stale (not current year).
 * Labels it HISTORICAL if so.
 */
export function checkRuleFreshness(rule: AdmissionRule): {
  isCurrent: boolean;
  label: string;
} {
  const currentYear = getCurrentAcademicYear();
  const isCurrent = rule.academicYear === currentYear;

  return {
    isCurrent,
    label: isCurrent
      ? `Current rule (${rule.academicYear})`
      : `HISTORICAL RULE — based on ${rule.academicYear} data (not current year ${currentYear})`,
  };
}

/**
 * Check if a rule's verification is recent (within 12 months).
 */
export function checkVerificationFreshness(rule: AdmissionRule): {
  isVerified: boolean;
  label: string;
} {
  if (!rule.verifiedAt) {
    return { isVerified: false, label: "NOT VERIFIED — no verification date recorded" };
  }

  const verifiedDate = new Date(rule.verifiedAt);
  const now = new Date();
  const monthsSinceVerification =
    (now.getFullYear() - verifiedDate.getFullYear()) * 12 +
    (now.getMonth() - verifiedDate.getMonth());

  if (monthsSinceVerification > 12) {
    return {
      isVerified: false,
      label: `STALE VERIFICATION — last verified ${monthsSinceVerification} months ago`,
    };
  }

  return {
    isVerified: true,
    label: `Verified on ${rule.verifiedAt}`,
  };
}

/* ------------------------------------------------------------------ */
/* Conflict detection                                                  */
/* ------------------------------------------------------------------ */

/**
 * Detect conflicts between multiple rules for the same field.
 * Priority order: official-govt > official-exam > official-counseling > institution > secondary
 */
export function detectConflicts(
  rules: AdmissionRule[],
  field: string,
): DataConflict {
  const conflictingValues: DataConflict["conflictingValues"] = [];

  for (const rule of rules) {
    // Check eligibility rules for the field
    for (const er of rule.eligibilityRules) {
      if (er.type === field) {
        conflictingValues.push({
          source: `${rule.authority} (${rule.academicYear} v${rule.version})`,
          value: Array.isArray(er.value) ? er.value.join(", ") : er.value,
          authority: rule.authority,
        });
      }
    }
  }

  if (conflictingValues.length <= 1) {
    return { field, conflictingValues, resolved: true };
  }

  // Check if values are actually different
  const uniqueValues = new Set(conflictingValues.map((v) => JSON.stringify(v.value)));
  if (uniqueValues.size <= 1) {
    return { field, conflictingValues, resolved: true };
  }

  // There's a real conflict
  const authorityPriority: Record<string, number> = {
    "Government of India": 1,
    "NTA": 2,
    "TNEA": 2,
    "JoSAA": 2,
    "CSAB": 2,
    "CBSE": 2,
    "State Government": 2,
    "Counselling Authority": 3,
    "Institution": 4,
    "Secondary Source": 5,
  };

  let bestPriority = Infinity;
  let bestSource = "";
  for (const cv of conflictingValues) {
    const priority = authorityPriority[cv.authority] ?? 5;
    if (priority < bestPriority) {
      bestPriority = priority;
      bestSource = cv.source;
    }
  }

  return {
    field,
    conflictingValues,
    prioritySource: bestSource,
    resolved: false,
  };
}

/* ------------------------------------------------------------------ */
/* Single rule evaluation                                              */
/* ------------------------------------------------------------------ */

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

/**
 * Evaluate a string-based eligibility rule.
 */
export function evaluateStringRule(
  rule: EligibilityRule,
  actualValue: string,
): boolean {
  switch (rule.operator) {
    case "eq":
      return actualValue === (rule.value as string);
    case "in":
      const vals = Array.isArray(rule.value) ? rule.value.map(String) : [String(rule.value)];
      return vals.includes(actualValue);
    default:
      return true;
  }
}

/* ------------------------------------------------------------------ */
/* Rule evaluation engine                                              */
/* ------------------------------------------------------------------ */

/**
 * Evaluate all rules for a given admission path.
 * Returns a fully auditable result with provenance.
 */
export function evaluateRules(
  rules: AdmissionRule[],
  context: {
    authority?: string;
    pathway?: string;
    academicYear?: string;
  },
  getFieldValue: (ruleType: string) => number | string | undefined,
): EligibilityResult {
  const now = new Date().toISOString();
  const reasons: string[] = [];
  const rulesApplied: string[] = [];
  const sources: string[] = [];
  const conflicts: DataConflict[] = [];
  const inputs: Record<string, number | string> = {};
  const intermediateValues: Record<string, number> = {};

  let overallStatus: EligibilityStatus = "ELIGIBLE";

  for (const rule of rules) {
    // Filter by context
    if (context.authority && rule.authority !== context.authority) continue;
    if (context.pathway && rule.pathway !== context.pathway) continue;
    if (context.academicYear && rule.academicYear !== context.academicYear) continue;

    // Check staleness
    const freshness = checkRuleFreshness(rule);
    if (!freshness.isCurrent) {
      reasons.push(freshness.label);
    }

    const verification = checkVerificationFreshness(rule);
    if (!verification.isVerified) {
      reasons.push(verification.label);
    }

    rulesApplied.push(`${rule.authority} ${rule.academicYear} v${rule.version} [${rule.status}]`);
    sources.push(rule.sourceUrl ?? `Rule ${rule.id}`);

    // Evaluate each eligibility rule
    for (const er of rule.eligibilityRules) {
      const fieldValue = getFieldValue(er.type);
      inputs[er.type] = fieldValue ?? "N/A";

      if (fieldValue === undefined) {
        if (er.mandatory) {
          overallStatus = "NOT_ELIGIBLE";
          reasons.push(`Missing required field: ${er.description}`);
        }
        continue;
      }

      let passed: boolean;
      if (typeof fieldValue === "string") {
        passed = evaluateStringRule(er, fieldValue);
      } else {
        passed = evaluateSingleRule(er, fieldValue);
        intermediateValues[er.type] = fieldValue;
      }

      if (!passed) {
        if (er.mandatory) {
          overallStatus = "NOT_ELIGIBLE";
          reasons.push(`FAILED: ${er.description} (got ${fieldValue}, required ${er.operator} ${er.value})`);
        } else {
          reasons.push(`WARNING: ${er.description} (got ${fieldValue})`);
        }
      } else {
        reasons.push(`PASSED: ${er.description}`);
      }
    }
  }

  if (rules.length === 0) {
    overallStatus = "REQUIRES_VERIFICATION";
    reasons.push("No rules available for this authority/pathway/year — VERIFIED DATA NOT AVAILABLE");
  }

  // Check for conflicts
  if (rules.length > 1) {
    const fieldTypes = new Set<string>();
    for (const rule of rules) {
      for (const er of rule.eligibilityRules) {
        fieldTypes.add(er.type);
      }
    }
    for (const fieldType of fieldTypes) {
      const conflict = detectConflicts(rules, fieldType);
      if (!conflict.resolved) {
        conflicts.push(conflict);
        overallStatus = "REQUIRES_VERIFICATION";
        reasons.push(`DATA_CONFLICT on "${fieldType}" — multiple sources disagree`);
      }
    }
  }

  return {
    status: overallStatus,
    reasons,
    rulesApplied,
    sources,
    conflicts,
    audit: {
      inputs,
      intermediateValues,
      formulaVersion: rules.length > 0 ? `${rules[0].authority} ${rules[0].academicYear} v${rules[0].version}` : "none",
      finalValue: overallStatus === "ELIGIBLE" ? 1 : overallStatus === "NOT_ELIGIBLE" ? 0 : -1,
      ruleSource: sources.join(", ") || "No rules available",
      generatedAt: now,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Conflict status summary                                             */
/* ------------------------------------------------------------------ */

/**
 * Determine overall conflict status from a list of conflicts.
 */
export function getConflictStatus(conflicts: DataConflict[]): ConflictStatus {
  if (conflicts.length === 0) return "NO_CONFLICT";
  if (conflicts.some((c) => !c.resolved)) return "DATA_CONFLICT";
  return "NO_CONFLICT";
}
