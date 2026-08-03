import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const NAV_LINKS = [
  { label: "Calculator", href: "/calculator" },
  { label: "Features", href: "/#features" },
  { label: "Grade scale", href: "/#scale" },
  { label: "How it works", href: "/#how" },
];

/**
 * Sticky glass navbar shared by the landing page and the calculator.
 * Turns fully opaque-glass once the page is scrolled, and collapses into
 * an animated menu on mobile.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "glass shadow-[0_8px_30px_-12px_rgba(58,84,180,0.25)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${APP_NAME} home`}
        >
          <Logo size={32} className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/calculator"
                ? pathname === "/calculator"
                : false;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-white/5",
                  isActive && "bg-white/60 text-foreground dark:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild className="btn-grad hidden rounded-full border-0 text-white sm:inline-flex">
            <Link to="/calculator">
              Open calculator
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          {/* Mobile menu trigger */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="glass overflow-hidden border-t md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/60 dark:hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-foreground/10 pt-4">
                <ThemeToggle />
                <Button asChild className="btn-grad flex-1 rounded-full border-0 text-white">
                  <Link to="/calculator">
                    Open calculator
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
