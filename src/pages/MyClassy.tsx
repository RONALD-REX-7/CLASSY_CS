/**
 * My Classy — personal student workspace.
 * Connects: Profile, Academics, Exams, Targets, Scenarios, Action Plan.
 * Uses localStorage data from School and Admissions modules.
 * This is a new additive page.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  calculateAcademicPerformance,
  formatPercentage,
} from "@/lib/school/engine";
import type { SchoolSubject } from "@/types/school";
import {
  ActionPlanDisplay,
  ExplainableResult,
  WhatIfReport,
} from "@/components/classy";
import {
  DEMO_LABEL,
  DEMO_MODE_KEY,
  DEMO_CLASS12_SUBJECTS,
  DEMO_PROFILE,
  DEMO_TNEA_SCORE,
  DEMO_CATEGORY,
  DEMO_TARGET_LADDER,
  DEMO_READINESS,
} from "@/lib/demo-data";
import type {
  TargetLadder,
  AdmissionReadiness,
  ActionPlan,
} from "@/types/college";
import type { StudentProfile } from "@/types";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Map,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STORAGE = {
  demoMode: DEMO_MODE_KEY,
  subjects12: "classy.school.subjects.12",
  profile: "classy.profile.v1",
  tneaScore: "classy.admissions.tnea.score",
  category: "classy.admissions.category",
} as const;

const DEMO_ACTION_PLAN: ActionPlan = {
  actions: [
    {
      title: "Verify TNEA counselling schedule",
      explanation: "Check the official TNEA website for counselling dates and document requirements.",
      priority: "high",
      category: "application",
    },
    {
      title: "Prepare choice list",
      explanation: "Based on your target ladder, prepare your college preference order for TNEA counselling.",
      priority: "high",
      category: "application",
    },
    {
      title: "Consider improving Chemistry",
      explanation: "Chemistry is your weakest subject. Even a small improvement could expand your target options.",
      priority: "medium",
      category: "academic",
    },
    {
      title: "Explore JEE Main pathway",
      explanation: "With strong PCM scores, you may also qualify for JEE Main — opens additional NIT/IIIT options.",
      priority: "medium",
      category: "entrance",
    },
    {
      title: "Keep documents ready",
      explanation: "Ensure 10th/12th mark sheets, community certificate, Aadhaar, and TNEA registration are ready.",
      priority: "low",
      category: "profile",
    },
  ],
};

/** Workspace sections */
const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "academics", label: "Academics", icon: BookOpen },
  { id: "targets", label: "Targets", icon: Target },
  { id: "actions", label: "Action Plan", icon: TrendingUp },
];

