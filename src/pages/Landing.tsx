import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { GradeChip } from "@/components/gpa/grade-chip";
import { GpaRing } from "@/components/gpa/gpa-ring";
import { RatingBadge } from "@/components/gpa/rating-badge";
import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { GRADES, GRADE_POINTS, RATINGS } from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardCopy,
  FileJson,
  FileText,
  GraduationCap,
  Gauge,
  Layers,
  Map,
  Save,
  ShieldCheck,
  Sparkles,
  SunMoon,
  Target,
  WifiOff,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Section helpers                                                     */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: EASE },
  };
}

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-500 dark:text-indigo-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero mock panel — a live-looking product shot from components        */
/* ------------------------------------------------------------------ */

/** Mini stat card inside the hero dashboard */
function DashboardCard({
  label,
  value,
  sub,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="glass-inset flex flex-col gap-2 rounded-2xl p-4 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg text-xs", color)}>
          {icon}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="font-display text-xl font-extrabold tracking-tight">{value}</p>
      {sub && <p className="text-[10px] leading-relaxed text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

/** Animated progress bar */
function AnimatedBar({ width, color, delay }: { width: string; color: string; delay: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ delay, duration: 0.8, ease: EASE }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}

/**
 * HeroPanel - animated mini-dashboard preview showing the full CLASSY product.
 */
function HeroPanel() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-emerald-500/10 blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        className="glass relative overflow-hidden rounded-3xl p-5 shadow-[0_30px_70px_-30px_rgba(58,84,180,0.4)] sm:p-6"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Your CLASSY Dashboard
            </p>
          </div>
          <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-3">
          <DashboardCard
            label="Class 12" value="92.4%" sub="Tamil Nadu · PCM"
            icon={<span className="text-indigo-500 dark:text-indigo-300"><BookOpen className="size-4" /></span>}
            color="bg-indigo-500/12" delay={0.35}
          />
          <DashboardCard
            label="TNEA Score" value="187/200" sub="M:95 · P:48 · C:44"
            icon={<span className="text-amber-600 dark:text-amber-300"><Target className="size-4" /></span>}
            color="bg-amber-500/12" delay={0.42}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          className="glass-inset mt-3 rounded-2xl p-4"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Subject Performance
          </p>
          <div className="space-y-3">
            {[
              { name: "Mathematics", pct: "95%", bar: "95%", color: "bg-indigo-500", grade: "A+" as const },
              { name: "Physics", pct: "96%", bar: "96%", color: "bg-sky-500", grade: "A+" as const },
              { name: "Chemistry", pct: "88%", bar: "88%", color: "bg-emerald-500", grade: "A" as const },
            ].map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <p className="min-w-0 flex-1 text-xs font-semibold">{s.name}</p>
                <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{s.pct}</span>
                <div className="w-20">
                  <AnimatedBar width={s.bar} color={s.color} delay={0.6 + i * 0.1} />
                </div>
                <GradeChip grade={s.grade} className="h-5 min-w-7 px-1.5 text-[10px]" />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
          className="mt-3 flex gap-2"
        >
          {[
            { label: "Safe", count: "2", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
            { label: "Target", count: "3", color: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
            { label: "Reach", count: "2", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.08, duration: 0.3 }}
              className={cn("flex-1 rounded-xl px-3 py-2 text-center", t.color)}
            >
              <p className="text-xs font-bold">{t.count}</p>
              <p className="text-[9px] font-semibold">{t.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/** Core product features - reuses the existing visual language. */
const FEATURES = [
  {
    icon: Layers,
    title: "Unlimited subjects",
    body: "Every subject, every semester - add as many as you need with zero limits.",
    tile: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  },
  {
    icon: Zap,
    title: "Live calculation",
    body: "GPA, weighted points and totals recompute the instant you type.",
    tile: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  },
  {
    icon: Save,
    title: "Autosaves locally",
    body: "Everything persists to your browser automatically. Close the tab, come back later.",
    tile: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
  {
    icon: FileJson,
    title: "Import & export JSON",
    body: "Back up your data or move it between devices with a clean JSON export.",
    tile: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
  },
  {
    icon: FileText,
    title: "Structured PDF reports",
    body: "Export a branded, structured PDF of your grade sheet - perfect for records or sharing.",
    tile: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  },
  {
    icon: ClipboardCopy,
    title: "Copy GPA in a click",
    body: "Share your average anywhere - copied to your clipboard with one tap.",
    tile: "bg-teal-500/12 text-teal-600 dark:text-teal-300",
  },
  {
    icon: Gauge,
    title: "Progress ring",
    body: "An animated circular gauge shows exactly where you stand at a glance.",
    tile: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
  },
  {
    icon: SunMoon,
    title: "Dark & light modes",
    body: "A luminous light theme and a calm dark theme - smoothly cross-faded.",
    tile: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Add your subjects",
    body: "Name each subject, set its credits, and pick a grade from the dropdown. No sign-up, no setup.",
  },
  {
    step: "02",
    title: "Watch it calculate",
    body: "GPA, weighted points and totals update live as you type — the ring fills and stats count up.",
  },
  {
    step: "03",
    title: "Save, share, export",
    body: "Everything autosaves locally. Export a structured PDF report, share your GPA, or print anytime.",
  },
];

/** Rating bands with display ranges (RATINGS is ordered high → low). */
const RATING_BANDS = RATINGS.map((rating, i) => {
  const bottom = rating.min;
  const top = i === 0 ? 10 : RATINGS[i - 1].min - 0.1;
  const fmt = (v: number) => v.toFixed(1).replace(".0", "");
  return { ...rating, range: `${fmt(bottom)} – ${fmt(top)}` };
});

/** The flow: from marks → admission planning. */
const ADMISSION_FLOW = [
  { icon: BookOpen, label: "Your Marks", desc: "Enter board & exam marks" },
  { icon: Target, label: "Eligibility", desc: "Check admission requirements" },
  { icon: Map, label: "Pathways", desc: "Discover TNEA, JEE, NEET routes" },
  { icon: GraduationCap, label: "College Targets", desc: "Safe / Target / Reach" },
  { icon: Zap, label: "What-If", desc: "Simulate improved scores" },
  { icon: FileText, label: "Action Plan", desc: "Know what to do next" },
];

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen overflow-x-clip"
    >
      <Background />
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pb-28 lg:pt-24">
          {/* Copy */}
          <div>
            <motion.div {...fadeUp(0.05)}>
              <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="size-3.5 text-indigo-500" />
                CLASSY — Academic-to-Admission Intelligence
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.12)}
              className="mt-5 font-display text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08] lg:text-6xl"
            >
              Understand your academics.
              <br />
              <span className="text-gradient">Plan your future.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.18)}
              className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base"
            >
              From marks to meaning, from scores to strategy. Calculate performance, check eligibility, discover realistic options, and plan your next step — all in one place.
            </motion.p>

            {/* Primary CTAs — School + College */}
            <motion.div
              {...fadeUp(0.24)}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="btn-grad h-12 w-full whitespace-nowrap rounded-full border-0 px-7 text-base text-white sm:w-auto"
              >
                <Link to="/school">
                  <GraduationCap className="size-4" />
                  School Student
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-soft h-12 w-full whitespace-nowrap rounded-full border-0 px-7 text-base sm:w-auto"
              >
                <Link to="/calculator">
                  <Calculator className="size-4" />
                  College Student
                </Link>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div {...fadeUp(0.3)} className="mt-4">
              <Link
                to="/admission"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
              >
                <Target className="size-4" />
                Explore Admissions
                <ArrowRight className="size-3.5" />
              </Link>
            </motion.div>

            <motion.ul
              {...fadeUp(0.36)}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"
            >
              <li className="flex items-center gap-1.5">
                <WifiOff className="size-3.5 text-sky-500" /> Works offline
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Data stays on your device
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" /> Instant updates
              </li>
            </motion.ul>
          </div>

          {/* Mock product panel */}
          <div className="mx-auto w-full max-w-[30.5rem] lg:max-w-none">
            <HeroPanel />
          </div>
        </div>
      </section>

      {/* =================== SCHOOL VS COLLEGE ======================== */}
      <section id="choose" className="scroll-mt-24 py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Choose your path"
            title={
              <>
                Built for <span className="text-gradient">school & college</span> students
              </>
            }
          />

          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2">
            {/* School */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              whileHover={{ y: -5 }}
              className="glass group rounded-3xl p-7 transition-shadow duration-300 hover:shadow-[0_20px_48px_-20px_rgba(58,84,180,0.4)]"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:text-indigo-300">
                <GraduationCap className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
                School
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Classes 10 – 12
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-indigo-400" />
                  Board-specific academic tracking (Tamil Nadu, CBSE, International)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-indigo-400" />
                  Strengths, weaknesses & percentage insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-indigo-400" />
                  JEE, NEET, TNEA pathway awareness
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-indigo-400" />
                  Admission planning for Class 12
                </li>
              </ul>
              <Button
                asChild
                className="mt-6 h-11 rounded-full border-0 text-sm font-semibold"
              >
                <Link to="/school">
                  Enter School
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            {/* College */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
              whileHover={{ y: -5 }}
              className="glass group rounded-3xl p-7 transition-shadow duration-300 hover:shadow-[0_20px_48px_-20px_rgba(58,84,180,0.4)]"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-emerald-500/12 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:text-emerald-300">
                <Calculator className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
                College
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Undergraduate Students
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-emerald-400" />
                  GPA calculator with credit-weighted average
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-emerald-400" />
                  CGPA across multiple semesters
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-emerald-400" />
                  Live calculation, autosave, PDF export
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block size-1.5 rounded-full bg-emerald-400" />
                  Performance rating & grade breakdown
                </li>
              </ul>
              <Button
                asChild
                variant="outline"
                className="glass-soft mt-6 h-11 rounded-full border-0 text-sm font-semibold"
              >
                <Link to="/calculator">
                  Enter College
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================== ADMISSION INTELLIGENCE ==================== */}
      <section className="scroll-mt-24 py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Admission Intelligence"
            title={
              <>
                From marks to <span className="text-gradient">admission</span>
              </>
            }
            sub="Understand your eligibility, discover realistic college options, simulate improvement, and plan your next step."
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 lg:grid-cols-6">
            {ADMISSION_FLOW.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                whileHover={{ y: -4 }}
                className="glass group flex flex-col items-center gap-3 rounded-2xl p-5 text-center"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 transition-transform duration-300 group-hover:scale-110 dark:text-indigo-300">
                  <step.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{step.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            className="mt-8 text-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass-soft h-11 rounded-full border-0 px-7 text-sm font-semibold"
            >
              <Link to="/admission">
                Explore Admissions
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ========================== FEATURES ========================== */}
      <section id="features" className="scroll-mt-24 py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why CLASSY"
            title={
              <>
                Everything you need, <span className="text-gradient">nothing you don't</span>
              </>
            }
          />

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.07, duration: 0.5, ease: EASE }}
                whileHover={{ y: -5 }}
                className="glass group rounded-2xl p-5 transition-shadow duration-300 hover:shadow-[0_20px_48px_-20px_rgba(58,84,180,0.4)]"
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl border border-white/50 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:border-white/10 ${feature.tile}`}
                >
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== GRADE SCALE ========================= */}
      <section id="scale" className="scroll-mt-24 py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Grade scale"
            title={
              <>
                The 10-point scale, <span className="text-gradient">mapped clearly</span>
              </>
            }
            sub="Every grade maps to a point value. Your GPA is the credit-weighted average of them all."
          />

          <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            {/* Formula card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="glass rounded-3xl p-7"
              id="formula"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                How it's computed
              </p>
              <p className="mt-5 font-display text-xl font-bold leading-relaxed tracking-tight sm:text-2xl">
                GPA = <span className="text-gradient">Σ (Credit × Grade point)</span>{" "}
                <span className="font-sans">÷</span> Σ (Credits)
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Each subject's grade point is multiplied by its credits, all
                weighted points are summed, then divided by the total credits.
                A subject worth 4 credits counts for more than one worth 2.
              </p>
              <div className="glass-inset mt-6 rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground">Worked example</p>
                <p className="mt-2 text-sm font-medium">
                  (4 cr × 9) + (3 cr × 7) + (4 cr × 10) = 97
                </p>
                <p className="mt-1 text-sm font-medium">
                  97 ÷ 11 credits = <span className="font-display font-bold text-indigo-600 dark:text-indigo-300">8.82 GPA</span>
                </p>
              </div>
            </motion.div>

            {/* Grade grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GRADES.map((grade, i) => (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: EASE }}
                  whileHover={{ y: -4 }}
                  className="glass flex flex-col items-center gap-2 rounded-2xl p-4"
                >
                  <GradeChip grade={grade} />
                  <p className="font-display text-lg font-bold tabular-nums">
                    {GRADE_POINTS[grade]}
                  </p>
                  <p className="-mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    points
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance rating bands */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mt-10"
          >
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              How your GPA is rated
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              {RATING_BANDS.map((band, i) => (
                <motion.div
                  key={band.key}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-4 text-center"
                >
                  <span
                    className="mx-auto block size-3 rounded-full"
                    style={{ background: band.ringFrom, boxShadow: `0 0 14px ${band.glow}` }}
                    aria-hidden="true"
                  />
                  <p className={cn("mt-2.5 font-display text-sm font-bold", band.text)}>
                    {band.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
                    {band.range}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= HOW IT WORKS ========================= */}
      <section id="how" className="scroll-mt-24 py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Three steps to <span className="text-gradient">clarity</span>
              </>
            }
            sub="No accounts, no installs — just open, add, and go."
          />

          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                className="glass relative rounded-3xl p-6"
              >
                <span className="font-display text-4xl font-extrabold text-indigo-500/25 dark:text-indigo-300/20">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 hidden size-6 -translate-y-1/2 text-indigo-400/60 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CTA ============================== */}
      <section className="py-14 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="btn-grad relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-14"
          >
            {/* decorative rings */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <Logo size={44} className="mx-auto" />
              <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Your academic journey, simplified.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-indigo-100 sm:text-base">
                Whether you're in school preparing for board exams or in college tracking your GPA — Classy helps you understand your performance and plan your next step.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full rounded-full border border-white/40 bg-white px-8 text-base font-bold text-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <Link to="/school">
                    <GraduationCap className="size-4" />
                    Start as School Student
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full border border-white/30 bg-white/10 px-8 text-base font-bold text-white transition-transform hover:scale-105 hover:bg-white/20 active:scale-95 sm:w-auto"
                >
                  <Link to="/calculator">
                    <Calculator className="size-4" />
                    Start as College Student
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs font-medium text-indigo-100/90">
                No sign-up · Free forever · Works offline
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}




