import { cn } from "@/lib/utils";

/**
 * CLASSY_CS brand mark — a cool indigo→sky gradient tile with a white "C"
 * and a subtle ring arc (a nod to the GPA gauge).
 */
export function Logo({
  size = 34,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="classycs-mark" x1="4" y1="4" x2="36" y2="36">
          <stop stopColor="#4f46e5" />
          <stop offset="0.55" stopColor="#6366f1" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="url(#classycs-mark)" />
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="11"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      {/* ring accent */}
      <circle
        cx="27"
        cy="13"
        r="5.5"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="26 8.5"
        transform="rotate(120 27 13)"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="Sora, Manrope, sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="#ffffff"
      >
        C
      </text>
    </svg>
  );
}
