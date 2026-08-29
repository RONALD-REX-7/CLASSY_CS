/**
 * Cutoff classification engine — deterministic, explainable.
 *
 * Classifies a student's score against historical cutoff data.
 * NEVER uses "Guaranteed", "100% Admission", "Confirmed Seat".
 *
 * Classification logic (for rank-based exams — lower rank = better):
 *  - Student rank <= safest historical cutoff → SAFE
 *  - Student rank within historical range → TARGET
 *  - Student rank slightly above historical range → REACH
 *  - Student rank significantly above → LOW_PROBABILITY
 *  - Student ineligible → INELIGIBLE
 *
 * For marks-based exams (higher marks = better), thresholds are inverted.
 */

import type {
  CutoffClassification,
  CutoffExtended,
  CutoffType,
  ClassificationResult,
} from "@/types/college";

/* ------------------------------------------------------------------ */
/* Classification thresholds                                           */
/* ------------------------------------------------------------------ */

/**
 * Thresholds for rank-based classification.
 * These represent percentage margins around the historical range.
 */
const RANK_THRESHOLDS = {
  /** Within 5% of the safest historical cutoff → SAFE */
  safeMargin: 0.05,
  /** Within 15% above the target range → TARGET */
  targetMargin: 0.15,
  /** Within 30% above → REACH */
  reachMargin: 0.30,
  /** Beyond 30% → LOW_PROBABILITY */
};

/**
 * Thresholds for marks-based classification.
 */
const MARKS_THRESHOLDS = {
  /** Within 5% above the safest cutoff → SAFE */
  safeMargin: 0.05,
  /** Within 10% below the target range → TARGET */
  targetMargin: 0.10,
  /** Within 20% below → REACH */
  reachMargin: 0.20,
};

/* ------------------------------------------------------------------ */
/* Historical range computation                                        */
/* ------------------------------------------------------------------ */

/**
 * Compute historical range from multiple years of cutoff data.
 * Returns the min and max cutoff values across all years.
 */
