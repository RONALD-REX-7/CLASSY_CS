import { getRating, type Rating } from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Target, TrendingUp, AlertTriangle, Rocket } from "lucide-react";

const RATING_ICONS: Record<Rating["key"], typeof Sparkles> = {
  excellent: Rocket,
  veryGood: Sparkles,
  good: TrendingUp,
  average: Target,
  needsImprovement: AlertTriangle,
};

/**
 * The GPA performance indicator chip:
 * Excellent / Very Good / Good / Average / Needs Improvement.
 * Each band has its own color, icon, and encouragement message.
 */
export function RatingBadge({
  gpa,
  hasData,
  showMessage = false,
  className,
}: {
  gpa: number;
  hasData: boolean;
  showMessage?: boolean;
  className?: string;
}) {
  const rating = getRating(gpa);

  if (!hasData) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <span className="glass-inset inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-muted-foreground">
          <Sparkles className="size-4" />
          Waiting for subjects
        </span>
        {showMessage && (
          <p className="text-sm text-muted-foreground">
            Add your first subject to reveal your GPA.
          </p>
        )}
      </div>
    );
  }

  const Icon = RATING_ICONS[rating.key];

  return (
    <div className={cn("space-y-1.5", className)}>
      <motion.span
        key={rating.key}
        initial={{ opacity: 0, y: 6, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-bold",
          rating.chip,
        )}
      >
        <Icon className="size-4" />
        {rating.label}
      </motion.span>
      {showMessage && (
        <motion.p
          key={`${rating.key}-msg`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className={cn("text-sm leading-5", rating.text)}
        >
          {rating.message}
        </motion.p>
      )}
    </div>
  );
}
