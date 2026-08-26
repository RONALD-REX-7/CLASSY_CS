import { GradeChip } from "@/components/gpa/grade-chip";
import { GRADES, type Subject } from "@/lib/gpa";
import { motion } from "framer-motion";

/**
 * Grade distribution panel — one tile per grade with a count and an
 * animated proportional bar, so users can see how their semester breaks
 * down at a glance.
 */
export function GradeBreakdown({ subjects }: { subjects: Subject[] }) {
  const counts = GRADES.map((grade) => ({
    grade,
    count: subjects.filter((s) => s.grade === grade).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold tracking-tight">
          Grade breakdown
        </h3>
        <span className="text-xs font-medium text-muted-foreground">
          {subjects.length} subject{subjects.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map(({ grade, count }, i) => (
          <motion.div
            key={grade}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
            className="glass-inset rounded-xl p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <GradeChip grade={grade} className="h-6 min-w-8 px-2 text-xs" />
              <span className="font-display text-sm font-bold tabular-nums">
                {count}
              </span>
            </div>
            <div
              className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-foreground/10"
              role="img"
              aria-label={`${grade}: ${count} subject${count === 1 ? "" : "s"}`}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(count / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 + i * 0.04 }}
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
