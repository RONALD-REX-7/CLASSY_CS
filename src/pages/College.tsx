/**
 * College page — wraps the existing GPA/CGPA Calculator.
 * This page makes it explicit that GPA/CGPA is one part of CLASSY,
 * not the whole product.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { lazy, Suspense } from "react";

const CalculatorPage = lazy(() => import("./Calculator.tsx"));

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function College() {
  const location = useLocation();
  const isRoot = location.pathname === "/college";

  // If someone navigates to /college directly, show an intro page
  // The actual calculator lives at /calculator
  if (isRoot) {
    return (
      <div className="min-h-screen overflow-x-clip">
        <Background />
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pb-28 pt-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-300">
              College
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              GPA & CGPA <span className="text-gradient">Calculator</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Track your semester-by-semester academic performance. Add unlimited subjects, calculate credit-weighted GPA, and export structured reports — all offline.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
              className="glass rounded-2xl p-6"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-300">
                <Calculator className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">GPA Calculator</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Add subjects with credits and grades. Get instant credit-weighted GPA with a beautiful progress ring.
              </p>
              <Button asChild className="mt-5 h-10 rounded-full border-0 text-sm">
                <Link to="/calculator">
                  Open GPA Calculator
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
              className="glass rounded-2xl p-6"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-violet-500/12 text-violet-600 dark:text-violet-300">
                <GraduationCap className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">CGPA Calculator</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Track multiple semesters. See cumulative CGPA, per-semester breakdowns, and overall academic trajectory.
              </p>
              <Button asChild variant="outline" className="glass-soft mt-5 h-10 rounded-full border-0 text-sm">
                <Link to="/calculator">
                  Open CGPA Calculator
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
            className="mt-8 glass-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground"
          >
            <Sparkles className="size-4 shrink-0 text-indigo-500" />
            <span>
              Also explore{" "}
              <Link to="/school" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                School
              </Link>{" "}
              for Class 10–12 academic tracking, or{" "}
              <Link to="/admission" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                Admissions
              </Link>{" "}
              for entrance exam planning.
            </span>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // For /calculator route, render the actual calculator (lazy-loaded)
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="glass flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
            <div className="glass-inset h-1 w-40 overflow-hidden rounded-full">
              <div className="animate-shimmer h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(99,102,241,0.1),#6366f1,rgba(14,165,233,0.9),rgba(99,102,241,0.1))]" />
            </div>
          </div>
        </div>
      }
    >
      <CalculatorPage />
    </Suspense>
  );
}
