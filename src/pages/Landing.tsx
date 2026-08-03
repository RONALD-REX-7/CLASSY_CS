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
      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 26, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
        className="glass rounded-3xl p-7 shadow-[0_30px_70px_-30px_rgba(58,84,180,0.4)] sm:p-8"
      >
        {/* panel header — subtle, centered over the ring */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Semester Result
          </p>
        </div>

        {/* GPA ring — the focal point, perfectly centered */}
        <div className="mt-7 grid place-items-center">
          <GpaRing gpa={8.82} hasData size={150} strokeWidth={14} />
        </div>

        {/* rating + compact stats */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <RatingBadge gpa={8.82} hasData />
          <p className="text-xs font-medium tabular-nums text-muted-foreground">
            7 credits · 2 subjects
          </p>
        </div>

        {/* fake subject rows */}
        <div className="mt-6 space-y-2">
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
      className="min-h-screen"
    >
      <Background />
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pb-28 lg:pt-24">
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
              className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your GPA,
              <br />
              <span className="text-gradient">beautifully calculated.</span>
            </motion.h1>

            <motion.div
              {...fadeUp(0.2)}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="btn-grad h-12 whitespace-nowrap rounded-full border-0 px-7 text-base text-white"
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
                className="glass-soft h-12 whitespace-nowrap rounded-full border-0 px-7 text-base"
              >
                <Link to="/#scale">See the grade scale</Link>
              </Button>
            </motion.div>

            <motion.ul
              {...fadeUp(0.28)}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"
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

      {/* ========================== FEATURES ========================== */}
      <section id="features" className="scroll-mt-24 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Featured by SPIRIT"
            title={
              <>
                Just A <span className="text-gradient">CGPA Calculator.</span>
              </>
            }
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <section id="scale" className="scroll-mt-24 py-16 lg:py-24">
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

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
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
      <section id="how" className="scroll-mt-24 py-16 lg:py-24">
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

          <div className="mt-12 grid gap-5 md:grid-cols-3">
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
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="btn-grad relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-14"
          >
            {/* decorative rings */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <Logo size={44} className="mx-auto" />
              <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to see your GPA?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-indigo-100 sm:text-base">
                Open the calculator and add your first subject — your average
                appears instantly. Free, private, and offline-friendly.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 rounded-full border border-white/40 bg-white px-8 text-base font-bold text-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Link to="/calculator">
                  Open the calculator
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
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
