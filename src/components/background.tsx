/**
 * Fixed, theme-aware backdrop used by every page.
 *
 * Light mode: bright cool gradient with drifting indigo/sky/violet orbs.
 * Dark mode: deep indigo gradient with dimmer, moodier orbs.
 * A faint blueprint grid fades out toward the bottom.
 */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-sky-100/80 via-indigo-50/60 to-violet-100/70 dark:from-[#101a3d] dark:via-[#0d1531] dark:to-[#171233]" />

      {/* drifting orbs */}
      <div className="absolute -top-32 -left-24 size-[480px] rounded-full bg-indigo-400/30 blur-3xl animate-blob dark:bg-indigo-500/25" />
      <div className="absolute top-1/4 -right-32 size-[420px] rounded-full bg-sky-400/30 blur-3xl animate-blob animation-delay-2000 dark:bg-sky-500/20" />
      <div className="absolute -bottom-40 left-1/3 size-[460px] rounded-full bg-violet-400/25 blur-3xl animate-blob animation-delay-4000 dark:bg-violet-500/20" />

      {/* blueprint grid, fading downward */}
      <div className="bg-grid mask-fade absolute inset-0" />

      {/* top sheen */}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/50 to-transparent dark:from-white/[0.04]" />
    </div>
  );
}
