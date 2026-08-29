/**
 * CLASSY Student Admission Report
 *
 * Compact student result summary containing:
 *  - Student profile
 *  - Academic performance
 *  - Entrance performance
 *  - Eligibility
 *  - Admission position
 *  - Target course
 *  - Top targets
 *  - Next steps
 *
 * Reuses existing CLASSY components. Additive-only.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SourceLabel, type DataSourceLabel } from "./explainable-result";
import { ClassificationBadge } from "./explainable-result";
import { cn } from "@/lib/utils";
import {
  User,
  GraduationCap,
  Target,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  FileText,
  Shield,
} from "lucide-react";
import type { StudentProfile, AcademicResult } from "@/types";
import type { SchoolSubject } from "@/types/school";
import type { TargetLadder, AdmissionReadiness, CollegeRecommendation } from "@/types/college";

/* ------------------------------------------------------------------ */
/* Report Props                                                        */
/* ------------------------------------------------------------------ */

export interface StudentReportProps {
  profile: StudentProfile;
  class12Subjects?: SchoolSubject[];
  class12Percentage?: number;
  entranceExam?: string;
  entranceScore?: number;
  entranceScoreType?: "rank" | "marks";
  tneaScore?: number;
  category?: string;
  targetLadder?: TargetLadder;
  readiness?: AdmissionReadiness;
  disclaimer?: string;
}

/* ------------------------------------------------------------------ */
/* Main Report Component                                               */
/* ------------------------------------------------------------------ */

export function StudentAdmissionReport({
  profile,
  class12Subjects,
  class12Percentage,
  entranceExam,
  entranceScore,
  entranceScoreType,
  tneaScore,
  category,
  targetLadder,
  readiness,
  disclaimer,
}: StudentReportProps) {
  return (
    <div className="space-y-6" id="classy-report">
      {/* Report header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
          <FileText className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            CLASSY Student Admission Report
          </span>
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-tight">
          {profile.name}
        </h2>
        {disclaimer && (
          <p className="mt-1 text-[10px] text-muted-foreground">{disclaimer}</p>
        )}
      </div>

      {/* Student Profile */}
      <Card className="border-border/60 shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Student Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Roll Number</span>
              <p className="font-medium">{profile.rollNumber || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-medium">{category || profile.category || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">State</span>
              <p className="font-medium">{profile.state || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      {class12Subjects && class12Subjects.length > 0 && (
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Academic Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Overall Percentage</span>
                <span className="text-lg font-bold">{class12Percentage?.toFixed(1) || "—"}%</span>
              </div>
              <Separator />
              <div className="space-y-1.5">
                {class12Subjects.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-medium">
                      {s.obtainedMarks}/{s.maxMarks}
                      <span className="ml-1.5 text-muted-foreground">
                        ({s.maxMarks > 0 ? ((s.obtainedMarks / s.maxMarks) * 100).toFixed(0) : 0}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entrance Performance */}
      {(entranceScore !== undefined || tneaScore !== undefined) && (
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Entrance Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tneaScore !== undefined && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">TNEA Score (out of 200)</span>
                  <span className="text-lg font-bold">{tneaScore}</span>
                </div>
              )}
              {entranceExam && entranceScore !== undefined && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">
                    {entranceExam} ({entranceScoreType === "rank" ? "Rank" : "Marks"})
                  </span>
                  <span className="text-lg font-bold">{entranceScore}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admission Readiness */}
      {readiness && (
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Admission Readiness</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ReadinessBar level={readiness.level} summary={readiness.summary} />
              <div className="space-y-1.5">
                {Object.entries(readiness.factors).map(([key, f]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(f.score / f.max) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-muted-foreground">{f.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Target Ladder */}
      {targetLadder && (
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Target Ladder</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {targetLadder.safe.length > 0 && (
                <LadderSection label="Safe Choices" items={targetLadder.safe} color="emerald" />
              )}
              {targetLadder.target.length > 0 && (
                <LadderSection label="Target Choices" items={targetLadder.target} color="sky" />
              )}
              {targetLadder.reach.length > 0 && (
                <LadderSection label="Reach Choices" items={targetLadder.reach} color="amber" />
              )}
              {targetLadder.backup.length > 0 && (
                <LadderSection label="Backup Choices" items={targetLadder.backup} color="orange" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[10px] leading-4 text-muted-foreground">
            <strong>Disclaimer:</strong> This report is generated by CLASSY using deterministic
            calculations and publicly available historical data. It does NOT guarantee admission.
            Always verify with official counselling authorities. Classification labels (SAFE, TARGET,
            REACH) are based on historical cutoff analysis and should be used as guidance only.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Readiness Bar                                                       */
/* ------------------------------------------------------------------ */

function ReadinessBar({
  level,
  summary,
}: {
  level: string;
  summary: string;
}) {
  const colors = {
    STRONG: "bg-emerald-500",
    MODERATE: "bg-amber-500",
    NEEDS_ATTENTION: "bg-red-500",
  } as Record<string, string>;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-block size-2 rounded-full",
            colors[level] || "bg-muted",
          )}
        />
        <span className="text-sm font-semibold">{level.replace(/_/g, " ")}</span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{summary}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ladder Section                                                      */
/* ------------------------------------------------------------------ */

function LadderSection({
  label,
  items,
  color,
}: {
  label: string;
  items: CollegeRecommendation[];
  color: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className={cn("mb-1.5 text-[10px] font-semibold uppercase tracking-wider", `text-${color}-600 dark:text-${color}-400`)}>
        {label}
      </p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={`${item.collegeId}-${i}`}
            className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{item.collegeName}</p>
              <p className="truncate text-[10px] text-muted-foreground">{item.courseName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Score: {item.studentScore} | Cutoff: {item.cutoffValue}
              </span>
              <ClassificationBadge classification={item.classification} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
