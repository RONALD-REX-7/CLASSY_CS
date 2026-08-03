import type { Grade } from "@/lib/gpa";
import { cn } from "@/lib/utils";

/** Tailwind treatments per grade — cool, restrained, high-contrast. */
const GRADE_STYLES: Record<Grade, string> = {
  O: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "A+": "bg-teal-500/12 text-teal-700 dark:text-teal-300 border-teal-500/30",
  A: "bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/30",
  "B+": "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  B: "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/30",
  C: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/30",
  U: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30",
  AB: "bg-zinc-500/12 text-zinc-600 dark:text-zinc-300 border-zinc-500/30",
};

/**
 * Small pill that shows a grade with its signature color.
 * Colors double as a scannable cue for how strong the grade is.
 */
export function GradeChip({
  grade,
  className,
}: {
  grade: Grade;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-9 items-center justify-center rounded-full border px-2.5 font-display text-sm font-bold tabular-nums",
        GRADE_STYLES[grade],
        className,
      )}
    >
      {grade}
    </span>
  );
}
