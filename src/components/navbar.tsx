import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

/** Primary product navigation — task-oriented labels. */
const NAV_LINKS = [
  { label: "Academic", href: "/calculator" },
  { label: "Admission", href: "/admission" },
  { label: "Explore", href: "/explore" },
  { label: "My Classy", href: "/my-classy" },
];

/**
 * Sticky navigation shared by every CLASSY page.
 * Uses a clean border-based scroll state instead of glass effects.
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

  const closeMenu = () => setMenuOpen(false);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 transition-colors duration-200",
        scrolled
          ? "border-b border-border/60 bg-background/90 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label={`${APP_NAME} home`}
        >
          <Logo size={28} className="transition-transform duration-200 group-hover:scale-105" />
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
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
          <Button
            asChild
            className="hidden sm:inline-flex h-8 rounded-md bg-foreground text-background px-3.5 text-xs font-semibold hover:bg-foreground/90"
          >
            <Link to="/calculator" onClick={closeMenu}>
              Calculate GPA
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          {/* Mobile menu trigger */}
          <Button
            type="button"
            variant="ghost"
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border/60 bg-background md:hidden"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-0.5 px-4 py-3">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center gap-3 border-t border-border/60 pt-3">
                <ThemeToggle />
                <Button
                  asChild
                  className="flex-1 h-9 rounded-md bg-foreground text-background text-xs font-semibold hover:bg-foreground/90"
                >
                  <Link to="/calculator" onClick={closeMenu}>
                    Calculate GPA
                    <ArrowRight className="size-3.5" />
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
