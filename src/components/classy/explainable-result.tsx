/**
 * Explainable result format — shows HOW a result was produced.
 *
 * Every major result exposes:
 *  - Result
 *  - How it was calculated
 *  - What it means
 *  - Rule version
 *  - Source
 *  - Verification date
 *  - Next step
 *
 * Reuses existing CLASSY components. Additive-only.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Info,
  ExternalLink,
  Shield,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Source Transparency Label                                           */
/* ------------------------------------------------------------------ */

export type DataSourceLabel = "VERIFIED" | "HISTORICAL" | "ESTIMATED" | "INSTITUTION-SPECIFIC" | "REQUIRES_VERIFICATION";

const SOURCE_LABEL_STYLES: Record<DataSourceLabel, string> = {
  VERIFIED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  HISTORICAL: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  ESTIMATED: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "INSTITUTION-SPECIFIC": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "REQUIRES_VERIFICATION": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const SOURCE_LABEL_ICONS: Record<DataSourceLabel, React.ReactNode> = {
  VERIFIED: <CheckCircle2 className="size-3" />,
  HISTORICAL: <Clock className="size-3" />,
  ESTIMATED: <AlertTriangle className="size-3" />,
  "INSTITUTION-SPECIFIC": <Info className="size-3" />,
  "REQUIRES_VERIFICATION": <Shield className="size-3" />,
};

export function SourceLabel({ label, className }: { label: DataSourceLabel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        SOURCE_LABEL_STYLES[label],
        className,
      )}
    >
      {SOURCE_LABEL_ICONS[label]}
      {label.replace(/_/g, " ")}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Explainable Result Card                                             */
/* ------------------------------------------------------------------ */

export interface ExplainableResultProps {
  /** The result label. */
  title: string;
  /** The computed value. */
  value: string | number;
  /** How it was calculated. */
  howCalculated: string;
  /** What it means for the student. */
  whatItMeans: string;
  /** Rule version used. */
  ruleVersion?: string;
  /** Data source name. */
  source?: string;
  /** Source URL. */
  sourceUrl?: string;
  /** When data was last verified. */
  verifiedAt?: string;
  /** Source transparency label. */
  dataLabel?: DataSourceLabel;
  /** Next step for the student. */
  nextStep?: string;
  /** Visual emphasis. */
  accent?: "default" | "success" | "warning" | "danger";
}

const ACCENT_MAP = {
  default: "border-border/60",
  success: "border-emerald-500/30",
  warning: "border-amber-500/30",
  danger: "border-red-500/30",
};

export function ExplainableResult({
  title,
  value,
  howCalculated,
  whatItMeans,
  ruleVersion,
  source,
  sourceUrl,
  verifiedAt,
  dataLabel,
  nextStep,
  accent = "default",
}: ExplainableResultProps) {
  return (
    <Card className={cn("border shadow-none", ACCENT_MAP[accent])}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
          {dataLabel && <SourceLabel label={dataLabel} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main value */}
        <p className="text-2xl font-bold tracking-tight">{value}</p>

        {/* How it was calculated */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            How it was calculated
          </p>
          <p className="text-xs leading-5 text-muted-foreground">{howCalculated}</p>
        </div>

        {/* What it means */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            What it means
          </p>
          <p className="text-xs leading-5 text-muted-foreground">{whatItMeans}</p>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground/80">
          {ruleVersion && (
            <span className="inline-flex items-center gap-1">
              <Shield className="size-3" />
              Rule: {ruleVersion}
            </span>
          )}
          {source && (
            <span className="inline-flex items-center gap-1">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Source: {source}
                  <ExternalLink className="size-2.5" />
                </a>
              ) : (
                <>Source: {source}</>
              )}
            </span>
          )}
          {verifiedAt && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              Verified: {verifiedAt}
            </span>
          )}
        </div>

        {/* Next step */}
        {nextStep && (
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2">
            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-primary/80">{nextStep}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Classification Badge                                                */
/* ------------------------------------------------------------------ */

import type { CutoffClassification } from "@/types/college";
import { CLASSIFICATION_LABELS, CLASSIFICATION_COLORS, CLASSIFICATION_BG } from "@/types/college";

export function ClassificationBadge({
  classification,
  className,
}: {
  classification: CutoffClassification;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-current/20 text-xs font-semibold",
        CLASSIFICATION_COLORS[classification],
        CLASSIFICATION_BG[classification],
        className,
      )}
    >
      {CLASSIFICATION_LABELS[classification]}
    </Badge>
  );
}
