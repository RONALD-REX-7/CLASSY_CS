import { Logo } from "@/components/logo";
import { APP_NAME, APP_VERSION } from "@/lib/constants";
import { Link } from "react-router";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Academic Calculator", href: "/calculator" },
      { label: "School", href: "/school" },
      { label: "Admission", href: "/admission" },
      { label: "Explore", href: "/explore" },
    ],
  },
  {
    title: "Admission",
    links: [
      { label: "TNEA Planner", href: "/admission/tnea" },
      { label: "JEE Planner", href: "/admission/jee" },
      { label: "NEET Planner", href: "/admission/neet" },
    ],
  },
];

/**
 * Page footer with useful product links.
 * Clean, minimal, no decorative glass effects.
 */
export function Footer() {
  return (
    <footer className="no-print border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <Logo size={26} />
              <span className="font-display text-sm font-bold tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Student academic companion. Calculate GPA, track performance,
              explore admission pathways. No sign-up required.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-2.5 space-y-2">
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
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}.
          </p>
          <p className="text-xs text-muted-foreground">
            v{APP_VERSION} · Data stays on your device
          </p>
        </div>
      </div>
    </footer>
  );
}