export default function MyClassy() {
  const [isDemoMode, setIsDemoMode] = useLocalStorage<boolean>(STORAGE.demoMode, false);
  const [activeSection, setActiveSection] = useState("profile");
  const location = useLocation();

  // Real data
  const [subjects12] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects12, []);
  const [storedProfile] = useLocalStorage<Partial<StudentProfile>>(STORAGE.profile, {});
  const [tneaScoreStr] = useLocalStorage<string>(STORAGE.tneaScore, "");
  const [categoryStr] = useLocalStorage<string>(STORAGE.category, "General");

  // Use demo data when in demo mode
  const profile = isDemoMode ? DEMO_PROFILE : { ...DEMO_PROFILE, ...storedProfile, id: (storedProfile.id || "user-profile") as any } as StudentProfile;
  const class12Subjects = isDemoMode ? DEMO_CLASS12_SUBJECTS : subjects12;
  const tneaScore = isDemoMode ? DEMO_TNEA_SCORE : (tneaScoreStr ? parseFloat(tneaScoreStr) : undefined);
  const category = isDemoMode ? DEMO_CATEGORY : (categoryStr || "General");

  const academicPerf = useMemo(
    () => (class12Subjects.length > 0 ? calculateAcademicPerformance(class12Subjects) : null),
    [class12Subjects],
  );

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

  const targetLadder: TargetLadder = isDemoMode
    ? DEMO_TARGET_LADDER
    : { safe: [], target: [], reach: [], backup: [] };

  const actionPlan: ActionPlan = isDemoMode ? DEMO_ACTION_PLAN : {
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

  const hasData = class12Subjects.length > 0 || tneaScore !== undefined;

  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
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
          </motion.div>
        )}

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
              My Classy
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your <span className="text-gradient">student workspace</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Profile, academics, targets, and action plan — all connected.
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
              {isDemoMode ? "Demo ON" : "Try Demo"}
            </Button>
          </div>
        </motion.div>

        {/* Section nav */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6 flex gap-2 overflow-x-auto pb-1"
          aria-label="Workspace sections"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`glass-soft flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeSection === section.id
                  ? "bg-indigo-500/10 text-indigo-600 dark:bg-white/10 dark:text-indigo-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <section.icon className="size-3.5" />
              {section.label}
            </button>
          ))}
        </motion.nav>

        {/* Profile section */}
        {activeSection === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:text-indigo-300">
                  <User className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold">{profile.name || "Your Profile"}</h2>
                  <p className="text-xs text-muted-foreground">Complete your profile for accurate recommendations.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="glass-soft rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground">Name</p>
                  <p className="mt-1 font-medium">{profile.name || "Not set"}</p>
                </div>
                <div className="glass-soft rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground">Category</p>
                  <p className="mt-1 font-medium">{category}</p>
                </div>
              </div>
            </div>

            {/* Readiness */}
            <ExplainableResult
              title="Admission Readiness"
              value={readiness.level.replace(/_/g, " ")}
              howCalculated="Based on eligibility, academic, entrance, target, and profile completeness."
              whatItMeans={readiness.summary}
              accent={
                readiness.level === "STRONG"
                  ? "success"
                  : readiness.level === "MODERATE"
                    ? "default"
                    : "warning"
              }
              nextStep={
                readiness.level === "NEEDS_ATTENTION"
                  ? "Complete your profile and add entrance scores"
                  : readiness.level === "MODERATE"
                    ? "Add more data for better recommendations"
                    : undefined
              }
            />
          </motion.div>
        )}

        {/* Academics section */}
        {activeSection === "academics" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {academicPerf ? (
              <>
                <ExplainableResult
                  title="Class 12 Performance"
                  value={`${academicPerf.percentage.toFixed(1)}%`}
                  howCalculated={`Total: ${academicPerf.totalObtained}/${academicPerf.totalMaximum} across ${class12Subjects.length} subjects`}
                  whatItMeans={`${academicPerf.academicLevel.replace(/-/g, " ").toUpperCase()} level. Strongest: ${academicPerf.strongestSubject}, Weakest: ${academicPerf.weakestSubject}.`}
                  ruleVersion="1.0"
                />
                {tneaScore !== undefined && (
                  <ExplainableResult
                    title="TNEA Score"
                    value={`${tneaScore} / 200`}
                    howCalculated="Mathematics (100) + Physics (50) + Chemistry (50) = 200"
                    whatItMeans={
                      tneaScore >= 190
                        ? "Excellent — strong position for top colleges."
                        : tneaScore >= 180
                          ? "Good — competitive for many colleges."
                          : "Moderate — consider backup options."
                    }
                    ruleVersion="TNEA-2024"
                    accent={tneaScore >= 190 ? "success" : tneaScore >= 180 ? "default" : "warning"}
                  />
                )}
                <Button asChild variant="outline" className="glass-soft h-10 rounded-full border-0 text-sm">
                  <Link to="/school">
                    Manage academics
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                <BookOpen className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No academic data yet.</p>
                <Button asChild size="sm" className="rounded-full border-0 text-xs">
                  <Link to="/school">
                    Enter marks
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Targets section */}
        {activeSection === "targets" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {targetLadder.safe.length > 0 || targetLadder.target.length > 0 ? (
              <>
                {targetLadder.safe.length > 0 && (
                  <div className="glass rounded-2xl p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-300">
                      <Shield className="size-4" /> Safe Targets
                    </h3>
                    {targetLadder.safe.map((rec, i) => (
                      <div key={`safe-${i}`} className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{rec.collegeName}</p>
                          <p className="text-xs text-muted-foreground">{rec.courseName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{rec.studentScore} vs {rec.cutoffValue}</span>
                      </div>
                    ))}
                  </div>
                )}
                {targetLadder.target.length > 0 && (
                  <div className="glass rounded-2xl p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                      <Target className="size-4" /> Target
                    </h3>
                    {targetLadder.target.map((rec, i) => (
                      <div key={`target-${i}`} className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{rec.collegeName}</p>
                          <p className="text-xs text-muted-foreground">{rec.courseName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{rec.studentScore} vs {rec.cutoffValue}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button asChild variant="outline" className="glass-soft h-10 rounded-full border-0 text-sm">
                  <Link to="/dashboard">
                    View full targets
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                <Target className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No targets yet. Add academic data to see recommendations.</p>
                <Button asChild size="sm" className="rounded-full border-0 text-xs">
                  <Link to="/school">
                    Start with academics
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions section */}
        {activeSection === "actions" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {actionPlan.actions.length > 0 ? (
              <ActionPlanDisplay plan={actionPlan} />
            ) : (
              <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                <TrendingUp className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No actions yet. Complete your profile to see recommendations.</p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
