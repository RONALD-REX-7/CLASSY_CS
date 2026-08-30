/**
 * NEET Planner — NEET UG qualification and medical pathway planning.
 *
 * Features:
 *  - NEET score/percentile entry
 *  - Qualification check
 *  - Medical pathway overview (MBBS, BDS, AYUSH, Nursing)
 *  - Category-wise eligibility
 *
 * IMPORTANT: Qualifying NEET ≠ MBBS seat.
 * All calculations deterministic. No fabricated data.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEMO_MODE_KEY } from "@/lib/demo-data";
import {
  ArrowRight,
  Heart,
  Info,
  Sparkles,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STORAGE = { demoMode: DEMO_MODE_KEY } as const;

const MEDICAL_PATHWAYS = [
  {
    title: "MBBS",
    full: "Bachelor of Medicine, Bachelor of Surgery",
    duration: "5.5 years",
    desc: "Primary medical degree. Requires NEET qualification. Admission through MCC/state counselling.",
    colour: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
  },
  {
    title: "BDS",
    full: "Bachelor of Dental Surgery",
    duration: "5 years",
    desc: "Dental surgery degree. Requires NEET qualification. Separate counselling via MCC/state.",
    colour: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  },
  {
    title: "AYUSH",
    full: "Ayurveda, Yoga, Unani, Siddha, Homeopathy",
    duration: "5.5 years",
    desc: "Alternative medicine pathways. NEET score used for AYUSH counselling.",
    colour: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
  {
    title: "Nursing",
    full: "B.Sc Nursing",
    duration: "4 years",
    desc: "Nursing sciences. Some states accept NEET scores; others have separate entrance.",
    colour: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
  },
  {
    title: "Allied Health",
    full: "Allied Health Sciences",
    duration: "3-4 years",
    desc: "Physiotherapy, Occupational Therapy, Radiology, etc. Varies by institution.",
    colour: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  },
];

export default function NEETPlanner() {
  const [isDemoMode, setIsDemoMode] = useLocalStorage<boolean>(STORAGE.demoMode, false);
  const [score, setScore] = useState("");
  const [percentile, setPercentile] = useState("");
  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [biology, setBiology] = useState("");

  const totalScore = (Number(physics) || 0) + (Number(chemistry) || 0) + (Number(biology) || 0);

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
              NEET Planner
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="text-gradient">NEET UG</span> Planning
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Track scores, check qualification, and explore medical pathways.
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

        {/* Score entry */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 glass rounded-2xl p-6"
        >
          <h2 className="mb-4 font-display text-lg font-bold">NEET Score Entry</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Physics (out of 180)
              </label>
              <Input
                type="number"
                min={0}
                max={180}
                placeholder="e.g. 140"
                value={physics}
                onChange={(e) => setPhysics(e.target.value)}
                className="glass-soft"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Chemistry (out of 180)
              </label>
              <Input
                type="number"
                min={0}
                max={180}
                placeholder="e.g. 135"
                value={chemistry}
                onChange={(e) => setChemistry(e.target.value)}
                className="glass-soft"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Biology (out of 360)
              </label>
              <Input
                type="number"
                min={0}
                max={360}
                placeholder="e.g. 300"
                value={biology}
                onChange={(e) => setBiology(e.target.value)}
                className="glass-soft"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Total Score (or enter directly)
              </label>
              <Input
                type="number"
                min={0}
                max={720}
                placeholder="e.g. 580"
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
                placeholder="e.g. 97.2"
                value={percentile}
                onChange={(e) => setPercentile(e.target.value)}
                className="glass-soft"
              />
            </div>
          </div>

          {/* Score result */}
          {(totalScore > 0 || score) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 glass-inset rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Your NEET Score</span>
                <span className="font-display text-xl font-extrabold text-indigo-600 dark:text-indigo-300">
                  {score || totalScore} / 720
                </span>
              </div>
              {percentile && (
                <p className="mt-1 text-xs text-muted-foreground">Percentile: {percentile}</p>
              )}

              {/* Qualification indicator */}
              <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
                (Number(score) || totalScore) >= 550
                  ? "text-emerald-600 dark:text-emerald-300"
                  : (Number(score) || totalScore) >= 400
                    ? "text-indigo-600 dark:text-indigo-300"
                    : (Number(score) || totalScore) >= 137
                      ? "text-amber-600 dark:text-amber-300"
                      : "text-red-600 dark:text-red-300"
              }`}>
                {(Number(score) || totalScore) >= 550
                  ? "Strong score — competitive for top medical colleges"
                  : (Number(score) || totalScore) >= 400
                    ? "Good score — likely qualifies for many options"
                    : (Number(score) || totalScore) >= 137
                      ? "May qualify — depends on category and cutoff"
                      : "Below typical qualification range"}
              </div>

              <div className="mt-2 text-[10px] text-muted-foreground">
                <p>NEET Total = Physics (180) + Chemistry (180) + Biology (360) = 720</p>
                <p className="mt-1">
                  Qualifying NEET does NOT guarantee MBBS admission. Admission depends on rank, category, counselling, and seat availability.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Medical pathways */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="mb-4 font-display text-lg font-bold">Medical Pathways</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEDICAL_PATHWAYS.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-9 place-items-center rounded-xl ${path.colour}`}>
                    <Heart className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold">{path.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{path.duration}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {path.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="glass-soft flex items-start gap-3 rounded-xl px-4 py-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <span>
            NEET qualification is separate from medical admission. Competitive ranks, category cutoffs, and counselling determine actual seat allocation.
            Classy is a planning tool — not the official NEET/MCC portal.
          </span>
        </div>

        {/* Quick links */}
        <div className="mt-6 glass rounded-2xl p-6">
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
              <span>Explore Medical Courses</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
