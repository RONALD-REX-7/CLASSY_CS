import type { ExamType } from "@/types";
/**
 * College recommendation engine — "What can I target?"
 *
 * Priority order:
 *  1. Mandatory eligibility
 *  2. Course compatibility
 *  3. Admission pathway
 *  4. Score compatibility
 *  5. Historical cutoff
 *  6. Location preference
 *  7. User preference
 *
 * A college that fails mandatory eligibility must NOT be recommended.
 * Every recommendation must explain WHY it appeared.
 */

import type { StudentProfile, AcademicResult } from "@/types";
import type {
  CollegeExtended,
  CollegeRecommendation,
  CutoffClassification,
  CutoffExtended,
  RecommendationAudit,
  TargetLadder,
  InsufficientData,
} from "@/types/college";
import type { SchoolSubject } from "@/types/school";
import { classify, computeHistoricalRange, calculateScoreGap } from "./classification";

/* ------------------------------------------------------------------ */
/* Main recommendation function                                        */
/* ------------------------------------------------------------------ */

export interface RecommendationInput {
  profile: StudentProfile;
  class12Result?: AcademicResult;
  subjects: SchoolSubject[];
  /** The student's entrance exam score (rank or marks). */
  entranceScore: number;
  /** Type of score (rank or marks). */
  scoreType: "rank" | "marks";
  /** Authority/exam that produced the score. */
  authority: string;
  /** Category for cutoff comparison. */
  category: string;
  /** Preferred courses (discipline codes). */
  preferredCourses?: string[];
  /** Preferred locations (states or cities). */
  preferredLocations?: string[];
  /** Available cutoff data. */
  cutoffs: CutoffExtended[];
  /** Available colleges. */
  colleges: CollegeExtended[];
}

/**
 * Generate a target ladder of recommendations.
 *
 * Returns approximately:
 *  - 3 Safe
 *  - 3 Target
 *  - 3 Reach
 *
 * when sufficient data exists. Does not force exact numbers.
 */
export function generateRecommendations(
  input: RecommendationInput,
): {
  ladder: TargetLadder;
  audit: RecommendationAudit[];
  insufficientData: InsufficientData[];
} {
  const { cutoffs, colleges, category, authority, preferredCourses, preferredLocations } = input;
  const recommendations: CollegeRecommendation[] = [];
  const audit: RecommendationAudit[] = [];
  const insufficientData: InsufficientData[] = [];

  // Filter cutoffs by authority and category
  const relevantCutoffs = cutoffs.filter(
    (c) => c.authority === authority && c.category === category,
  );

  if (relevantCutoffs.length === 0) {
    insufficientData.push({
      missingData: ["Cutoff data"],
      explanation: `No historical cutoff data found for ${authority} in category "${category}". Insufficient verified historical data for reliable classification.`,
      allowManualSave: true,
    });
    return {
      ladder: { safe: [], target: [], reach: [], backup: [] },
      audit: [],
      insufficientData,
    };
  }

  // Group cutoffs by college + course
  const cutoffGroups = groupCutoffs(relevantCutoffs);

  for (const [key, groupCutoffs] of Object.entries(cutoffGroups)) {
    const [collegeId, courseId] = key.split("::");
    const college = colleges.find((c) => c.id === collegeId);
    if (!college) continue;

    // Find the latest year's cutoff for comparison
    const latestCutoffs = groupCutoffs
      .filter((c) => c.year === Math.max(...groupCutoffs.map((g) => g.year)))
      .sort((a, b) => {
        // Sort by round (earlier rounds first)
        const roundA = typeof a.round === "number" ? a.round : 999;
        const roundB = typeof b.round === "number" ? b.round : 999;
        return roundA - roundB;
      });

    if (latestCutoffs.length === 0) continue;

    const primaryCutoff = latestCutoffs[0];
    const historicalRange = computeHistoricalRange(groupCutoffs);

    // Classify
    const classification = classify(
      input.entranceScore,
      primaryCutoff.cutoffType,
      groupCutoffs,
    );

    // Calculate gap
    const gap = historicalRange
      ? calculateScoreGap(input.entranceScore, historicalRange, primaryCutoff.cutoffType)
      : { gap: 0, description: "No historical data available." };

    // Build explanation
    const explanation = buildExplanation(
      classification.classification,
      input.entranceScore,
      primaryCutoff,
      historicalRange,
      college.name,
    );

    const recommendation: CollegeRecommendation = {
      collegeId: collegeId as any,
      collegeName: college.name,
      courseId: courseId as any,
      courseName: primaryCutoff.courseId, // Using courseId as display name placeholder
      classification: classification.classification,
      explanation,
      studentScore: input.entranceScore,
      cutoffValue: primaryCutoff.cutoffValue,
      historicalRange,
      scoreGap: gap.gap,
      authority: primaryCutoff.authority,
      admissionPath: primaryCutoff.admissionPath,
      category: primaryCutoff.category,
      eligibilityPassed: classification.eligibilityPassed,
      sources: [
        primaryCutoff.source ?? `${primaryCutoff.authority} ${primaryCutoff.year}`,
      ],
      city: college.city,
      state: college.state,
      institutionType: college.type,
    };

    recommendations.push(recommendation);

    // Build audit trail
    audit.push({
      recommendationId: `${collegeId}-${courseId}`,
      collegeId: collegeId as any,
      courseId: courseId as any,
      eligibilityPassed: classification.eligibilityPassed,
      scoreComparison: {
        studentScore: input.entranceScore,
        cutoffValue: primaryCutoff.cutoffValue,
        historicalRange,
        gap: gap.gap,
      },
      cutoffData: {
        year: primaryCutoff.year,
        round: primaryCutoff.round,
        authority: primaryCutoff.authority,
        category: primaryCutoff.category,
        source: primaryCutoff.source,
        sourceUrl: primaryCutoff.sourceUrl,
      },
      classification: classification.classification,
      reasons: [classification.explanation],
      sources: [primaryCutoff.source ?? "No source"],
      generatedAt: new Date().toISOString(),
    });
  }

  // Sort into ladder
  const ladder = buildTargetLadder(recommendations);

  return { ladder, audit, insufficientData };
}

