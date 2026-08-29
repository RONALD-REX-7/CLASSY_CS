/**
 * Academic calculation engine — pure functions, no UI concerns.
 *
 * Accepts: class level, board, stream, subjects with marks
 * Produces: totals, percentages, performance analysis, insights
 *
 * RULES:
 *  - No side effects
 *  - No React dependencies
 *  - Deterministic (same input → same output)
 *  - Handles edge cases (zero subjects, invalid marks, max = 0)
 *  - Never silently converts invalid values
 */

import type {
  AcademicLevel,
  AcademicPerformance,
  LevelBand,
  SchoolSubject,
  SubjectPerformance,
} from "@/types/school";
import { ACADEMIC_LEVELS } from "@/types/school";

/* ------------------------------------------------------------------ */
/* Subject performance                                                 */
/* ------------------------------------------------------------------ */

/**
 * Calculate performance for a single subject.
 * Handles both flat (single maxMarks) and split (theory + practical + internal) marks.
 */
export function calculateSubjectPerformance(subject: SchoolSubject): SubjectPerformance {
  const maxMarks = Math.max(0, subject.maxMarks);
  const obtained = Math.max(0, Math.min(subject.obtainedMarks, maxMarks));
  const percentage = maxMarks > 0 ? (obtained / maxMarks) * 100 : 0;

  let theoryPercentage: number | undefined;
  let practicalPercentage: number | undefined;
  let internalPercentage: number | undefined;

  // Calculate split percentages if marks are provided and max is available
  if (subject.theoryMarks !== undefined && subject.practicalMarks !== undefined && maxMarks > 0) {
    theoryPercentage = (subject.theoryMarks / maxMarks) * 100;
    practicalPercentage = (subject.practicalMarks / maxMarks) * 100;
    if (subject.internalMarks !== undefined) {
      internalPercentage = (subject.internalMarks / maxMarks) * 100;
    }
  }

  return {
    subjectName: subject.name,
    obtainedMarks: obtained,
    maxMarks,
    percentage: Math.round(percentage * 100) / 100,
    theoryPercentage: theoryPercentage !== undefined ? Math.round(theoryPercentage * 100) / 100 : undefined,
    practicalPercentage: practicalPercentage !== undefined ? Math.round(practicalPercentage * 100) / 100 : undefined,
    internalPercentage: internalPercentage !== undefined ? Math.round(internalPercentage * 100) / 100 : undefined,
    level: getAcademicLevel(percentage),
  };
}

/* ------------------------------------------------------------------ */
/* Overall performance                                                 */
/* ------------------------------------------------------------------ */

/**
 * Calculate complete academic performance from a list of subjects.
 * This is the primary entry point for the calculation engine.
 */
export function calculateAcademicPerformance(subjects: SchoolSubject[]): AcademicPerformance | null {
  if (subjects.length === 0) return null;

  const subjectPerformances = subjects.map(calculateSubjectPerformance);

  let totalObtained = 0;
  let totalMaximum = 0;

  for (const sp of subjectPerformances) {
    totalObtained += sp.obtainedMarks;
    totalMaximum += sp.maxMarks;
  }

  const percentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
  const averagePercentage = subjectPerformances.length > 0
    ? subjectPerformances.reduce((sum, sp) => sum + sp.percentage, 0) / subjectPerformances.length
    : 0;

  // Find strongest and weakest
  let strongest = subjectPerformances[0];
  let weakest = subjectPerformances[0];

  for (const sp of subjectPerformances) {
    if (sp.percentage > (strongest?.percentage ?? 0)) strongest = sp;
    if (sp.percentage < (weakest?.percentage ?? 0)) weakest = sp;
  }

  const subjectsBelowPass = subjectPerformances.filter((sp) => sp.percentage < 50).length;

  return {
    totalObtained,
    totalMaximum,
    percentage: Math.round(percentage * 100) / 100,
    subjectPerformances,
    averagePercentage: Math.round(averagePercentage * 100) / 100,
    strongestSubject: strongest?.subjectName ?? "—",
    weakestSubject: weakest?.subjectName ?? "—",
    academicLevel: getAcademicLevel(percentage),
    subjectsBelowPass,
  };
}

/* ------------------------------------------------------------------ */
/* Academic level classification                                      */
/* ------------------------------------------------------------------ */

/**
 * Map a percentage to an academic level band.
 * Uses the ACADEMIC_LEVELS bands defined in types/school.ts.
 */
export function getAcademicLevel(percentage: number): AcademicLevel {
  for (const band of ACADEMIC_LEVELS) {
    if (percentage >= band.minPercentage) {
      return band.level;
    }
  }
  return "needs-improvement";
}

/** Get the LevelBand metadata for a given level. */
export function getLevelBand(level: AcademicLevel): LevelBand {
  return ACADEMIC_LEVELS.find((b) => b.level === level) ?? ACADEMIC_LEVELS[ACADEMIC_LEVELS.length - 1];
}

/* ------------------------------------------------------------------ */
/* Utility formatting                                                  */
/* ------------------------------------------------------------------ */

/** Format percentage with appropriate precision. */
export function formatPercentage(value: number): string {
  if (value === 0) return "—";
  return value % 1 === 0 ? `${value}` : value.toFixed(2);
}

/** Format marks fraction (e.g. "450 / 500"). */
export function formatMarks(obtained: number, maximum: number): string {
  return `${obtained} / ${maximum}`;
}
