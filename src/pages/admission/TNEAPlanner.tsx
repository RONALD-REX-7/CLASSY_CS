/**
 * TNEA Planner — fully functional admission planning tool.
 *
 * Features:
 *  - TNEA Score Calculator (M=100, P=50, C=50, Total=200)
 *  - Eligibility check using the rule engine
 *  - Target ladder (Safe / Target / Reach)
 *  - Choice-list builder (add, remove, reorder)
 *  - Counselling stages overview
 *  - Document checklist
 *
 * All calculations are deterministic. Demo data is clearly labelled.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  calculateTneaScore,
  evaluateTneaEligibility,
  TNEA_CATEGORIES,
} from "@/lib/admissions";
import { calculateAcademicPerformance } from "@/lib/school/engine";
import {
  DEMO_LABEL,
  DEMO_MODE_KEY,
  DEMO_CLASS12_SUBJECTS,
  DEMO_PROFILE,
  DEMO_TNEA_SCORE,
  DEMO_TARGET_LADDER,
} from "@/lib/demo-data";
import type { SchoolSubject } from "@/types/school";
import type { TargetLadder } from "@/types/college";
import type { StudentProfile } from "@/types";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle,
  Info,
  ListChecks,
  Map,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Storage keys                                                        */
/* ------------------------------------------------------------------ */

const STORAGE = {
  demoMode: DEMO_MODE_KEY,
  subjects12: "classy.school.subjects.12",
  profile: "classy.profile.v1",
  tneaCategory: "classy.admissions.tnea.category",
  choiceList: "classy.admissions.tnea.choices",
} as const;

/* ------------------------------------------------------------------ */
/* Choice list item type                                               */
/* ------------------------------------------------------------------ */

type ChoiceList = ChoiceItem[];

interface ChoiceItem {
  id: string;
  college: string;
  branch: string;
}

/* ------------------------------------------------------------------ */
/* Counselling stages                                                  */
/* ------------------------------------------------------------------ */

const COUNSELLING_STAGES = [
  { stage: "Registration", desc: "Register on tneaonline.org with required details", done: true },
  { stage: "Document Upload", desc: "Upload 10th, 12th marksheets and certificates", done: true },
  { stage: "Verification", desc: "Certificate verification at designated centres", done: false },
  { stage: "Rank List", desc: "TNEA rank list published based on reduced scores", done: false },
  { stage: "Counselling Round", desc: "Seat allocation based on rank and choices", done: false },
  { stage: "Choice Filling", desc: "Fill college/branch preferences in order", done: false },
  { stage: "Allotment", desc: "Seat allotment result published", done: false },
  { stage: "Confirmation", desc: "Confirm allotment and pay tuition fee", done: false },
  { stage: "Reporting", desc: "Report to allotted college with original documents", done: false },
];

/* ------------------------------------------------------------------ */
/* Document checklist                                                  */
/* ------------------------------------------------------------------ */

const DOCUMENTS = [
  { name: "10th Marksheet", mandatory: true },
  { name: "12th / HSC Marksheet", mandatory: true },
  { name: "Transfer Certificate", mandatory: true },
  { name: "Community Certificate", mandatory: false, note: "Required for reservation" },
  { name: "Nativity Certificate", mandatory: false, note: "For state domicile proof" },
  { name: "Income Certificate", mandatory: false, note: "For fee concession / scholarship" },
  { name: "First Graduate Certificate", mandatory: false, note: "For first-generation graduate quota" },
  { name: "Government School Certificate", mandatory: false, note: "For 7.5% Govt school reservation" },
  { name: "Aadhaar Card", mandatory: true },
  { name: "TNEA Registration Acknowledgement", mandatory: true },
];

/* ------------------------------------------------------------------ */
/* Demo choice list                                                    */
/* ------------------------------------------------------------------ */

