import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

/**
 * Empty-state illustration + copy, shown when there are no subjects yet.
 * The illustration is a hand-drawn glassy "grade sheet" with a sparkle.
 */
export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-12 text-center"
    >
      {/* Illustration */}
      <div className="relative mb-6" aria-hidden="true">
        <svg width="168" height="132" viewBox="0 0 168 132" fill="none">
          {/* glow */}
          <ellipse cx="84" cy="122" rx="64" ry="10" fill="url(#es-glow)" />
          <defs>
            <linearGradient id="es-glow" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="rgba(99,102,241,0.35)" />
              <stop offset="1" stopColor="rgba(99,102,241,0)" />
            </linearGradient>
            <linearGradient id="es-sheet" x1="0" y1="0" x2="168" y2="132">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#e6ecff" />
            </linearGradient>
          </defs>

          {/* floating sheet */}
          <motion.g
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="34" y="14" width="100" height="110" rx="14" fill="url(#es-sheet)" stroke="rgba(99,102,241,0.28)" />
            {/* folded corner */}
            <path d="M106 14 h14 a14 14 0 0 1 14 14 v0 L106 28 Z" fill="rgba(99,102,241,0.12)" />
            {/* grade lines */}
            <rect x="50" y="38" width="68" height="8" rx="4" fill="#6366f1" opacity="0.85" />
            <rect x="50" y="56" width="52" height="8" rx="4" fill="#0ea5e9" opacity="0.7" />
            <rect x="50" y="74" width="60" height="8" rx="4" fill="#8b5cf6" opacity="0.55" />
            <rect x="50" y="92" width="40" height="8" rx="4" fill="#a5b4fc" opacity="0.4" />
            {/* badge */}
            <g>
              <circle cx="118" cy="44" r="17" fill="#4f46e5" stroke="#ffffff" strokeWidth="3" />
              <text x="118" y="49.5" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="11" fill="#ffffff">
                A+
              </text>
            </g>
          </motion.g>

          {/* sparkle */}
          <motion.path
            d="M148 26 L151 34 L159 37 L151 40 L148 48 L145 40 L137 37 L145 34 Z"
            fill="#fbbf24"
            animate={{ rotate: [0, 18, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "148px 37px" }}
          />
        </svg>
      </div>

      <h3 className="font-display text-xl font-bold">No subjects yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Add your first subject — name it, set the credits and grade, and your
        GPA will appear here instantly.
      </p>
      <Button onClick={onAdd} className="btn-grad mt-6 rounded-full border-0 px-5 text-white">
        <Plus className="size-4" />
        Add your first subject
      </Button>
    </motion.div>
  );
}
