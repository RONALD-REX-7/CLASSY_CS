/**
 * Result display components for school academic results.
 * Shows percentage, performance ring, subject breakdown, and insights.
 */

import type { AcademicPerformance } from "@/types/school";
import type { AcademicInsight } from "@/types";
import { cn } from "@/lib/utils";
import { getLevelBand } from "@/lib/school/engine";
import { formatPercentage, formatMarks } from "@/lib/school/engine";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Performance summary card                                            */
/* ------------------------------------------------------------------ */

interface PerformanceSummaryProps {
  performance: AcademicPerformance;
}

export function PerformanceSummary({ performance }: PerformanceSummaryProps) {
  const levelBand = getLevelBand(performance.academicLevel);
  const percentage = performance.percentage;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width="130" height="130" className="-rotate-90">
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="currentColor"
              className="stroke-muted/50"
              strokeWidth="10"
            />
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="url(#perf-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="perf-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-foreground">
              {formatPercentage(percentage)}%
            </span>
            <span className={cn("text-xs font-semibold", levelBand.color)}>
              {levelBand.label}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Marks</p>
            <p className="font-display text-lg font-bold text-foreground">
              {formatMarks(performance.totalObtained, performance.totalMaximum)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Average</p>
            <p className="font-display text-lg font-bold text-foreground">
              {formatPercentage(performance.averagePercentage)}%
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Strongest</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3.5" />
              {performance.strongestSubject}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Weakest</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <TrendingDown className="size-3.5" />
              {performance.weakestSubject}
            </p>
          </div>
        </div>
      </div>

      {performance.subjectsBelowPass > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="size-4 shrink-0" />
          {performance.subjectsBelowPass} subject{performance.subjectsBelowPass === 1 ? " is" : "s are"} below 50%
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subject performance table                                           */
/* ------------------------------------------------------------------ */

interface SubjectTableProps {
  performances: AcademicPerformance["subjectPerformances"];
}

export function SubjectTable({ performances }: SubjectTableProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/8">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subject
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Marks
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                %
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="sr-only">Bar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {performances.map((sp) => {
              const band = getLevelBand(sp.level);
              return (
                <tr key={sp.subjectName} className="border-b border-foreground/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{sp.subjectName}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {sp.obtainedMarks} / {sp.maxMarks}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                    {formatPercentage(sp.percentage)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", band.chipBg)}>
                      {band.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.min(sp.percentage, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Insights list                                                       */
/* ------------------------------------------------------------------ */

interface InsightsListProps {
  insights: AcademicInsight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  if (insights.length === 0) return null;

  const iconMap: Record<string, LucideIcon> = {
    overall: BarChart3,
    subject: Target,
    distribution: BarChart3,
    pathway: Lightbulb,
  };

  return (
    <div className="space-y-2">
      {insights.map((insight, i) => {
        const Icon = iconMap[insight.category] ?? Lightbulb;
        return (
          <div
            key={`${insight.category}-${i}`}
            className={cn(
              "glass-soft flex items-start gap-3 rounded-xl px-4 py-3",
              insight.importance === "positive" && "border-l-2 border-emerald-500/50",
              insight.importance === "warning" && "border-l-2 border-amber-500/50",
            )}
          >
            <Icon className={cn(
              "mt-0.5 size-4 shrink-0",
              insight.importance === "positive" ? "text-emerald-500" :
              insight.importance === "warning" ? "text-amber-500" :
              "text-muted-foreground",
            )} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{insight.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