export function computeHistoricalRange(
  cutoffs: CutoffExtended[],
): { min: number; max: number } | undefined {
  if (cutoffs.length === 0) return undefined;

  const values = cutoffs.map((c) => c.cutoffValue);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/* ------------------------------------------------------------------ */
/* Classification (rank-based)                                         */
/* ------------------------------------------------------------------ */

/**
 * Classify a student's rank against rank-based cutoffs.
 * Lower rank = better (e.g. rank 1 is best).
 */
export function classifyRankBased(
  studentRank: number,
  historicalCutoffs: CutoffExtended[],
): ClassificationResult {
  const range = computeHistoricalRange(historicalCutoffs);

  if (!range) {
    return {
      classification: "INELIGIBLE",
      explanation: "No historical cutoff data available for comparison.",
      studentScore: studentRank,
      cutoffValue: 0,
      eligibilityPassed: false,
    };
  }

  // For rank-based: student rank <= range.min means they're above the safest cutoff
  // student rank <= range.max means they're within the target range
  const safestCutoff = range.min; // Best (lowest) closing rank
  const targetCutoff = range.max; // Worst (highest) closing rank

  let classification: CutoffClassification;
  let explanation: string;

  if (studentRank <= safestCutoff) {
    classification = "SAFE";
    explanation = `Your rank ${studentRank} is within the historical safe range (${safestCutoff}–${targetCutoff}). Based on past data, this is a strong position.`;
  } else if (studentRank <= targetCutoff) {
    classification = "TARGET";
    explanation = `Your rank ${studentRank} falls within the historical target range (${safestCutoff}–${targetCutoff}). This is competitive but not guaranteed.`;
  } else if (studentRank <= targetCutoff * (1 + RANK_THRESHOLDS.targetMargin)) {
    classification = "REACH";
    explanation = `Your rank ${studentRank} is above the historical target range (max ${targetCutoff}). Admission is possible but depends on seat availability and competition.`;
  } else if (studentRank <= targetCutoff * (1 + RANK_THRESHOLDS.reachMargin)) {
    classification = "LOW_PROBABILITY";
    explanation = `Your rank ${historicalCutoffs[0]?.cutoffValue ?? 0} is significantly above the historical range (max ${targetCutoff}). Admission is unlikely based on past data.`;
  } else {
    classification = "INELIGIBLE";
    explanation = `Your rank ${studentRank} is well outside the historical range for this course.`;
  }

  return {
    classification,
    explanation,
    studentScore: studentRank,
    cutoffValue: targetCutoff,
    historicalRange: range,
    eligibilityPassed: true,
  };
}

/* ------------------------------------------------------------------ */
/* Classification (marks-based)                                        */
/* ------------------------------------------------------------------ */

/**
 * Classify a student's marks against marks-based cutoffs.
 * Higher marks = better.
 */
export function classifyMarksBased(
  studentMarks: number,
  historicalCutoffs: CutoffExtended[],
): ClassificationResult {
  const range = computeHistoricalRange(historicalCutoffs);

  if (!range) {
    return {
      classification: "INELIGIBLE",
      explanation: "No historical cutoff data available for comparison.",
      studentScore: studentMarks,
      cutoffValue: 0,
      eligibilityPassed: false,
    };
  }

  const safestCutoff = range.min; // Lowest acceptable marks
  const targetCutoff = range.max; // Highest historical closing marks

  let classification: CutoffClassification;
  let explanation: string;

  if (studentMarks >= targetCutoff) {
    classification = "SAFE";
    explanation = `Your marks ${studentMarks} exceed the historical maximum (${targetCutoff}). Based on past data, this is a strong position.`;
  } else if (studentMarks >= safestCutoff) {
    classification = "TARGET";
    explanation = `Your marks ${studentMarks} fall within the historical range (${safestCutoff}–${targetCutoff}). This is competitive but not guaranteed.`;
  } else if (studentMarks >= safestCutoff * (1 - MARKS_THRESHOLDS.targetMargin)) {
    classification = "REACH";
    explanation = `Your marks ${studentMarks} are below the historical minimum (${safestCutoff}). Admission is possible but depends on seat availability.`;
  } else if (studentMarks >= safestCutoff * (1 - MARKS_THRESHOLDS.reachMargin)) {
    classification = "LOW_PROBABILITY";
    explanation = `Your marks ${studentMarks} are significantly below the historical range (min ${safestCutoff}). Admission is unlikely based on past data.`;
  } else {
    classification = "INELIGIBLE";
    explanation = `Your marks ${studentMarks} are well outside the historical range for this course.`;
  }

  return {
    classification,
    explanation,
    studentScore: studentMarks,
    cutoffValue: safestCutoff,
    historicalRange: range,
    eligibilityPassed: true,
  };
}

/* ------------------------------------------------------------------ */
/* Generic classification dispatcher                                   */
/* ------------------------------------------------------------------ */

/**
 * Classify based on cutoff type.
 */
export function classify(
  studentScore: number,
  cutoffType: CutoffType,
  historicalCutoffs: CutoffExtended[],
): ClassificationResult {
  if (cutoffType === "closing-rank" || cutoffType === "opening-rank") {
    return classifyRankBased(studentScore, historicalCutoffs);
  }
  // marks or percentile based
  return classifyMarksBased(studentScore, historicalCutoffs);
}

/* ------------------------------------------------------------------ */
/* Score gap calculation                                               */
/* ------------------------------------------------------------------ */

/**
 * Calculate the gap between student score and target range.
 * Positive gap = student needs to improve.
 * Negative gap = student is above the target.
 */
export function calculateScoreGap(
  studentScore: number,
  targetRange: { min: number; max: number },
  cutoffType: CutoffType,
): { gap: number; description: string } {
  if (cutoffType === "closing-rank" || cutoffType === "opening-rank") {
    // Rank-based: lower is better
    // Gap = how much the student needs to improve (lower their rank)
    const gap = studentScore - targetRange.max; // positive = need to improve
    if (gap <= 0) {
      return { gap, description: `Your rank is already within or above the target range.` };
    }
    return {
      gap,
      description: `You need to improve your rank by approximately ${gap} positions to reach the target range.`,
    };
  }

  // Marks-based: higher is better
  const gap = targetRange.min - studentScore; // positive = need to improve
  if (gap <= 0) {
    return { gap, description: `Your marks already meet or exceed the target range.` };
  }
  return {
    gap,
    description: `You need approximately ${gap} more marks to reach the target range.`,
  };
}
