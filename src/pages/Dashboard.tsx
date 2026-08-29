/**
 * CLASSY Student Dashboard
 *
 * Connects all modules: School, Exams, Admissions, Recommendations.
 * This is a NEW additive page — does not modify existing pages.
 *
 * The dashboard provides:
 *  - Academic Profile overview
 *  - Exam Profile
 *  - Eligibility check
 *  - Admission targets
 *  - What-If scenarios
 *  - Action Plan
 *  - Demo mode for hackathon judges
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExplainableResult,
  ClassificationBadge,
  WhatIfReport,
  StudentAdmissionReport,
  ActionPlanDisplay,
} from "@/components/classy";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import {
  DEMO_LABEL,
  DEMO_MODE_KEY,
  DEMO_PROFILE,
  DEMO_CLASS12_SUBJECTS,
  DEMO_TNEA_SCORE,
  DEMO_CATEGORY,
  DEMO_AUTHORITY,
  DEMO_COLLEGES,
  DEMO_CUTOFFS,
  DEMO_TARGET_LADDER,
  DEMO_READINESS,
} from "@/lib/demo-data";
import {
  calculateAcademicPerformance,
  formatPercentage,
  formatMarks,
} from "@/lib/school/engine";
import {
  calculateTneaScore,
  evaluateTneaEligibility,
  TNEA_CATEGORIES,
} from "@/lib/admissions";
import {
  assessAdmissionReadiness,
  createWhatIfScenario,
  compareScenarios,
  generateActionPlan,
} from "@/lib/admissions/college/recommendation";
import type { SchoolSubject } from "@/types/school";
import type {
  TargetLadder,
  AdmissionReadiness,
  ActionPlan,
  WhatIfScenario,
  ScenarioComparison,
  CutoffExtended,
  CollegeExtended,
} from "@/types/college";
import type { StudentProfile } from "@/types";
import {
  GraduationCap,
  Target,
  Shield,
  BookOpen,
  TrendingUp,
  AlertCircle,
  FileText,
  Sparkles,
  BarChart3,
  Zap,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/* Storage keys                                                        */
/* ------------------------------------------------------------------ */

const STORAGE = {
  demoMode: DEMO_MODE_KEY,
  subjects12: "classy.school.subjects.12",
  profile: "classy.profile.v1",
  tneaScore: "classy.admissions.tnea.score",
  category: "classy.admissions.category",
} as const;

/* ------------------------------------------------------------------ */
/* Demo action plan                                                    */
/* ------------------------------------------------------------------ */

