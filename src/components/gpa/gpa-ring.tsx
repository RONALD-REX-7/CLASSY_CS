import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { getRating } from "@/lib/gpa";
import { motion } from "framer-motion";
import { useId, type ReactNode } from "react";

interface GpaRingProps {
  /** GPA on the 0–10 scale. */
  gpa: number;
  /** Has at least one subject (false → dim empty ring). */
  hasData: boolean;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

/**
 * Circular GPA gauge.
 *
 * The stroke is a rating-colored gradient and animates its length with
 * framer-motion's `pathLength`. The readout counts up via a rAF hook.
 *
 * The center readout scales proportionally with the ring size so the score
 * and its "/10" denominator always sit comfortably inside the gauge. "/10"
 * is baseline-aligned with the score so it reads as an intentional
 * denominator, and the whole readout is optically centered.
 */
export function GpaRing({
  gpa,
  hasData,
  size = 232,
  strokeWidth = 18,
  children,
}: GpaRingProps) {
  const gradientId = useId().replace(/:/g, "");
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const pct = hasData ? Math.min(1, gpa / 10) : 0;
  const rating = getRating(gpa);
  const animatedGpa = useAnimatedNumber(hasData ? gpa : 0);

  /* Readout type sizes derived from the ring diameter. */
  const scoreSize = Math.round(size * 0.24); // 232 → 56px, 150 → 36px
  const denomSize = Math.max(10, Math.round(size * 0.07)); // 232 → 16px, 150 → 11px
  const captionSize = Math.max(9, Math.round(size * 0.05)); // 232 → 12px, 150 → 9px

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        hasData
          ? `GPA ${gpa.toFixed(2)} out of 10, rated ${rating.label}`
          : "GPA — no subjects added yet"
      }
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rating.ringFrom} />
            <stop offset="100%" stopColor={rating.ringTo} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-foreground/8 dark:text-white/10"
        />

        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={hasData ? `url(#${gradientId})` : "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={hasData ? undefined : "text-foreground/10"}
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${center}px ${center}px`,
            filter: hasData ? `drop-shadow(0 0 8px ${rating.glow})` : undefined,
          }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pct }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Center readout — optically centered, /10 baseline-aligned */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="flex items-baseline justify-center font-display leading-none tracking-tight tabular-nums">
            <span
              className="font-extrabold"
              style={{ fontSize: scoreSize, letterSpacing: "-0.02em" }}
            >
              {hasData ? animatedGpa.toFixed(2) : "—"}
            </span>
            <span
              className="ml-1 font-semibold text-muted-foreground"
              style={{ fontSize: denomSize }}
            >
              /10
            </span>
          </p>
          <p
            className="mt-1.5 font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            style={{ fontSize: captionSize }}
          >
            GPA
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
