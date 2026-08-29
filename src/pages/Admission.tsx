/**
 * Admission page — central hub for TNEA, JEE, NEET eligibility, scoring, and planning.
 * This is a new additive page. Does not modify existing pages.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Compass,
  GraduationCap,
  Landmark,
  Map,
  Shield,
  Target,
  Zap,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Entrance exam / pathway cards */
const EXAMS = [
  {
    id: "tnea",
    title: "TNEA",
    subtitle: "Tamil Nadu Engineering Admissions",
    description: "Calculate your TNEA score (M=100, P=50, C=50, Total=200), check eligibility for Tamil Nadu engineering colleges, and explore realistic college targets.",
    icon: Landmark,
    color: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
    href: "/school",
    features: ["Score calculation", "Category handling", "College targets", "Cutoff analysis"],
  },
  {
    id: "jee-main",
    title: "JEE Main",
    subtitle: "Joint Entrance Examination — Main",
    description: "Track Paper 1 (B.E./B.Tech) and Paper 2 (B.Arch/B.Planning) scores, percentiles, and session data. JEE Advanced qualification check included.",
    icon: Compass,
    color: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
    href: "/school",
    features: ["Paper 1 & 2", "Percentile tracking", "Session data", "Advanced qualification"],
  },
  {
    id: "jee-advanced",
    title: "JEE Advanced",
    subtitle: "IIT Admission Qualification",
    description: "Understand IIT admission eligibility, top-20-percentile requirements, aggregate criteria, and Class XII board requirements.",
    icon: Award,
    color: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
    href: "/school",
    features: ["IIT eligibility", "75% aggregate", "Top-20-percentile", "Board requirements"],
  },
  {
    id: "neet",
    title: "NEET UG",
    subtitle: "National Eligibility cum Entrance Test",
    description: "Track Physics, Chemistry, Biology scores. Understand NEET qualification versus medical admission competitiveness.",
    icon: BookOpen,
    color: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
    href: "/school",
    features: ["Subject scores", "Qualification check", "Medical pathways", "Category rules"],
  },
];

/** Core admission features */
const FEATURES = [
  {
    icon: CheckCircle,
    title: "Eligibility Checker",
    desc: "Verify whether you meet admission requirements for any pathway based on your board, stream, and scores.",
  },
  {
    icon: Target,
    title: "Target Planner",
    desc: "See Safe / Target / Reach / Backup classifications based on your score versus historical cutoffs.",
  },
  {
    icon: Zap,
    title: "What-If Simulation",
    desc: "Clone your profile, improve marks, and see how your admission options change — without affecting real data.",
  },
  {
    icon: Map,
    title: "Multi-Pathway Comparison",
    desc: "Compare TNEA vs JEE Main vs JEE Advanced side by side — eligibility, scores, and opportunities.",
  },
];

export default function Admission() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
            Admission Intelligence
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Understand your <span className="text-gradient">admission options</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            From eligibility to college targets — explore TNEA, JEE, and NEET pathways. All calculations are deterministic with transparent rules.
          </p>
        </motion.div>

        {/* Exam cards */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="mb-4 font-display text-lg font-bold tracking-tight">
            Entrance Pathways
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {EXAMS.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                whileHover={{ y: -4 }}
                className="glass group rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_20px_48px_-20px_rgba(58,84,180,0.3)]"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${exam.color}`}
                  >
                    <exam.icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {exam.subtitle}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                      {exam.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {exam.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exam.features.map((f) => (
                    <span
                      key={f}
                      className="glass-soft inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-4 h-9 cursor-pointer gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  <Link to={exam.href}>
                    Open planner
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Admission features */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="mb-4 font-display text-lg font-bold tracking-tight">
            Admission Intelligence Features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE }}
                whileHover={{ y: -3 }}
                className="glass flex items-start gap-4 rounded-2xl p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:text-indigo-300">
                  <feature.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick navigation */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight">
              Start your admission journey
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Build your academic profile first, then explore pathways — your data flows through all modules.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild className="btn-grad h-11 rounded-full border-0 text-sm text-white">
                <Link to="/school">
                  <GraduationCap className="size-4" />
                  Build School Profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="glass-soft h-11 rounded-full border-0 text-sm">
                <Link to="/dashboard">
                  <Shield className="size-4" />
                  View Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Source transparency */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          className="mt-8 glass-soft flex items-center gap-3 rounded-xl px-4 py-3 text-xs text-muted-foreground"
        >
          <Shield className="size-4 shrink-0 text-emerald-500" />
          <span>
            All calculations are deterministic. No data is fabricated. External data carries source, authority, and verification status.
            Demo data is clearly labelled.
          </span>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
