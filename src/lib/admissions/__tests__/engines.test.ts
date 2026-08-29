/**
 * Test cases for all admission engines.
 *
 * These are pure-function unit tests that verify:
 *  - TNEA score calculation
 *  - TNEA eligibility
 *  - JEE Main eligibility
 *  - JEE Advanced qualification
 *  - NEET qualification
 *  - Rule versioning
 *  - Conflict detection
 *  - Stale rule detection
 *
 * Run with: npx vitest run src/lib/admissions/__tests__/engines.test.ts
 */

import { describe, it, expect } from "vitest";
import { calculateTneaScore, evaluateTneaEligibility, TNEA_CATEGORIES } from "../tnea/engine";
import { evaluateJeeMainEligibility, checkJeeAdvancedQualification } from "../jee-main/engine";
import { evaluateIitAdmissionEligibility, checkTop20Percentile } from "../jee-advanced/engine";
import { evaluateNeetQualification, assessMedicalCompetitiveness } from "../neet/engine";
import { checkRuleFreshness, checkVerificationFreshness, detectConflicts, getConflictStatus } from "../rule-engine";
import type { SchoolSubject } from "@/types/school";
import type { StudentProfile, AcademicResult } from "@/types";
import type { AdmissionRule } from "@/types/rules";

/* ------------------------------------------------------------------ */
/* Test fixtures                                                       */
/* ------------------------------------------------------------------ */

