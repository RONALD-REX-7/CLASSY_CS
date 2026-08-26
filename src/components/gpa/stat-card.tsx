import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  /** Optional suffix rendered with the value, e.g. " pts". */
  suffix?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile. */
  iconClass?: string;
  /** Tailwind classes for the numeric value. */
  valueClass?: string;
  hint?: ReactNode;
  delay?: number;
}

/**
 * Glass stat card with a gradient icon tile and a count-up value.
 * Used on the calculator summary panel for subjects / credits / points.
 */
export function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  iconClass = "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
  valueClass,
  hint,
  delay = 0,
}: StatCardProps) {
  const animated = useAnimatedNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-4 transition-shadow duration-300 hover:shadow-[0_16px_40px_-16px_rgba(58,84,180,0.35)]"
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl border border-white/50 dark:border-white/10",
            iconClass,
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "font-display text-xl font-bold tabular-nums leading-tight",
              valueClass,
            )}
          >
            {animated.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            {suffix && (
              <span className="ml-0.5 text-xs font-semibold text-muted-foreground">
                {suffix}
              </span>
            )}
          </p>
          {hint && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </motion.div>
  );
}
