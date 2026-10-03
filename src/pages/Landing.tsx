import { Footer } from "@/components/footer";
import { GradeChip } from "@/components/gpa/grade-chip";
import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Map,
  ShieldCheck,
  Target,
  TrendingUp,
  WifiOff,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5, ease: EASE },
  };
}

/* ------------------------------------------------------------------ */
/* Hero product preview — clean, functional, no decorative glass        */
/* ------------------------------------------------------------------ */

function HeroPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
      className="surface overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <p className="text-xs font-semibold text-muted-foreground">
            Your CLASSY Dashboard
          </p>
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">
          Example data
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-px bg-border/40">
        <div className="bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Class 12
          </p>
          <p className="mt-1 font-display text-xl font-bold">92.4%</p>
          <p className="text-[11px] text-muted-foreground">Tamil Nadu · PCM</p>
        </div>
        <div className="bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            TNEA Score
          </p>
          <p className="mt-1 font-display text-xl font-bold">187 / 200</p>
          <p className="text-[11px] text-muted-foreground">M:95 · P:48 · C:44</p>
        </div>
      </div>

      {/* Subject performance */}
      <div className="border-t border-border/60 bg-muted/30 px-5 py-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Subject Performance
        </p>
        <div className="space-y-2.5">
          {[
            { name: "Mathematics", pct: "95%", bar: "95%", color: "bg-primary", grade: "A+" as const },
            { name: "Physics", pct: "96%", bar: "96%", color: "bg-sky-500", grade: "A+" as const },
            { name: "Chemistry", pct: "88%", bar: "88%", color: "bg-emerald-500", grade: "A" as const },
          ].map((s, i) => (
            <div key={s.name} className="flex items-center gap-3">
              <p className="min-w-0 flex-1 text-xs font-medium">{s.name}</p>
              <span className="text-[10px] tabular-nums text-muted-foreground">{s.pct}</span>
              <div className="w-16">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: s.bar }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: EASE }}
                    className={cn("h-full rounded-full", s.color)}
                  />
                </div>
              </div>
              <GradeChip grade={s.grade} className="h-5 min-w-7 px-1.5 text-[10px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Target ladder */}
      <div className="flex border-t border-border/60">
        {[
          { label: "Safe", count: "2", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/8" },
          { label: "Target", count: "3", color: "text-primary bg-primary/8" },
          { label: "Reach", count: "2", color: "text-amber-600 dark:text-amber-400 bg-amber-500/8" },
        ].map((t) => (
          <div key={t.label} className={cn("flex-1 px-3 py-2.5 text-center", t.color)}>
            <p className="text-xs font-bold tabular-nums">{t.count}</p>
            <p className="text-[10px] font-medium">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Honest caption — the numbers above are a mock-up, not user data. */}
      <p className="border-t border-border/60 px-5 py-2.5 text-[10px] text-muted-foreground">
        Illustrative sample data — your own numbers appear once you add them.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Calculator,
    title: "GPA & CGPA Calculator",
    desc: "Credit-weighted calculation across semesters. Live updates, autosave, PDF export.",
  },
  {
    icon: BookOpen,
    title: "Academic Profile",
    desc: "Board-specific tracking for Tamil Nadu, CBSE, and international qualifications.",
  },
  {
    icon: Target,
    title: "Admission Eligibility",
    desc: "Check TNEA, JEE, and NEET requirements against your board and scores.",
  },
  {
    icon: Map,
    title: "College Targets",
    desc: "Safe / Target / Reach classifications based on historical cutoff data.",
  },
  {
    icon: TrendingUp,
    title: "What-If Simulation",
    desc: "See how improved scores change your admission options.",
  },
  {
    icon: Zap,
    title: "Entrance Pathways",
    desc: "Score calculators and eligibility checks for TNEA, JEE, NEET.",
  },
];

const ADMISSION_STEPS = [
  { label: "Enter Marks", desc: "Board & subject scores" },
  { label: "Check Eligibility", desc: "TNEA, JEE, NEET requirements" },
  { label: "Find Pathways", desc: "Admission routes available" },
  { label: "Target Colleges", desc: "Safe / Target / Reach" },
  { label: "Plan Next Steps", desc: "What to improve" },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="border-b border-border/40">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-20">
          {/* Copy */}
          <div>
            <motion.div {...fadeUp(0.05)}>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Student Academic Companion
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]"
            >
              Your academic record,
              <br />
              calculated and organized.
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              Calculate GPA, track semester performance, check admission
              eligibility, and discover college targets — all in one place.
            </motion.p>

            <motion.div
              {...fadeUp(0.2)}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                className="btn-grad h-10 rounded-md px-5 text-sm font-semibold text-white"
              >
                <Link to="/calculator">
                  Calculate GPA
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-md px-5 text-sm font-semibold"
              >
                <Link to="/school">
                  School Academic Record
                </Link>
              </Button>
            </motion.div>

            <motion.ul
              {...fadeUp(0.25)}
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground"
            >
              <li className="flex items-center gap-1.5">
                <WifiOff className="size-3.5" /> Offline
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Local data
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="size-3.5" /> No sign-up
              </li>
            </motion.ul>
          </div>

          {/* Product preview */}
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroPanel />
          </div>
        </div>
      </section>

      {/* ======================== PATHWAYS ============================ */}
      <section className="border-b border-border/40 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admission Intelligence
            </p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
              From marks to admission
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Understand eligibility, discover college options, and plan your next step.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ADMISSION_STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
                className="surface rounded-lg p-4"
              >
                <span className="mb-2 inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Link
              to="/admission"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Explore admission pathways
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================== FEATURES ========================== */}
      <section className="border-b border-border/40 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What CLASSY does
            </p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
              Built for students
            </h2>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
                className="surface rounded-lg p-5"
              >
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-muted">
                  <feature.icon className="size-4 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA ================================ */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="surface rounded-lg p-8 text-center sm:p-10"
          >
            <Logo size={36} className="mx-auto" />
            <h2 className="mt-4 font-display text-xl font-bold tracking-tight sm:text-2xl">
              Start calculating your GPA
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No account needed. Everything saves to your browser.
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="btn-grad h-10 rounded-md px-6 text-sm font-semibold text-white"
              >
                <Link to="/calculator">
                  Calculate GPA
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-md px-6 text-sm font-semibold"
              >
                <Link to="/school">
                  School Record
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
