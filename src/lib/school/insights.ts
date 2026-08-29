/**
 * Academic insights generator.
 *
 * Produces human-readable insights from academic performance data.
 * Uses broad, understandable labels — no fake statistical precision.
 */

import type {
  AcademicPerformance,
  SchoolSubject,
  Stream,
  ClassLevel,
} from "@/types/school";
import type { AcademicInsight } from "@/types";
import { STREAM_LABELS } from "@/types/school";
import { calculateAcademicPerformance, getLevelBand } from "./engine";

/* ------------------------------------------------------------------ */
/* Generate insights                                                   */
/* ------------------------------------------------------------------ */

/**
 * Generate a set of academic insights from subjects.
 */
export function generateInsights(
  subjects: SchoolSubject[],
  stream?: Stream,
  classLevel?: ClassLevel,
): AcademicInsight[] {
  const insights: AcademicInsight[] = [];
  const perf = calculateAcademicPerformance(subjects);

  if (!perf) {
    insights.push({
      category: "overall",
      title: "No data yet",
      description: "Add subjects and marks to see your academic insights.",
      importance: "info",
    });
    return insights;
  }

  // Overall performance
  const levelBand = getLevelBand(perf.academicLevel);
  insights.push({
    category: "overall",
    title: `Overall: ${levelBand.label}`,
    description: `You scored ${perf.percentage.toFixed(1)}% overall. ${levelBand.label === "Excellent" ? "Outstanding performance!" : levelBand.label === "Strong" ? "Very solid work." : levelBand.label === "Competitive" ? "Good foundation with room to grow." : "Focus on improving weaker areas."}`,
    importance: perf.academicLevel === "excellent" || perf.academicLevel === "strong" ? "positive" : "warning",
  });

  // Strongest subject
  if (perf.strongestSubject !== "—") {
    const strong = perf.subjectPerformances.find((sp) => sp.subjectName === perf.strongestSubject);
    if (strong) {
      insights.push({
        category: "subject",
        title: `Strongest: ${perf.strongestSubject}`,
        description: `${strong.percentage.toFixed(1)}% — ${getLevelBand(strong.level).label}. This is your best-performing subject.`,
        importance: "positive",
      });
    }
  }

  // Weakest subject
  if (perf.weakestSubject !== "—" && perf.weakestSubject !== perf.strongestSubject) {
    const weak = perf.subjectPerformances.find((sp) => sp.subjectName === perf.weakestSubject);
    if (weak) {
      insights.push({
        category: "subject",
        title: `Needs attention: ${perf.weakestSubject}`,
        description: `${weak.percentage.toFixed(1)}% — ${getLevelBand(weak.level).label}. Consider spending extra time here.`,
        importance: weak.percentage < 50 ? "warning" : "info",
      });
    }
  }

  // Subjects below pass
  if (perf.subjectsBelowPass > 0) {
    insights.push({
      category: "distribution",
      title: `${perf.subjectsBelowPass} subject${perf.subjectsBelowPass === 1 ? " needs" : "s need"} improvement`,
      description: `${perf.subjectsBelowPass} subject${perf.subjectsBelowPass === 1 ? " is" : "s are"} below 50%. Prioritize these to raise your overall percentage.`,
      importance: "warning",
    });
  }

  // Distribution insight — balanced vs skewed
  const percentages = perf.subjectPerformances.map((sp) => sp.percentage);
  const max = Math.max(...percentages);
  const min = Math.min(...percentages);
  const spread = max - min;

  if (spread < 10) {
    insights.push({
      category: "distribution",
      title: "Well-balanced performance",
      description: `Your subject scores are consistent (spread of ${spread.toFixed(1)}%). This shows a strong all-round academic foundation.`,
      importance: "positive",
    });
  } else if (spread > 30) {
    insights.push({
      category: "distribution",
      title: "Uneven performance",
      description: `There's a ${spread.toFixed(1)}% gap between your best and weakest subjects. Consider redistributing study time.`,
      importance: "warning",
    });
  }

  // Stream + pathway hint (Class 11/12 only)
  if (classLevel && classLevel >= 11 && stream) {
    insights.push({
      category: "pathway",
      title: `Stream: ${STREAM_LABELS[stream]}`,
      description: getStreamInsight(stream, perf),
      importance: "info",
    });
  }

  return insights;
}

/* ------------------------------------------------------------------ */
/* Stream-specific insights                                            */
/* ------------------------------------------------------------------ */

function getStreamInsight(stream: Stream, perf: AcademicPerformance): string {
  const mathPerf = perf.subjectPerformances.find((sp) =>
    sp.subjectName.toLowerCase().includes("math"),
  );
  const sciencePerf = perf.subjectPerformances.find(
    (sp) =>
      sp.subjectName.toLowerCase().includes("physics") ||
      sp.subjectName.toLowerCase().includes("chemistry"),
  );
  const bioPerf = perf.subjectPerformances.find((sp) =>
    sp.subjectName.toLowerCase().includes("bio"),
  );

  switch (stream) {
    case "pcm":
      if (mathPerf && sciencePerf) {
        const avg = (mathPerf.percentage + sciencePerf.percentage) / 2;
        return avg >= 75
          ? "Strong PCM scores — you have a solid foundation for engineering and science pathways."
          : "Your PCM average is moderate. Strengthening Mathematics and Science will improve your entrance exam readiness.";
      }
      return "PCM stream — focus on Mathematics and Science for engineering pathways.";

    case "pcb":
      if (sciencePerf && bioPerf) {
        const avg = (sciencePerf.percentage + bioPerf.percentage) / 2;
        return avg >= 75
          ? "Strong PCB scores — you have a solid foundation for medical and life-science pathways."
          : "Your PCB average is moderate. Focus on Biology and Science for medical pathways.";
      }
      return "PCB stream — focus on Biology and Science for medical pathways.";

    case "pcmb":
      return "PCMB stream — you have flexibility for both engineering and medical pathways.";

    case "commerce":
      return "Commerce stream — you have a foundation for business, finance, and economics pathways.";

    case "humanities":
      return "Humanities stream — you have a foundation for law, social sciences, and liberal arts pathways.";

    default:
      return "Continue building your academic foundation across all subjects.";
  }
}