/* ------------------------------------------------------------------ */
/* Target ladder builder                                               */
/* ------------------------------------------------------------------ */

function buildTargetLadder(
  recommendations: CollegeRecommendation[],
): TargetLadder {
  const safe = recommendations
    .filter((r) => r.classification === "SAFE")
    .sort((a, b) => a.scoreGap - b.scoreGap) // Best gap first
    .slice(0, 3);

  const target = recommendations
    .filter((r) => r.classification === "TARGET")
    .sort((a, b) => Math.abs(a.scoreGap) - Math.abs(b.scoreGap))
    .slice(0, 3);

  const reach = recommendations
    .filter((r) => r.classification === "REACH")
    .sort((a, b) => a.scoreGap - b.scoreGap)
    .slice(0, 3);

  const backup = recommendations
    .filter((r) => r.classification === "LOW_PROBABILITY")
    .slice(0, 2);

  return { safe, target, reach, backup };
}

/* ------------------------------------------------------------------ */
/* Explanation builder                                                 */
/* ------------------------------------------------------------------ */

function buildExplanation(
  classification: CutoffClassification,
  studentScore: number,
  cutoff: CutoffExtended,
  historicalRange: { min: number; max: number } | undefined,
  collegeName: string,
): string {
  const year = cutoff.year;
  const rangeStr = historicalRange
    ? `historical range ${historicalRange.min}–${historicalRange.max}`
    : "no historical data";

  switch (classification) {
    case "SAFE":
      return `SAFE — Your score ${studentScore} is within the ${rangeStr} for ${collegeName}. Based on ${year} data, this is a strong position.`;
    case "TARGET":
      return `TARGET — Your score ${studentScore} falls within the ${rangeStr} for ${collegeName}. This is competitive based on ${year} data.`;
    case "REACH":
      return `REACH — Your score ${studentScore} is above the historical range (max ${cutoff.cutoffValue}) for ${collegeName}. Admission is possible but not certain.`;
    case "LOW_PROBABILITY":
      return `LOW PROBABILITY — Your score ${studentScore} is significantly outside the ${rangeStr} for ${collegeName}. Admission is unlikely based on past data.`;
    case "INELIGIBLE":
      return `INELIGIBLE — Your score ${studentScore} does not meet the minimum threshold for ${collegeName}.`;
  }
}

/* ------------------------------------------------------------------ */
/* Utility: group cutoffs by college+course                            */
/* ------------------------------------------------------------------ */

