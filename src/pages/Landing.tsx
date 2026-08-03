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
  ClipboardCopy,
  FileJson,
  FileText,
  Gauge,
  Layers,
  Save,
  ShieldCheck,
  Sparkles,
  SunMoon,
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
/* Hero mock panel — a live-looking product shot built from components  */
/* ------------------------------------------------------------------ */

const MOCK_SUBJECTS = [
  { name: "Digital Signal Processing", credits: "4 CR", grade: "A+" as const },
  { name: "Signals & Systems", credits: "3 CR", grade: "B+" as const },
];

function HeroPanel() {
  return (
    <div className="relative">
      {/* Main panel — slightly tighter padding on mobile so the ring is the focus */}
      <motion.div
        initial={{ opacity: 0, y: 26, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
        className="glass rounded-3xl p-6 shadow-[0_30px_70px_-30px_rgba(58,84,180,0.4)] sm:p-8"
      >
        {/* panel header — subtle, centered over the ring */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
            Semester Result
          </p>
        </div>

        {/* GPA ring — the focal point, perfectly centered */}
        <div className="mt-6 grid place-items-center">
          <GpaRing gpa={8.82} hasData size={150} strokeWidth={14} />
        </div>

        {/* rating + compact stats */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <RatingBadge gpa={8.82} hasData />
          <p className="text-xs font-medium tabular-nums text-muted-foreground">
            7 credits · 2 subjects
          </p>
        </div>

        {/* fake subject rows — compact and easy to scan */}
        <div className="mt-5 space-y-2">
          {MOCK_SUBJECTS.map((row) => (
            <div
              key={row.name}
              className="glass-inset flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <p className="min-w-0 flex-1 truncate text-xs font-semibold">
                {row.name}
              </p>
              <span className="hidden rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
                {row.credits}
              </span>
              <GradeChip grade={row.grade} className="h-6 min-w-8 px-2 text-xs" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Layers,
    title: "Unlimited subjects",
    body: "Every subject, every semester — add as many as you need with zero limits.",
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
    body: "Export a branded, structured PDF of your grade sheet — perfect for records or sharing.",
    tile: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  },
  {
    icon: ClipboardCopy,
    title: "Copy GPA in a click",
    body: "Share your average anywhere — copied to your clipboard with one tap.",
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
    body: "A luminous light theme and a calm dark theme — smoothly cross-faded.",
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
        {/* Mobile: headline → CTAs → result card, stacked in one column.
            Desktop: unchanged two-column layout. */}
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pb-28 lg:pt-24">
          {/* Copy */}
          <div>
            <motion.div {...fadeUp(0.05)}>
              <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="size-3.5 text-indigo-500" />
                V11 · Local · No login/sign-up
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.12)}
              className="mt-5 font-display text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08] lg:text-6xl"
            >
              Your GPA,
              <br />
              <span className="text-gradient">beautifully calculated.</span>
            </motion.h1>

            {/* CTAs — full-width, thumb-friendly on mobile; inline on desktop */}
            <motion.div
              {...fadeUp(0.2)}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="btn-grad h-12 w-full whitespace-nowrap rounded-full border-0 px-7 text-base text-white sm:w-auto"
              >
                <Link to="/calculator">
                  Start calculating
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-soft h-12 w-full whitespace-nowrap rounded-full border-0 px-7 text-base sm:w-auto"
              >
                <Link to="/#scale">See the grade scale</Link>
              </Button>
            </motion.div>

            <motion.ul
              {...fadeUp(0.28)}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"
            >
              <li className="flex items-center gap-1.5">
                <WifiOff className="size-3.5 text-sky-500" /> Works offline
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Data stays on your device
              </li>
              <li className="flex items-center g

[FILE_TOO_LARGE]: The combined read_files output exceeded the 100,000 character hard limit. This file was truncated after 10,485 characters. Read it separately or use code_search for the relevant section.