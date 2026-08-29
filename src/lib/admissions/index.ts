/**
 * Admissions module — barrel export.
 *
 * All engines are deterministic, versioned, and fully auditable.
 */

// Core rule engine
export {
  evaluateRules,
  evaluateSingleRule,
  evaluateStringRule,
  getCurrentAcademicYear,
  checkRuleFreshness,
  checkVerificationFreshness,
  detectConflicts,
  getConflictStatus,
  type EligibilityResult,
  type EligibilityStatus,
  type CalculationResult,
} from "./rule-engine";

// TNEA
export {
  calculateTneaScore,
  evaluateTneaEligibility,
  explainTneaResult,
  TNEA_AUTHORITY,
  TNEA_MAX_SCORE,
  TNEA_CATEGORIES,
  type TNEACategory,
} from "./tnea/engine";

// JEE Main
export {
  evaluateJeeMainEligibility,
  checkJeeAdvancedQualification,
  JEE_MAIN_AUTHORITY,
  JEE_MAIN_PAPERS,
  JEE_MAIN_MODEL,
  type JEEMainResult,
  type JEEMainPaper,
} from "./jee-main/engine";

// JEE Advanced
export {
  evaluateIitAdmissionEligibility,
  checkTop20Percentile,
  JEE_ADV_AUTHORITY,
  JEE_ADV_MODEL,
} from "./jee-advanced/engine";

// NEET UG
export {
  evaluateNeetQualification,
  assessMedicalCompetitiveness,
  NEET_AUTHORITY,
  NEET_MODEL,
  type NEETResult,
} from "./neet/engine";

// Generic
export {
  checkEligibility,
  createFieldValueResolver,
} from "./generic/eligibility";