function createProfile(overrides?: Partial<StudentProfile>): StudentProfile {
  return {
    id: "test-profile" as any,
    name: "Test Student",
    birthYear: 2007,
    category: "General",
    state: "Tamil Nadu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createClass12Result(overrides?: Partial<AcademicResult>): AcademicResult {
  return {
    id: "test-result" as any,
    profileId: "test-profile" as any,
    examType: "board-12th",
    year: 2025,
    marksObtained: 450,
    marksMaximum: 500,
    percentage: 90,
    subjects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createSubjects(overrides?: Partial<SchoolSubject>[]): SchoolSubject[] {
  const defaults: SchoolSubject[] = [
    { id: "1", name: "Mathematics", category: "core", maxMarks: 100, obtainedMarks: 95 },
    { id: "2", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 85 },
    { id: "3", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 80 },
  ];
  if (overrides) {
    return defaults.map((d, i) => ({ ...d, ...(overrides[i] ?? {}) }));
  }
  return defaults;
}

function createRule(overrides?: Partial<AdmissionRule>): AdmissionRule {
  const now = new Date().toISOString();
  return {
    id: "test-rule" as any,
    authority: "TestAuthority",
    pathway: "general",
    academicYear: "2025-26",
    version: 1,
    eligibilityRules: [],
    calculationRules: [],
    normalizationRules: [],
    categoryRules: [],
    subjectRules: [],
    source: "" as any,
    status: "VERIFIED",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/* TNEA tests                                                          */
/* ------------------------------------------------------------------ */

describe("TNEA Engine", () => {
  describe("calculateTneaScore", () => {
    it("calculates score correctly with standard inputs", () => {
      const subjects = createSubjects();
      const result = calculateTneaScore(subjects);

      // Math: 95/100 * 100 = 95
      // Physics: 85/100 * 50 = 42.5
      // Chemistry: 80/100 * 50 = 40
      // Total: 95 + 42.5 + 40 = 177.5
      expect(result.value).toBe(177.5);
      expect(result.maxValue).toBe(200);
      expect(result.audit.finalValue).toBe(177.5);
    });

    it("handles zero marks", () => {
      const subjects: SchoolSubject[] = [
        { id: "1", name: "Mathematics", category: "core", maxMarks: 100, obtainedMarks: 0 },
        { id: "2", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 0 },
        { id: "3", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 0 },
      ];
      const result = calculateTneaScore(subjects);
      expect(result.value).toBe(0);
    });

    it("handles maximum marks", () => {
      const subjects: SchoolSubject[] = [
        { id: "1", name: "Mathematics", category: "core", maxMarks: 100, obtainedMarks: 100 },
        { id: "2", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 100 },
        { id: "3", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 100 },
      ];
      const result = calculateTneaScore(subjects);
      expect(result.value).toBe(200);
    });

    it("clamps marks above maximum", () => {
      const subjects: SchoolSubject[] = [
        { id: "1", name: "Mathematics", category: "core", maxMarks: 100, obtainedMarks: 150 },
        { id: "2", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 120 },
        { id: "3", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 110 },
      ];
      const result = calculateTneaScore(subjects);
      expect(result.value).toBe(200);
    });

    it("handles missing subjects gracefully", () => {
      const subjects: SchoolSubject[] = [
        { id: "1", name: "English", category: "language", maxMarks: 100, obtainedMarks: 90 },
      ];
      const result = calculateTneaScore(subjects);
      expect(result.value).toBe(0);
    });

    it("includes full audit trail", () => {
      const subjects = createSubjects();
      const result = calculateTneaScore(subjects);
      expect(result.audit.inputs).toBeDefined();
      expect(result.audit.intermediateValues).toBeDefined();
      expect(result.audit.formulaVersion).toContain("TNEA");
      expect(result.audit.generatedAt).toBeTruthy();
      expect(result.audit.ruleSource).toBeTruthy();
    });
  });

  describe("evaluateTneaEligibility", () => {
    it("returns ELIGIBLE for valid profile with PCM", () => {
      const profile = createProfile();
      const result = createClass12Result();
      const subjects = createSubjects();
      const eligibility = evaluateTneaEligibility(profile, result, subjects, "OC");
      expect(eligibility.status).toBe("ELIGIBLE");
      expect(eligibility.reasons.length).toBeGreaterThan(0);
      expect(eligibility.audit).toBeDefined();
    });

    it("returns NOT_ELIGIBLE without Class 12 result", () => {
      const profile = createProfile();
      const subjects = createSubjects();
      const eligibility = evaluateTneaEligibility(profile, undefined, subjects, "OC");
      expect(eligibility.status).toBe("NOT_ELIGIBLE");
    });

    it("applies category rules", () => {
      const profile = createProfile({ category: "BC" });
      const result = createClass12Result();
      const subjects = createSubjects();
      const eligibility = evaluateTneaEligibility(profile, result, subjects, "BC");
      expect(eligibility.rulesApplied.some((r) => r.includes("BC"))).toBe(true);
    });
  });
});

/* ------------------------------------------------------------------ */
/* JEE Main tests                                                      */
/* ------------------------------------------------------------------ */

describe("JEE Main Engine", () => {
  describe("evaluateJeeMainEligibility", () => {
    it("returns ELIGIBLE for valid profile", () => {
      const profile = createProfile();
      const result = createClass12Result();
      const eligibility = evaluateJeeMainEligibility(profile, result);
      expect(eligibility.status).toBe("ELIGIBLE");
    });

    it("returns NOT_ELIGIBLE without Class 12", () => {
      const profile = createProfile();
      const eligibility = evaluateJeeMainEligibility(profile, undefined);
      expect(eligibility.status).toBe("NOT_ELIGIBLE");
    });
  });

  describe("checkJeeAdvancedQualification", () => {
    it("returns qualified for high percentile", () => {
      const jeeResult = {
        paper: "paper-1" as const,
        session: 1 as const,
        year: 2025,
        subjects: [],
        totalMarks: 280,
        ntaPercentile: 99.5,
        category: "General",
      };
      const qualification = checkJeeAdvancedQualification(jeeResult);
      expect(qualification.qualified).toBe(true);
      expect(qualification.qualificationType).toBe("top-percentile");
    });

    it("returns not-qualified for low percentile", () => {
      const jeeResult = {
        paper: "paper-1" as const,
        session: 1 as const,
        year: 2025,
        subjects: [],
        totalMarks: 120,
        ntaPercentile: 70,
        category: "General",
      };
      const qualification = checkJeeAdvancedQualification(jeeResult);
      expect(qualification.qualified).toBe(false);
    });

    it("returns not-qualified when percentile is missing", () => {
      const jeeResult = {
        paper: "paper-1" as const,
        session: 1 as const,
        year: 2025,
        subjects: [],
        totalMarks: 200,
        category: "General",
      };
      const qualification = checkJeeAdvancedQualification(jeeResult);
      expect(qualification.qualified).toBe(false);
      expect(qualification.reason).toContain("VERIFIED DATA NOT AVAILABLE");
    });
  });
});

/* ------------------------------------------------------------------ */
/* JEE Advanced tests                                                  */
/* ------------------------------------------------------------------ */

describe("JEE Advanced Engine", () => {
  describe("evaluateIitAdmissionEligibility", () => {
    it("returns ELIGIBLE when all criteria met", () => {
      const profile = createProfile();
      const result = createClass12Result({ percentage: 85 });
      const subjects = createSubjects();
      const eligibility = evaluateIitAdmissionEligibility(profile, result, subjects, true);
      expect(eligibility.status).toBe("ELIGIBLE");
    });

    it("returns NOT_ELIGIBLE when 75% not met", () => {
      const profile = createProfile();
      const result = createClass12Result({ percentage: 70 });
      const subjects = createSubjects();
      const eligibility = evaluateIitAdmissionEligibility(profile, result, subjects, true);
      expect(eligibility.status).toBe("NOT_ELIGIBLE");
    });

    it("returns NOT_ELIGIBLE when JEE Advanced not qualified", () => {
      const profile = createProfile();
      const result = createClass12Result({ percentage: 85 });
      const subjects = createSubjects();
      const eligibility = evaluateIitAdmissionEligibility(profile, result, subjects, false);
      expect(eligibility.status).toBe("NOT_ELIGIBLE");
    });
  });

  describe("checkTop20Percentile", () => {
    it("returns VERIFIED_DATA_NOT_AVAILABLE for unknown board", () => {
      const result = checkTop20Percentile(85, "tn-state", "2025-26");
      expect(result.status).toBe("VERIFIED_DATA_NOT_AVAILABLE");
    });
  });
});

/* ------------------------------------------------------------------ */
/* NEET tests                                                          */
/* ------------------------------------------------------------------ */

describe("NEET Engine", () => {
  describe("evaluateNeetQualification", () => {
    it("returns ELIGIBLE for valid PCB student", () => {
      const profile = createProfile();
      const result = createClass12Result();
      const subjects: SchoolSubject[] = [
        { id: "1", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 85 },
        { id: "2", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 80 },
        { id: "3", name: "Biology", category: "core", maxMarks: 100, obtainedMarks: 90 },
      ];
      const neetResult = {
        totalMarks: 600,
        category: "General",
        subjects: [],
        year: 2025,
      };
      const eligibility = evaluateNeetQualification(profile, result, subjects, neetResult);
      expect(eligibility.status).toBe("ELIGIBLE");
    });

    it("returns NOT_ELIGIBLE without Biology", () => {
      const profile = createProfile();
      const result = createClass12Result();
      const subjects: SchoolSubject[] = [
        { id: "1", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: 85 },
        { id: "2", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: 80 },
      ];
      const neetResult = {
        totalMarks: 500,
        category: "General",
        subjects: [],
        year: 2025,
      };
      const eligibility = evaluateNeetQualification(profile, result, subjects, neetResult);
      expect(eligibility.status).toBe("NOT_ELIGIBLE");
    });
  });

  describe("assessMedicalCompetitiveness", () => {
    it("returns high competitiveness for top percentile", () => {
      const neetResult = {
        totalMarks: 680,
        ntaPercentile: 99.9,
        category: "General",
        subjects: [],
        year: 2025,
      };
      const assessment = assessMedicalCompetitiveness(neetResult);
      expect(assessment.competitiveness).toBe("high");
      expect(assessment.disclaimer).toContain("does NOT guarantee");
    });

    it("returns insufficient-data when percentile missing", () => {
      const neetResult = {
        totalMarks: 600,
        category: "General",
        subjects: [],
        year: 2025,
      };
      const assessment = assessMedicalCompetitiveness(neetResult);
      expect(assessment.competitiveness).toBe("insufficient-data");
    });
  });
});

/* ------------------------------------------------------------------ */
/* Rule versioning tests                                               */
/* ------------------------------------------------------------------ */

describe("Rule Versioning", () => {
  describe("checkRuleFreshness", () => {
    it("identifies current-year rules", () => {
      const rule = createRule({ academicYear: "2025-26" });
      const freshness = checkRuleFreshness(rule);
      expect(freshness.isCurrent).toBe(true);
    });

    it("identifies historical rules", () => {
      const rule = createRule({ academicYear: "2020-21" });
      const freshness = checkRuleFreshness(rule);
      expect(freshness.isCurrent).toBe(false);
      expect(freshness.label).toContain("HISTORICAL RULE");
    });
  });

  describe("checkVerificationFreshness", () => {
    it("identifies recently verified rules", () => {
      const rule = createRule({ verifiedAt: new Date().toISOString() });
      const freshness = checkVerificationFreshness(rule);
      expect(freshness.isVerified).toBe(true);
    });

    it("identifies unverified rules", () => {
      const rule = createRule({ verifiedAt: undefined });
      const freshness = checkVerificationFreshness(rule);
      expect(freshness.isVerified).toBe(false);
      expect(freshness.label).toContain("NOT VERIFIED");
    });
  });
});

/* ------------------------------------------------------------------ */
/* Conflict detection tests                                            */
/* ------------------------------------------------------------------ */

describe("Conflict Detection", () => {
  it("detects conflicts between rules with different values", () => {
    const rule1 = createRule({
      authority: "Authority A",
      eligibilityRules: [
        { type: "min-marks", operator: "gte", value: 60, description: "Test", mandatory: true },
      ],
    });
    const rule2 = createRule({
      authority: "Authority B",
      eligibilityRules: [
        { type: "min-marks", operator: "gte", value: 75, description: "Test", mandatory: true },
      ],
    });
    const conflict = detectConflicts([rule1, rule2], "min-marks");
    expect(conflict.resolved).toBe(false);
    expect(conflict.conflictingValues.length).toBe(2);
  });

  it("returns no conflict for identical values", () => {
    const rule1 = createRule({
      authority: "Authority A",
      eligibilityRules: [
        { type: "min-marks", operator: "gte", value: 60, description: "Test", mandatory: true },
      ],
    });
    const rule2 = createRule({
      authority: "Authority B",
      eligibilityRules: [
        { type: "min-marks", operator: "gte", value: 60, description: "Test", mandatory: true },
      ],
    });
    const conflict = detectConflicts([rule1, rule2], "min-marks");
    expect(conflict.resolved).toBe(true);
  });

  it("returns no conflict for single rule", () => {
    const rule = createRule({
      authority: "Authority A",
      eligibilityRules: [
        { type: "min-marks", operator: "gte", value: 60, description: "Test", mandatory: true },
      ],
    });
    const conflict = detectConflicts([rule], "min-marks");
    expect(conflict.resolved).toBe(true);
  });

  describe("getConflictStatus", () => {
    it("returns NO_CONFLICT for empty list", () => {
      expect(getConflictStatus([])).toBe("NO_CONFLICT");
    });

    it("returns DATA_CONFLICT for unresolved conflicts", () => {
      expect(getConflictStatus([{ field: "x", conflictingValues: [], resolved: false }])).toBe("DATA_CONFLICT");
    });
  });
});
