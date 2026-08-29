/**
 * JEE Planner — JEE Main + JEE Advanced planning.
 *
 * Features:
 *  - JEE Main score/percentile entry
 *  - Paper 1 / Paper 2A / Paper 2B selection
 *  - JEE Advanced eligibility check
 *  - IIT target planner
 *  - Board eligibility check (75% aggregate / top-20 percentile)
 *
 * All calculations deterministic. No fabricated data.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  evaluateJeeMainEligibility,
  checkJeeAdvancedQualification,
  JEE_MAIN_PAPERS,
} from "@/lib/admissions";
import { calculateAcademicPerformance } from "@/lib/school/engine";
import { DEMO_MODE_KEY } from "@/lib/demo-data";
import type { SchoolSubject } from "@/types/school";
import type { StudentProfile } from "@/types";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Compass,
  GraduationCap,
  Info,
  Landmark,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STORAGE = {
  demoMode: DEMO_MODE_KEY,
  subjects12: "classy.school.subjects.12",
  profile: "classy.profile.v1",
} as const;

export default function JEEPlanner() {
  const [isDemoMode, setIsDemoMode] = useLocalStorage<boolean>(STORAGE.demoMode, false);
  const [activeTab, setActiveTab] = useState<"main" | "advanced">("main");
  const [storedSubjects] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects12, []);
  const [storedProfile] = useLocalStorage<Partial<StudentProfile>>(STORAGE.profile, {});

  // JEE Main inputs
  const [paper, setPaper] = useState<string>("paper1");
  const [score, setScore] = useState("");
  const [percentile, setPercentile] = useState("");

  // JEE Advanced inputs
  const [jeeMainScore, setJeeMainScore] = useState("");
  const [jeeAdvScore, setJeeAdvScore] = useState("");

  const subjects = isDemoMode ? [] : storedSubjects;
  const profile = isDemoMode ? { name: "Demo Student", state: "Tamil Nadu" } as any : { ...{ name: "Student" } as any, ...storedProfile } as StudentProfile;

  const academicPerf = useMemo(
    () => (subjects.length > 0 ? calculateAcademicPerformance(subjects) : null),
    [subjects],
  );

  const aggregate = academicPerf?.percentage ?? 0;

  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
              JEE Planner
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="text-gradient">JEE Main & Advanced</span> Planning
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Track scores, check eligibility, and plan IIT/NIT targets.
            </p>
          </div>
          <Button
            variant={isDemoMode ? "default" : "outline"}
            size="sm"
            className="cursor-pointer gap-1.5 text-xs"
            onClick={() => setIsDemoMode(!isDemoMode)}
          >
            <Sparkles className="size-3.5" />
            {isDemoMode ? "Demo ON" : "Try Demo"}
          </Button>
        </motion.div>

        {/* Tab nav */}
        <div className="mb-6 flex gap-2">
          {[
            { id: "main" as const, label: "JEE Main", icon: Compass },
            { id: "advanced" as const, label: "JEE Advanced", icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`glass-soft flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-500/10 text-indigo-600 dark:bg-white/10 dark:text-indigo-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* JEE Main */}
        {activeTab === "main" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-4 font-display text-lg font-bold">JEE Main Score Entry</h2>

              {/* Paper selection */}
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { id: "paper1", label: "Paper 1 — B.E./B.Tech" },
                  { id: "paper2a", label: "Paper 2A — B.Arch" },
                  { id: "paper2b", label: "Paper 2B — B.Planning" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaper(p.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      paper === p.id
                        ? "bg-indigo-500 text-white"
                        : "glass-soft text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Score (out of 300)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    placeholder="e.g. 245"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="glass-soft"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Percentile (optional)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    placeholder="e.g. 98.5"
                    value={percentile}
                    onChange={(e) => setPercentile(e.target.value)}
                    className="glass-soft"
                  />
                </div>
              </div>

              {score && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 glass-inset rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Your JEE Main Score</span>
                    <span className="font-display text-xl font-extrabold text-indigo-600 dark:text-indigo-300">
                      {score} / 300
                    </span>
                  </div>
                  {percentile && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Percentile: {percentile}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Score = Physics + Chemistry + Mathematics (each out of 100)
                  </p>
                </motion.div>
              )}
            </div>

            {/* Board eligibility */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">Board Eligibility</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                JEE Main requires passing Class 12 with at least 5 subjects including PCM.
              </p>
              {aggregate > 0 ? (
                <div className={`flex items-center gap-2 text-sm font-semibold ${
                  aggregate >= 75 ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"
                }`}>
                  {aggregate >= 75 ? <CheckCircle className="size-4" /> : <Info className="size-4" />}
                  Class 12 Aggregate: {aggregate.toFixed(1)}%
                  {aggregate >= 75 ? " — Meets 75% threshold" : " — Below 75% threshold (check top-20 percentile route)"}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No Class 12 data found.{" "}
                  <Link to="/school" className="text-indigo-600 hover:underline dark:text-indigo-300">
                    Enter marks
                  </Link>
                </p>
              )}
            </div>

            {/* Quick links */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">Next Steps</h3>
              <div className="space-y-2">
                <Link
                  to="/school"
                  className="glass-soft flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-foreground/5"
                >
                  <span>Enter / Edit Class 12 Marks</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  to="/explore"
                  className="glass-soft flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-foreground/5"
                >
                  <span>Explore NIT/IIIT Courses</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* JEE Advanced */}
        {activeTab === "advanced" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* JEE Main qualification check */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-4 font-display text-lg font-bold">JEE Advanced Eligibility</h2>
              <p className="mb-4 text-xs text-muted-foreground">
                JEE Advanced is for IIT admission. You must first qualify through JEE Main.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    JEE Main Score (out of 300)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    placeholder="e.g. 245"
                    value={jeeMainScore}
                    onChange={(e) => setJeeMainScore(e.target.value)}
                    className="glass-soft"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    JEE Advanced Score (if available)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 120"
                    value={jeeAdvScore}
                    onChange={(e) => setJeeAdvScore(e.target.value)}
                    className="glass-soft"
                  />
                </div>
              </div>

              {jeeMainScore && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 glass-inset rounded-xl p-4"
                >
                  {Number(jeeMainScore) >= 180 ? (
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      <CheckCircle className="mr-1 inline size-4" />
                      Likely qualifies for JEE Advanced (top ~2,50,000 candidates)
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-amber-600 dark:text-amber-300">
                      <Info className="mr-1 inline size-4" />
                      May not qualify for JEE Advanced. Cutoff varies yearly.
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Board 75% check */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">IIT Board Requirements (2026)</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Must meet ONE of: 75% aggregate in Class 12 OR top-20 percentile in board.
              </p>
              {aggregate > 0 ? (
                <div className={`flex items-center gap-2 text-sm font-semibold ${
                  aggregate >= 75 ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"
                }`}>
                  {aggregate >= 75 ? <CheckCircle className="size-4" /> : <Info className="size-4" />}
                  Your aggregate: {aggregate.toFixed(1)}%
                  {aggregate >= 75 ? " — Meets 75% criterion" : " — Check top-20 percentile route for your board"}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No Class 12 data.{" "}
                  <Link to="/school" className="text-indigo-600 hover:underline dark:text-indigo-300">
                    Enter marks
                  </Link>
                </p>
              )}
              <div className="mt-3 glass-soft rounded-xl p-3 text-[10px] text-muted-foreground">
                <p className="font-semibold">Five-subject aggregate:</p>
                <p>Physics, Chemistry, Mathematics + Language + One elective</p>
                <p className="mt-1">Top-20 percentile is board-specific and announced by CBSE/boards after results.</p>
              </div>
            </div>

            {/* IIT targets */}
            {jeeAdvScore && Number(jeeAdvScore) > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-3 font-display text-base font-bold">IIT Target Planner</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  Qualified candidates must participate in the JoSAA counselling process.
                </p>
                <div className="glass-soft rounded-xl p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">JoSAA Counselling Steps:</p>
                  <ol className="mt-2 list-inside list-decimal space-y-1">
                    <li>Register on josaa.nic.in</li>
                    <li>Fill institute/course choices in preference order</li>
                    <li>Seat allotment based on rank and choices</li>
                    <li>Accept / float / slide choice</li>
                    <li>Report to allotted institute</li>
                  </ol>
                </div>
                <p className="mt-3 text-[10px] text-muted-foreground">
                  Classy is a planning tool, not the official JoSAA portal.
                </p>
              </div>
            )}

            {/* Quick links */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">Next Steps</h3>
              <div className="space-y-2">
                <Link
                  to="/school"
                  className="glass-soft flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-foreground/5"
                >
                  <span>Enter / Edit Class 12 Marks</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
                <Link
                  to="/explore"
                  className="glass-soft flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-foreground/5"
                >
                  <span>Explore IIT Courses</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
