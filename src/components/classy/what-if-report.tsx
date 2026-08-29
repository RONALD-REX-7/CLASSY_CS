/**
 * What-If Scenario Report
 *
 * Shows CURRENT vs SCENARIO comparison:
 *  - marks
 *  - calculated result
 *  - admission position
 *  - target changes
 *
 * Reuses existing CLASSY components. Additive-only.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassificationBadge } from "./explainable-result";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ScenarioComparison } from "@/types/college";
import type { TargetLadder } from "@/types/college";

/* ------------------------------------------------------------------ */
/* What-If Report Props                                                */
/* ------------------------------------------------------------------ */

export interface WhatIfReportProps {
  comparison: ScenarioComparison;
  currentLadder: TargetLadder;
  scenarioLadder: TargetLadder;
  scenarioLabel?: string;
}

/* ------------------------------------------------------------------ */
/* What-If Report Component                                            */
/* ------------------------------------------------------------------ */

export function WhatIfReport({
  comparison,
  currentLadder,
  scenarioLadder,
  scenarioLabel = "What-If Scenario",
}: WhatIfReportProps) {
  const { current, scenario, difference } = comparison;
  const scoreImproved = difference.scoreDelta > 0;
  const targetsImproved = difference.additionalTargets > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-sm font-semibold tracking-tight">What-If Analysis</h3>
        <p className="mt-1 text-xs text-muted-foreground">{scenarioLabel}</p>
      </div>

      {/* Score comparison */}
      <div className="grid grid-cols-3 items-center gap-2">
        {/* Current */}
        <Card className="border-border/60 shadow-none">
          <CardContent className="p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Current
            </p>
            <p className="mt-1 text-xl font-bold">{current.score}</p>
            <p className="text-[10px] text-muted-foreground">
              {current.compatibleTargets} targets
            </p>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1">
          <ArrowRight className="size-4 text-muted-foreground" />
          <span
            className={cn(
              "text-xs font-semibold",
              scoreImproved ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {scoreImproved ? "+" : ""}{difference.scoreDelta.toFixed(1)}
          </span>
        </div>

        {/* Scenario */}
        <Card className="border-border/60 shadow-none">
          <CardContent className="p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Scenario
            </p>
            <p className="mt-1 text-xl font-bold">{scenario.score}</p>
            <p className="text-[10px] text-muted-foreground">
              {scenario.compatibleTargets} targets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Impact summary */}
      <Card className="border-border/60 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            {targetsImproved ? (
              <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : difference.additionalTargets < 0 ? (
              <TrendingDown className="mt-0.5 size-3.5 shrink-0 text-red-600 dark:text-red-400" />
            ) : (
              <Minus className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            )}
            <p className="text-xs leading-5 text-muted-foreground">{difference.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Target changes */}
      <div className="grid grid-cols-2 gap-3">
        <LadderMini label="Current Targets" ladder={currentLadder} />
        <LadderMini label="Scenario Targets" ladder={scenarioLadder} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini Ladder View                                                    */
/* ------------------------------------------------------------------ */

function LadderMini({
  label,
  ladder,
}: {
  label: string;
  ladder: TargetLadder;
}) {
  const total = ladder.safe.length + ladder.target.length + ladder.reach.length;

  return (
    <Card className="border-border/60 shadow-none">
      <CardContent className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold">{total}</p>
        <div className="mt-1 flex gap-1">
          {ladder.safe.length > 0 && (
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
              {ladder.safe.length} Safe
            </span>
          )}
          {ladder.target.length > 0 && (
            <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-medium text-sky-600 dark:text-sky-400">
              {ladder.target.length} Target
            </span>
          )}
          {ladder.reach.length > 0 && (
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400">
              {ladder.reach.length} Reach
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