const DEMO_ACTION_PLAN: ActionPlan = {
  actions: [
    {
      title: "Verify TNEA counselling schedule",
      explanation:
        "Check the official TNEA website for counselling dates. Ensure you have all required documents ready.",
      priority: "high",
      category: "application",
    },
    {
      title: "Prepare choice list",
      explanation:
        "Based on your target ladder, prepare your college preference order for TNEA counselling. Prioritize Safe and Target options.",
      priority: "high",
      category: "application",
    },
    {
      title: "Consider improving Chemistry score",
      explanation:
        "Chemistry is your weakest subject at 85%. Even a small improvement could push you into the SAFE zone for more colleges.",
      priority: "medium",
      category: "academic",
    },
    {
      title: "Explore JEE Main pathway",
      explanation:
        "With strong PCM scores, you may also qualify for JEE Main. This opens additional NIT/IIIT options alongside TNEA.",
      priority: "medium",
      category: "entrance",
    },
    {
      title: "Keep documents ready",
      explanation:
        "Ensure 10th/12th mark sheets, community certificate, Aadhaar, and TNEA registration are ready for verification.",
      priority: "low",
      category: "profile",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Main Dashboard                                                      */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [isDemoMode, setIsDemoMode] = useLocalStorage<boolean>(STORAGE.demoMode, false);
  const [activeTab, setActiveTab] = useState("overview");

  // Real data from localStorage
  const [subjects12] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects12, []);
  const [storedProfile] = useLocalStorage<Partial<StudentProfile>>(STORAGE.profile, {});
  const [tneaScoreStr] = useLocalStorage<string>(STORAGE.tneaScore, "");
  const [categoryStr] = useLocalStorage<string>(STORAGE.category, "General");

  // Use demo data when in demo mode
  const profile = isDemoMode ? DEMO_PROFILE : { ...DEMO_PROFILE, ...storedProfile, id: (storedProfile.id || "user-profile") as any } as StudentProfile;
  const class12Subjects = isDemoMode ? DEMO_CLASS12_SUBJECTS : subjects12;
  const tneaScore = isDemoMode ? DEMO_TNEA_SCORE : (tneaScoreStr ? parseFloat(tneaScoreStr) : undefined);
  const category = isDemoMode ? DEMO_CATEGORY : (categoryStr || "General");

  // Compute academic performance
  const academicPerf = useMemo(
    () => (class12Subjects.length > 0 ? calculateAcademicPerformance(class12Subjects) : null),
    [class12Subjects],
  );

  // Compute admission readiness (simplified for demo)
  const readiness: AdmissionReadiness = isDemoMode
    ? DEMO_READINESS
    : {
        level: academicPerf ? (academicPerf.percentage >= 75 ? "STRONG" : academicPerf.percentage >= 50 ? "MODERATE" : "NEEDS_ATTENTION") : "NEEDS_ATTENTION",
        factors: {
          eligibilityCompleteness: { score: category ? 1 : 0.5, max: 1, label: category ? `Category: ${category}` : "Set category" },
          academicReadiness: { score: academicPerf ? (academicPerf.percentage >= 75 ? 1 : 0.7) : 0, max: 1, label: academicPerf ? `Class 12: ${academicPerf.percentage.toFixed(0)}%` : "Add Class 12" },
          entranceReadiness: { score: tneaScore !== undefined ? 0.8 : 0, max: 1, label: tneaScore !== undefined ? `TNEA: ${tneaScore}` : "Add TNEA score" },
          targetCompetitiveness: { score: tneaScore !== undefined ? 0.6 : 0, max: 1, label: "Targets TBD" },
          profileCompleteness: { score: profile.name ? 1 : 0.5, max: 1, label: profile.name ? "Profile complete" : "Complete profile" },
        },
        summary: academicPerf
          ? `${academicPerf.percentage >= 75 ? "STRONG" : "MODERATE"} — Your academic performance is ${academicPerf.percentage >= 75 ? "solid" : "developing"}. ${tneaScore !== undefined ? "Entrance score available." : "Add entrance score for full analysis."}`
          : "Add academic data to see your readiness assessment.",
      };

  // Target ladder — use demo data or empty
  const targetLadder: TargetLadder = isDemoMode
    ? DEMO_TARGET_LADDER
    : { safe: [], target: [], reach: [], backup: [] };

  // Action plan
  const actionPlan: ActionPlan = isDemoMode
    ? DEMO_ACTION_PLAN
    : {
        actions: [
          ...(academicPerf && academicPerf.percentage < 75
            ? [{ title: "Improve academic performance", explanation: "Focus on weak subjects to improve your Class 12 percentage.", priority: "high" as const, category: "academic" as const }]
            : []),
          ...(tneaScore === undefined
            ? [{ title: "Take entrance exam", explanation: "Register for TNEA/JEE Main to get your entrance score.", priority: "high" as const, category: "entrance" as const }]
            : []),
          ...(class12Subjects.length === 0
            ? [{ title: "Add Class 12 marks", explanation: "Enter your Class 12 subject marks to see academic analysis.", priority: "high" as const, category: "academic" as const }]
            : []),
          { title: "Complete your profile", explanation: "Add category, state, and other details for accurate eligibility checks.", priority: "medium" as const, category: "profile" as const },
        ],
      };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Background />
      <Navbar />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {/* Demo mode banner */}
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {DEMO_LABEL}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              This demo uses fictional data to showcase CLASSY capabilities.
            </p>
          </motion.div>
        )}

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              CLASSY Admission Intelligence
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome{profile.name ? `, ${profile.name}` : ""}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Explainable Academic-to-Admission Intelligence Platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isDemoMode ? "default" : "outline"}
              size="sm"
              className="cursor-pointer gap-1.5 text-xs"
              onClick={() => setIsDemoMode(!isDemoMode)}
            >
              <Sparkles className="size-3.5" />
              {isDemoMode ? "Demo Mode ON" : "Try Demo"}
            </Button>
          </div>
        </header>

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="mr-1 size-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="academics" className="text-xs">
              <BookOpen className="mr-1 size-3" />
              Academics
            </TabsTrigger>
            <TabsTrigger value="targets" className="text-xs">
              <Target className="mr-1 size-3" />
              Targets
            </TabsTrigger>
            <TabsTrigger value="whatif" className="text-xs">
              <Zap className="mr-1 size-3" />
              What-If
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">
              <AlertCircle className="mr-1 size-3" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="report" className="text-xs">
              <FileText className="mr-1 size-3" />
              Report
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Executive summary cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Academic Performance */}
              <ExplainableResult
                title="Academic Performance"
                value={academicPerf ? `${academicPerf.percentage.toFixed(1)}%` : "No data"}
                howCalculated={
                  academicPerf
                    ? `Total: ${academicPerf.totalObtained}/${academicPerf.totalMaximum} across ${class12Subjects.length} subjects`
                    : "Add Class 12 subject marks to calculate."
                }
                whatItMeans={
                  academicPerf
                    ? `${academicPerf.academicLevel.replace(/-/g, " ").toUpperCase()} level. Strongest: ${academicPerf.strongestSubject}, Weakest: ${academicPerf.weakestSubject}.`
                    : "Enter your marks to see performance analysis."
                }
                dataLabel={isDemoMode ? "VERIFIED" : undefined}
                source={isDemoMode ? "Demo data" : undefined}
                ruleVersion="1.0"
                nextStep={!academicPerf ? "Add Class 12 marks" : undefined}
              />

              {/* TNEA Score */}
              <ExplainableResult
                title="TNEA Score"
                value={tneaScore !== undefined ? `${tneaScore} / 200` : "No score"}
                howCalculated={
                  tneaScore !== undefined
                    ? "Mathematics (100) + Physics (50) + Chemistry (50) = 200"
                    : "Register for TNEA counselling to get your score."
                }
                whatItMeans={
                  tneaScore !== undefined
                    ? tneaScore >= 190
                      ? "Excellent — strong position for top colleges."
                      : tneaScore >= 180
                        ? "Good — competitive for many colleges."
                        : "Moderate — consider backup options."
                    : "TNEA score needed for Tamil Nadu engineering admissions."
                }
                dataLabel={isDemoMode ? "VERIFIED" : undefined}
                source={isDemoMode ? "TNEA 2024 Official" : undefined}
                ruleVersion="TNEA-2024"
                accent={tneaScore !== undefined ? (tneaScore >= 190 ? "success" : tneaScore >= 180 ? "default" : "warning") : "default"}
              />

              {/* Admission Readiness */}
              <ExplainableResult
                title="Admission Readiness"
                value={readiness.level.replace(/_/g, " ")}
                howCalculated="Based on eligibility, academic, entrance, target, and profile completeness."
                whatItMeans={readiness.summary}
                dataLabel={isDemoMode ? "ESTIMATED" : undefined}
                nextStep={
                  readiness.level === "NEEDS_ATTENTION"
                    ? "Complete your profile and add entrance scores"
                    : readiness.level === "MODERATE"
                      ? "Add more data for better recommendations"
                      : undefined
                }
                accent={
                  readiness.level === "STRONG"
                    ? "success"
                    : readiness.level === "MODERATE"
                      ? "default"
                      : "warning"
                }
              />
            </div>

            {/* Quick target preview */}
            {(targetLadder.safe.length > 0 || targetLadder.target.length > 0) && (
              <Card className="border-border/60 shadow-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-primary" />
                      <CardTitle className="text-sm font-semibold">Top Targets</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-xs"
                      onClick={() => setActiveTab("targets")}
                    >
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...targetLadder.safe, ...targetLadder.target].slice(0, 3).map((rec, i) => (
                      <div
                        key={`${rec.collegeId}-${i}`}
                        className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{rec.collegeName}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{rec.courseName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">
                            {rec.studentScore} vs {rec.cutoffValue}
                          </span>
                          <ClassificationBadge classification={rec.classification} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Academics Tab */}
          <TabsContent value="academics" className="space-y-4">
            {class12Subjects.length > 0 ? (
              <Card className="border-border/60 shadow-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">Class 12 Academic Results</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Summary */}
                    {academicPerf && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg bg-primary/5 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Total</p>
                          <p className="text-sm font-bold">{academicPerf.totalObtained}/{academicPerf.totalMaximum}</p>
                        </div>
                        <div className="rounded-lg bg-primary/5 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Percentage</p>
                          <p className="text-sm font-bold">{academicPerf.percentage.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-lg bg-emerald-500/5 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Strongest</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{academicPerf.strongestSubject}</p>
                        </div>
                        <div className="rounded-lg bg-amber-500/5 px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Weakest</p>
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{academicPerf.weakestSubject}</p>
                        </div>
                      </div>
                    )}

                    {/* Subject breakdown */}
                    <div className="space-y-1.5">
                      {class12Subjects.map((s) => {
                        const pct = s.maxMarks > 0 ? (s.obtainedMarks / s.maxMarks) * 100 : 0;
                        return (
                          <div key={s.id} className="flex items-center gap-3">
                            <span className="w-24 shrink-0 text-xs text-muted-foreground">{s.name}</span>
                            <div className="flex-1">
                              <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    pct >= 85 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : "bg-amber-500",
                                  )}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                            </div>
                            <span className="w-16 text-right text-xs font-medium">
                              {s.obtainedMarks}/{s.maxMarks}
                            </span>
                            <span className="w-10 text-right text-[10px] text-muted-foreground">
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 shadow-none">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <BookOpen className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No academic data yet</p>
                  <p className="text-xs text-muted-foreground">
                    Visit the School module to add your Class 12 marks.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Targets Tab */}
          <TabsContent value="targets" className="space-y-4">
            {targetLadder.safe.length > 0 || targetLadder.target.length > 0 || targetLadder.reach.length > 0 ? (
              <>
                {/* Safe */}
                {targetLadder.safe.length > 0 && (
                  <TargetSection label="Safe Choices" subtitle="Strong probability based on historical data" items={targetLadder.safe} color="emerald" />
                )}
                {/* Target */}
                {targetLadder.target.length > 0 && (
                  <TargetSection label="Target Choices" subtitle="Competitive — within historical range" items={targetLadder.target} color="sky" />
                )}
                {/* Reach */}
                {targetLadder.reach.length > 0 && (
                  <TargetSection label="Reach Choices" subtitle="Possible but not certain" items={targetLadder.reach} color="amber" />
                )}
                {/* Backup */}
                {targetLadder.backup.length > 0 && (
                  <TargetSection label="Backup Choices" subtitle="Low probability — consider as alternatives" items={targetLadder.backup} color="orange" />
                )}
              </>
            ) : (
              <Card className="border-border/60 shadow-none">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Target className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No targets available</p>
                  <p className="text-xs text-muted-foreground">
                    {isDemoMode
                      ? "Enable demo mode to see sample recommendations."
                      : "Add your entrance score and preferences to see college targets."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* What-If Tab */}
          <TabsContent value="whatif" className="space-y-4">
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">What-If Scenario Simulation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isDemoMode ? (
                  <WhatIfReport
                    comparison={{
                      current: { score: 186.5, compatibleTargets: 3 },
                      scenario: { score: 192, compatibleTargets: 5 },
                      difference: {
                        scoreDelta: 5.5,
                        additionalTargets: 2,
                        summary:
                          "Improving from 186.5 to 192 could open 2 additional target options, including MIT CSE and CEG CSE.",
                      },
                    }}
                    currentLadder={DEMO_TARGET_LADDER}
                    scenarioLadder={{
                      safe: [
                        ...DEMO_TARGET_LADDER.safe,
                        DEMO_TARGET_LADDER.target[0],
                      ],
                      target: [
                        DEMO_TARGET_LADDER.reach[0],
                        DEMO_TARGET_LADDER.reach[1],
                      ],
                      reach: [],
                      backup: [],
                    }}
                    scenarioLabel="If TNEA score improves from 186.5 to 192"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <Zap className="size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No scenario data</p>
                    <p className="text-xs text-muted-foreground">
                      Try demo mode to see What-If analysis, or add your entrance score first.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Action Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {actionPlan.actions.length > 0 ? (
                  <ActionPlanDisplay plan={actionPlan} />
                ) : (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No actions needed — you're all set!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-4">
            <StudentAdmissionReport
              profile={profile}
              class12Subjects={class12Subjects}
              class12Percentage={academicPerf?.percentage}
              entranceExam="TNEA"
              entranceScore={tneaScore}
              entranceScoreType="marks"
              tneaScore={tneaScore}
              category={category}
              targetLadder={targetLadder}
              readiness={readiness}
              disclaimer={isDemoMode ? DEMO_LABEL : undefined}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Target Section                                                      */
/* ------------------------------------------------------------------ */

function TargetSection({
  label,
  subtitle,
  items,
  color,
}: {
  label: string;
  subtitle: string;
  items: import("@/types/college").CollegeRecommendation[];
  color: string;
}) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full", `bg-${color}-500`)} />
          <CardTitle className="text-sm font-semibold">{label}</CardTitle>
        </div>
        <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((rec, i) => (
            <div
              key={`${rec.collegeId}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{rec.collegeName}</p>
                <p className="truncate text-[10px] text-muted-foreground">{rec.courseName}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground/80">{rec.explanation}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <ClassificationBadge classification={rec.classification} />
                <span className="text-[10px] text-muted-foreground">
                  {rec.scoreGap > 0 ? `+${rec.scoreGap}` : rec.scoreGap} gap
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
