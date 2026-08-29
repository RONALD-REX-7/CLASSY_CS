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