const DEMO_CHOICES: ChoiceItem[] = [
  { id: "c1", college: "College of Engineering, Guindy (CEG)", branch: "ECE" },
  { id: "c2", college: "MIT Campus, Anna University", branch: "ECE" },
  { id: "c3", college: "PSG College of Technology", branch: "CSE" },
  { id: "c4", college: "SSN College of Engineering", branch: "ECE" },
  { id: "c5", college: "Kumaraguru College of Technology", branch: "CSE" },
];

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function TNEAPlanner() {
  const [isDemoMode, setIsDemoMode] = useLocalStorage<boolean>(STORAGE.demoMode, false);
  const [activeTab, setActiveTab] = useState<"score" | "targets" | "choices" | "guide">("score");
  const [category, setCategory] = useLocalStorage<string>(STORAGE.tneaCategory, "OC");
  const [storedSubjects] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects12, []);
  const [storedProfile] = useLocalStorage<Partial<StudentProfile>>(STORAGE.profile, {});
  const [choiceList, setChoiceList] = useLocalStorage<ChoiceItem[]>(STORAGE.choiceList, []);

  // Mark inputs
  const [mathMarks, setMathMarks] = useState("");
  const [physicsMarks, setPhysicsMarks] = useState("");
  const [chemistryMarks, setChemistryMarks] = useState("");

  // New choice form
  const [newCollege, setNewCollege] = useState("");
  const [newBranch, setNewBranch] = useState("");

  // Use demo data or real data
  const subjects = isDemoMode ? DEMO_CLASS12_SUBJECTS : storedSubjects;
  const profile = isDemoMode
    ? DEMO_PROFILE
    : ({ ...DEMO_PROFILE, ...storedProfile, id: storedProfile.id || "user-profile" } as StudentProfile);
  const choices = isDemoMode ? DEMO_CHOICES : choiceList;

  // Calculate TNEA score from input marks or from subjects
  const tneaResult = useMemo(() => {
    if (mathMarks && physicsMarks && chemistryMarks) {
      // Use manual input
      const inputSubjects: SchoolSubject[] = [
        { id: "input-math", name: "Mathematics", category: "core", maxMarks: 100, obtainedMarks: Number(mathMarks) || 0 },
        { id: "input-physics", name: "Physics", category: "core", maxMarks: 100, obtainedMarks: Number(physicsMarks) || 0 },
        { id: "input-chemistry", name: "Chemistry", category: "core", maxMarks: 100, obtainedMarks: Number(chemistryMarks) || 0 },
      ];
      return calculateTneaScore(inputSubjects);
    }
    // Use saved subjects
    return subjects.length > 0 ? calculateTneaScore(subjects) : null;
  }, [mathMarks, physicsMarks, chemistryMarks, subjects]);

  const tneaScore = tneaResult?.value ?? (isDemoMode ? DEMO_TNEA_SCORE : undefined);

  // Academic performance
  const academicPerf = useMemo(
    () => (subjects.length > 0 ? calculateAcademicPerformance(subjects) : null),
    [subjects],
  );

  // Eligibility
  const eligibility = useMemo(() => {
    if (!profile || subjects.length === 0) return null;
    return evaluateTneaEligibility(profile, academicPerf as any, subjects, category as any);
  }, [profile, subjects, category, academicPerf]);

  // Target ladder (demo or computed)
  const targetLadder: TargetLadder = isDemoMode
    ? DEMO_TARGET_LADDER
    : tneaScore !== undefined
      ? {
          safe: tneaScore >= 185
            ? [{ collegeId: "1" as any, collegeName: "Local Engineering College", courseName: "ECE", classification: "SAFE" as const, studentScore: tneaScore, cutoffValue: 160, scoreGap: tneaScore - 160, authority: "TNEA", sources: ["Historical"], explanation: "Demo target", courseId: "c1" as any, admissionPath: "tnea", category: category, eligibilityPassed: true }]
            : [],
          target: tneaScore >= 170
            ? [{ collegeId: "2" as any, collegeName: "Regional Engineering College", courseName: "CSE", classification: "TARGET" as const, studentScore: tneaScore, cutoffValue: 175, scoreGap: tneaScore - 175, authority: "TNEA", sources: ["Historical"], explanation: "Demo target", courseId: "c2" as any, admissionPath: "tnea", category: category, eligibilityPassed: true }]
            : [],
          reach: [{ collegeId: "3" as any, collegeName: "Top Engineering College", courseName: "CSE", classification: "REACH" as const, studentScore: tneaScore, cutoffValue: 195, scoreGap: tneaScore - 195, authority: "TNEA", sources: ["Historical"], explanation: "Demo target", courseId: "c3" as any, admissionPath: "tnea", category: category, eligibilityPassed: true }],
          backup: [],
        }
      : { safe: [], target: [], reach: [], backup: [] };

  // Choice list handlers
  const addChoice = useCallback(() => {
    if (!newCollege.trim() || !newBranch.trim()) return;
    const item: ChoiceItem = {
      id: `choice-${Date.now()}`,
      college: newCollege.trim(),
      branch: newBranch.trim().toUpperCase(),
    };
    setChoiceList((prev: ChoiceItem[]) => [...prev, item]);
    setNewCollege("");
    setNewBranch("");
  }, [newCollege, newBranch, setChoiceList]);

  const removeChoice = useCallback(
    (id: string) => {
      setChoiceList((prev: ChoiceItem[]) => prev.filter((ch: ChoiceItem) => ch.id !== id));
    },
    [setChoiceList],
  );

  const moveChoice = useCallback(
    (id: string, direction: "up" | "down") => {
      setChoiceList((prev: ChoiceItem[]) => {
        const idx = prev.findIndex((ch: ChoiceItem) => ch.id === id);
        if (idx === -1) return prev;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
        return next;
      });
    },
    [setChoiceList],
  );

  const tabs = [
    { id: "score" as const, label: "Score", icon: Target },
    { id: "targets" as const, label: "Targets", icon: Map },
    { id: "choices" as const, label: "Choices", icon: ListChecks },
    { id: "guide" as const, label: "Guide", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
        {/* Demo banner */}
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
              TNEA Planner
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tamil Nadu <span className="text-gradient">Engineering Admissions</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Score calculator, eligibility check, target ladder, choice-list builder, and counselling guide.
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
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6 flex gap-2 overflow-x-auto pb-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`glass-soft flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-500/10 text-indigo-600 dark:bg-white/10 dark:text-indigo-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </motion.nav>

        {/* Score Tab */}
        {activeTab === "score" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Score calculator */}
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-4 font-display text-lg font-bold tracking-tight">
                TNEA Score Calculator
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Score structure: Mathematics (100) + Physics (50) + Chemistry (50) = 200
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Mathematics (out of 100)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder={subjects.find((s) => s.name.toLowerCase().includes("math"))?.obtainedMarks?.toString() || "92"}
                    value={mathMarks}
                    onChange={(e) => setMathMarks(e.target.value)}
                    className="glass-soft"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">Contributes 100 points</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Physics (out of 100)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder={subjects.find((s) => s.name.toLowerCase().includes("physics"))?.obtainedMarks?.toString() || "88"}
                    value={physicsMarks}
                    onChange={(e) => setPhysicsMarks(e.target.value)}
                    className="glass-soft"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">Contributes 50 points (halved)</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Chemistry (out of 100)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder={subjects.find((s) => s.name.toLowerCase().includes("chem"))?.obtainedMarks?.toString() || "85"}
                    value={chemistryMarks}
                    onChange={(e) => setChemistryMarks(e.target.value)}
                    className="glass-soft"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground">Contributes 50 points (halved)</p>
                </div>
              </div>

              {/* Score result */}
              {tneaResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 glass-inset rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Your TNEA Score</p>
                      <p className="mt-1 font-display text-3xl font-extrabold text-indigo-600 dark:text-indigo-300">
                        {tneaResult.value}
                        <span className="text-lg text-muted-foreground"> / {tneaResult.maxValue}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground">Rating</p>
                      <p className={`mt-1 font-display text-lg font-bold ${
                        tneaResult.value >= 190 ? "text-emerald-600 dark:text-emerald-300" :
                        tneaResult.value >= 180 ? "text-indigo-600 dark:text-indigo-300" :
                        tneaResult.value >= 170 ? "text-amber-600 dark:text-amber-300" :
                        "text-red-600 dark:text-red-300"
                      }`}>
                        {tneaResult.value >= 190 ? "Excellent" :
                         tneaResult.value >= 180 ? "Very Good" :
                         tneaResult.value >= 170 ? "Good" :
                         tneaResult.value >= 150 ? "Average" : "Needs Improvement"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                    <span>Math: {tneaResult.audit.intermediateValues.math_score?.toFixed(1)}</span>
                    <span>Physics: {tneaResult.audit.intermediateValues.physics_score?.toFixed(1)}</span>
                    <span>Chemistry: {tneaResult.audit.intermediateValues.chemistry_score?.toFixed(1)}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Category selector */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">Category / Community</h3>
              <div className="flex flex-wrap gap-2">
                {TNEA_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      category === cat
                        ? "bg-indigo-500 text-white"
                        : "glass-soft text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Eligibility result */}
            {eligibility && (
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-3 font-display text-base font-bold">Eligibility</h3>
                <div className={`flex items-center gap-2 text-sm font-semibold ${
                  eligibility.status === "ELIGIBLE"
                    ? "text-emerald-600 dark:text-emerald-300"
                    : eligibility.status === "NOT_ELIGIBLE"
                      ? "text-red-600 dark:text-red-300"
                      : "text-amber-600 dark:text-amber-300"
                }`}>
                  {eligibility.status === "ELIGIBLE" ? <CheckCircle className="size-4" /> : <Info className="size-4" />}
                  {eligibility.status.replace(/_/g, " ")}
                </div>
                {eligibility.reasons.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {eligibility.reasons.map((r, i) => (
                      <p key={i} className="text-xs text-muted-foreground">{r}</p>
                    ))}
                  </div>
                )}
                {eligibility.sources.length > 0 && (
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Source: {eligibility.sources.join(", ")}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Targets Tab */}
        {activeTab === "targets" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {tneaScore !== undefined ? (
              <>
                {/* Score summary */}
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs font-semibold text-muted-foreground">Your TNEA Score</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
                    {tneaScore} / 200
                  </p>
                </div>

                {/* Target ladder */}
                {[
                  { label: "Safe", items: targetLadder.safe, color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-500/10" },
                  { label: "Target", items: targetLadder.target, color: "text-indigo-600 dark:text-indigo-300", bg: "bg-indigo-500/10" },
                  { label: "Reach", items: targetLadder.reach, color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-500/10" },
                  { label: "Backup", items: targetLadder.backup, color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-500/10" },
                ].map((group) =>
                  group.items.length > 0 ? (
                    <div key={group.label} className="glass rounded-2xl p-5">
                      <h3 className={`mb-3 flex items-center gap-2 text-sm font-bold ${group.color}`}>
                        <span className={`size-2 rounded-full ${group.bg}`} />
                        {group.label} ({group.items.length})
                      </h3>
                      {group.items.map((rec, i) => (
                        <div
                          key={`${group.label}-${i}`}
                          className="flex items-center justify-between border-b border-border/40 py-2.5 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{rec.collegeName}</p>
                            <p className="text-xs text-muted-foreground">{rec.courseName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {rec.studentScore} vs {rec.cutoffValue}
                            </span>
                            <span className={`text-[10px] font-bold ${
                              (rec.studentScore - rec.cutoffValue) > 0 ? "text-emerald-600" : "text-red-600"
                            }`}>
                              {rec.scoreGap > 0 ? `+${rec.scoreGap}` : rec.scoreGap}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null,
                )}

                {targetLadder.safe.length === 0 && targetLadder.target.length === 0 && targetLadder.reach.length === 0 && (
                  <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                    <Target className="size-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Enter your marks in the Score tab to see target recommendations.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                <Target className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No score data available. Enter your Class 12 marks in the Score tab.
                </p>
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

        {/* Choices Tab */}
        {activeTab === "choices" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Info */}
            <div className="glass-soft flex items-start gap-3 rounded-xl px-4 py-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-indigo-500" />
              <span>
                <span className="font-semibold text-foreground">Choice order matters during counselling.</span>{" "}
                Arrange your preferences in the order you want them considered. This is a planning tool — not the official TNEA choice-filling portal.
              </span>
            </div>

            {/* Add choice form */}
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-display text-base font-bold">Add Choice</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="College name"
                  value={newCollege}
                  onChange={(e) => setNewCollege(e.target.value)}
                  className="glass-soft flex-1"
                />
                <Input
                  placeholder="Branch (e.g. ECE)"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="glass-soft w-28"
                />
                <Button
                  onClick={addChoice}
                  disabled={!newCollege.trim() || !newBranch.trim()}
                  className="btn-grad gap-1.5 rounded-full border-0 text-xs text-white"
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>
            </div>

            {/* Choice list */}
            {choices.length > 0 ? (
              <div className="glass rounded-2xl p-5">
                <h3 className="mb-3 font-display text-base font-bold">
                  My Preference List ({choices.length})
                </h3>
                <div className="space-y-2">
                  {choices.map((choice: ChoiceItem, idx: number) => (
                    <div
                      key={choice.id}
                      className="glass-soft flex items-center gap-3 rounded-xl px-4 py-3"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{choice.college}</p>
                        <p className="text-xs text-muted-foreground">{choice.branch}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveChoice(choice.id, "up")}
                          disabled={idx === 0}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/5 disabled:opacity-30"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          onClick={() => moveChoice(choice.id, "down")}
                          disabled={idx === choices.length - 1}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/5 disabled:opacity-30"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          onClick={() => removeChoice(choice.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                <ListChecks className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No choices yet. Add your preferred college/branch combinations above.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Guide Tab */}
        {activeTab === "guide" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Counselling stages */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 font-display text-base font-bold">TNEA Counselling Process</h3>
              <div className="space-y-0">
                {COUNSELLING_STAGES.map((stage, i) => (
                  <div key={stage.stage} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        stage.done
                          ? "bg-emerald-500 text-white"
                          : "bg-foreground/10 text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      {i < COUNSELLING_STAGES.length - 1 && (
                        <div className="w-px flex-1 bg-foreground/10" />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-semibold">{stage.stage}</p>
                      <p className="text-xs text-muted-foreground">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document checklist */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-4 font-display text-base font-bold">Document Checklist</h3>
              <div className="space-y-2">
                {DOCUMENTS.map((doc) => (
                  <div key={doc.name} className="glass-soft flex items-center gap-3 rounded-xl px-4 py-2.5">
                    <CheckCircle className={`size-4 shrink-0 ${
                      doc.mandatory ? "text-indigo-500" : "text-muted-foreground/50"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      {doc.note && <p className="text-[10px] text-muted-foreground">{doc.note}</p>}
                    </div>
                    {doc.mandatory && (
                      <span className="shrink-0 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-3 font-display text-base font-bold">Useful Links</h3>
              <div className="space-y-2">
                <a
                  href="https://www.tneaonline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-soft flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-foreground/5"
                >
                  <span>TNEA Official Portal</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </a>
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
                  <span>Explore Engineering Courses</span>
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