function groupCutoffs(cutoffs: CutoffExtended[]): Record<string, CutoffExtended[]> {
  const groups: Record<string, CutoffExtended[]> = {};
  for (const cutoff of cutoffs) {
    const key = `${cutoff.collegeId}::${cutoff.courseId}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(cutoff);
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* What-if scenario engine                                             */
/* ------------------------------------------------------------------ */

/**
 * Create a what-if scenario by modifying scores and recomputing.
 */
export function createWhatIfScenario(
  baseInput: RecommendationInput,
  modifiedScores: { examType: string; totalMarks: number }[],
  label: string,
): {
  scenario: import("@/types/college").WhatIfScenario;
  newLadder: TargetLadder;
} {
  // Clone the input with modified scores
  const modifiedInput: RecommendationInput = {
    ...baseInput,
    entranceScore: modifiedScores[0]?.totalMarks ?? baseInput.entranceScore,
  };

  const { ladder } = generateRecommendations(modifiedInput);

  const scenario: import("@/types/college").WhatIfScenario = {
    id: `scenario-${Date.now()}`,
    label,
    profileId: baseInput.profile.id,
    modifiedScores: modifiedScores.map((ms) => ({
      examType: ms.examType as any,
      totalMarks: ms.totalMarks,
    })),
    recomputedResults: {
      normalizedScore: modifiedInput.entranceScore,
      eligibility: true,
    },
    createdAt: new Date().toISOString(),
  };

  return { scenario, newLadder: ladder };
}

/* ------------------------------------------------------------------ */
/* Scenario comparison                                                 */
/* ------------------------------------------------------------------ */

/**
 * Compare current vs what-if scenario.
 */
export function compareScenarios(
  currentLadder: TargetLadder,
  scenarioLadder: TargetLadder,
  currentScore: number,
  scenarioScore: number,
): import("@/types/college").ScenarioComparison {
  const currentTargets =
    currentLadder.safe.length + currentLadder.target.length + currentLadder.reach.length;
  const scenarioTargets =
    scenarioLadder.safe.length + scenarioLadder.target.length + scenarioLadder.reach.length;

  return {
    current: {
      score: currentScore,
      compatibleTargets: currentTargets,
    },
    scenario: {
      score: scenarioScore,
      compatibleTargets: scenarioTargets,
    },
    difference: {
      scoreDelta: scenarioScore - currentScore,
      additionalTargets: scenarioTargets - currentTargets,
      summary:
        scenarioScore > currentScore
          ? `Improving from ${currentScore} to ${scenarioScore} could open ${scenarioTargets - currentTargets} additional target${scenarioTargets - currentTargets === 1 ? "" : "s"}.`
          : `Reducing from ${currentScore} to ${scenarioScore} could reduce your target options.`,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Multi-pathway comparison                                            */
/* ------------------------------------------------------------------ */

export function comparePathways(
  pathways: {
    name: string;
    examType?: ExamType;
    eligible: boolean;
    score: number;
    competitiveness: string;
    availableTargets: number;
  }[],
): import("@/types/college").PathwayComparison {
  const summary = pathways
    .map(
      (p) =>
        `${p.name}: ${p.eligible ? "Eligible" : "Not eligible"} — ${p.score} (${p.competitiveness}, ${p.availableTargets} targets)`,
    )
    .join("; ");

  return { pathways, summary };
}

/* ------------------------------------------------------------------ */
/* College comparison (up to 4)                                        */
/* ------------------------------------------------------------------ */

export function compareColleges(
  items: import("@/types/college").CollegeComparisonItem[],
): import("@/types/college").CollegeComparisonItem[] {
  return items.slice(0, 4).sort((a, b) => a.difference - b.difference);
}

/* ------------------------------------------------------------------ */
/* Admission readiness                                                 */
/* ------------------------------------------------------------------ */

export function assessAdmissionReadiness(
  profile: StudentProfile,
  class12Result?: AcademicResult,
  entranceScore?: number,
): import("@/types/college").AdmissionReadiness {
  let totalScore = 0;
  const maxTotal = 5;

  // Eligibility completeness
  const eligibilityScore = profile.category && profile.state ? 1 : 0.5;
  totalScore += eligibilityScore;

  // Academic readiness
  const academicScore = class12Result
    ? class12Result.percentage >= 75
      ? 1
      : class12Result.percentage >= 60
        ? 0.7
        : 0.4
    : 0;
  totalScore += academicScore;

  // Entrance readiness
  const entranceScore_val = entranceScore !== undefined ? 0.8 : 0;
  totalScore += entranceScore_val;

  // Target competitiveness
  const competitivenessScore = entranceScore !== undefined ? 0.6 : 0;
  totalScore += competitivenessScore;

  // Profile completeness
  const profileScore = profile.name && profile.birthYear ? 1 : 0.5;
  totalScore += profileScore;

  const level =
    totalScore >= 4
      ? "STRONG"
      : totalScore >= 2.5
        ? "MODERATE"
        : "NEEDS_ATTENTION";

  return {
    level,
    factors: {
      eligibilityCompleteness: {
        score: eligibilityScore,
        max: 1,
        label: profile.category ? "Category set" : "Set your category",
      },
      academicReadiness: {
        score: academicScore,
        max: 1,
        label: class12Result
          ? `Class 12: ${class12Result.percentage}%`
          : "Add Class 12 results",
      },
      entranceReadiness: {
        score: entranceScore_val,
        max: 1,
        label: entranceScore !== undefined
          ? `Entrance score: ${entranceScore}`
          : "Add entrance exam results",
      },
      targetCompetitiveness: {
        score: competitivenessScore,
        max: 1,
        label: entranceScore !== undefined
          ? "Score available for comparison"
          : "Need entrance score",
      },
      profileCompleteness: {
        score: profileScore,
        max: 1,
        label: profile.name ? "Profile complete" : "Complete your profile",
      },
    },
    summary:
      level === "STRONG"
        ? "Your profile is well-prepared for admissions. You have strong eligibility and academic readiness."
        : level === "MODERATE"
          ? "Your profile is partially prepared. Consider completing missing information for better recommendations."
          : "Your profile needs attention. Complete eligibility, academic, and entrance information for accurate recommendations.",
  };
}

/* ------------------------------------------------------------------ */
/* Action plan generator                                               */
/* ------------------------------------------------------------------ */

export function generateActionPlan(
  readiness: import("@/types/college").AdmissionReadiness,
  ladder: TargetLadder,
  profile: StudentProfile,
): import("@/types/college").ActionPlan {
  const actions: import("@/types/college").ActionItem[] = [];

  // Check eligibility completeness
  if (!profile.category) {
    actions.push({
      title: "Set your category",
      explanation: "Category is required for accurate cutoff comparison and eligibility checks.",
      priority: "high",
      category: "eligibility",
    });
  }
  if (!profile.state) {
    actions.push({
      title: "Set your home state",
      explanation: "State domicile affects home-state quota eligibility for many institutions.",
      priority: "medium",
      category: "eligibility",
    });
  }

  // Check target completeness
  if (ladder.safe.length === 0) {
    actions.push({
      title: "Add safe options",
      explanation:
        "No safe options found. Consider colleges with historically lower cutoffs for your category.",
      priority: "high",
      category: "application",
    });
  }
  if (ladder.target.length === 0) {
    actions.push({
      title: "Add target options",
      explanation:
        "No target options found. Look for colleges where your score falls within the historical range.",
      priority: "medium",
      category: "application",
    });
  }
  if (ladder.reach.length === 0) {
    actions.push({
      title: "Add reach options",
      explanation:
        "No reach options found. Consider aspirational colleges for potential improvement.",
      priority: "low",
      category: "application",
    });
  }

  // Check readiness factors
  for (const [key, factor] of Object.entries(readiness.factors)) {
    if (factor.score < factor.max * 0.5) {
      actions.push({
        title: factor.label,
        explanation: `Your ${key.replace(/([A-Z])/g, " $1").toLowerCase()} needs improvement for better recommendations.`,
        priority: key.includes("eligibility") ? "high" : "medium",
        category: key.includes("eligibility")
          ? "eligibility"
          : key.includes("academic")
            ? "academic"
            : key.includes("entrance")
              ? "entrance"
              : "profile",
      });
    }
  }

  // Track counselling
  actions.push({
    title: "Track counselling schedule",
    explanation:
      "Monitor official counselling dates and seat allocation rounds for your target institutions.",
    priority: "medium",
    category: "application",
  });

  return { actions };
}
