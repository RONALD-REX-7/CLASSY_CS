import { Logo } from "@/components/logo";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";

/**
 * Branded splash shown very briefly while the calculator "loads".
 * Gives the app a premium, app-like feel instead of a hard paint-in.
 */
export function LoadingScreen() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-50 grid place-items-center bg-background"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Logo size={64} className="animate-floaty" />
        </motion.div>
        <div className="text-center">
          <p className="font-display text-lg font-bold tracking-tight">
            {APP_NAME}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Crunching your grades…
          </p>
        </div>
        {/* shimmer progress bar */}
        <div className="glass-inset h-1.5 w-44 overflow-hidden rounded-full">
          <div className="animate-shimmer h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(99,102,241,0.1),#6366f1,rgba(14,165,233,0.9),rgba(99,102,241,0.1))]" />
        </div>
      </div>
    </motion.div>
  );
}
