import { Logo } from "@/components/logo";
import { APP_NAME, APP_TAGLINE, APP_VERSION } from "@/lib/constants";
import { ShieldCheck, WifiOff } from "lucide-react";
import { Link } from "react-router";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Calculator", href: "/calculator" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Grade scale", href: "/#scale" },
      { label: "GPA formula", href: "/#formula" },
      { label: "Back to top", href: "/#" },
    ],
  },
];

/**
 * Shared page footer — includes the app version badge and a local-first
 * privacy note (all data lives in the browser).
 */
export function Footer() {
  return (
    <footer className="no-print border-t border-foreground/8 bg-white/30 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size={30} />
              <span className="font-display text-lg font-bold tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {APP_TAGLINE} No sign-up, no tracking — just a beautifully
              simple tool that works offline.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                Local-first
              </span>
              <span className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
                <WifiOff className="size-3.5 text-sky-500" />
                Works offline
              </span>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-foreground/8 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Made with care for
            students everywhere.
          </p>
          <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            v{APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
