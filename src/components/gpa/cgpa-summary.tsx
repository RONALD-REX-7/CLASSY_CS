import { GpaRing } from "@/components/gpa/gpa-ring";
import { RatingBadge } from "@/components/gpa/rating-badge";
import { StatCard } from "@/components/gpa/stat-card";
import { Button } from "@/components/ui/button";
import {
  computeGpa,
  getRating,
  type CgpaTotals,
  type Semester,
} from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ClipboardCopy,
  Clock,
  Download,
  FileJson,
  FileText,
  Gauge,
  GraduationCap,
  Layers,
  Printer,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import { Fragment } from "react";

/* ------------------------------------------------------------------ */
/* Semester timeline strip — every semester in order, GPA per chip      */
/* ------------------------------------------------------------------ */

function TimelineStrip({ semesters }: { semesters: Semester[] }) {
  if (semesters.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Semester timeline
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        {semesters.map((semester, i) => {
          const gpa = computeGpa(semester.subjects);
          const rating = getRating(gpa);
          const isLast = i === semesters.length - 1;
          const hasData = semester.subjects.length > 0;
          return (
            <Fragment key={semester.id}>
              <div
                className={cn(
                  "glass-inset flex items-center gap-2 rounded-full py-1.5 pl-2.5 pr-3",
                  isLast && "ring-2 ring-indigo-500/30",
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: hasData ? rating.ringFrom : "#94a3b8" }}
                  aria-hidden="true"
                />
                <span className="max-w-[7.5rem] truncate text-xs font-bold">
                  {semester.name}
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {hasData ? gpa.toFixed(2) : "—"}
                </span>
              </div>
              {!isLast && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-muted-foreground/40"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main summary card                                                   */
/* ------------------------------------------------------------------ */

interface CgpaSummaryProps {
  semesters: Semester[];
  totals: CgpaTotals;
  cgpa: number;
  lastUpdated: number;
  onCopy: () => void;
  onExport: () => void;
  onExportCsv: () => void;
  onImport: () => void;
  onPdf: () => void;
  onPrint: () => void;
  onReset: () => void;
}

/**
 * The CGPA dashboard card shown at the top of the tracker.
 * CGPA ring is the focal point, flanked by totals, a semester timeline
 * strip, and the data actions (export / import / PDF / print / reset).
 */
export function CgpaSummary({
  semesters,
  totals,
  cgpa,
  lastUpdated,
  onCopy,
  onExport,
  onExportCsv,
  onImport,
  onPdf,
  onPrint,
  onReset,
}: CgpaSummaryProps) {
  const hasData = totals.subjects > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-6 sm:p-8"
    >
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Cumulative CGPA
        </h2>
        <RatingBadge gpa={cgpa} hasData={hasData} />
      </div>

      {/* ring + stats */}
      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[auto_1fr]">
        <div className="grid place-items-center">
          <GpaRing gpa={cgpa} hasData={hasData} size={170} strokeWidth={15} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Semesters"
            value={totals.semesters}
            icon={GraduationCap}
            iconClass="bg-indigo-500/12 text-indigo-600 dark:text-indigo-300"
            delay={0.1}
          />
          <StatCard
            label="Subjects"
            value={totals.subjects}
            icon={BookOpen}
            iconClass="bg-sky-500/12 text-sky-600 dark:text-sky-300"
            delay={0.15}
          />
          <StatCard
            label="Total credits"
            value={totals.credits}
            icon={Layers}
            iconClass="bg-violet-500/12 text-violet-600 dark:text-violet-300"
            delay={0.2}
          />
          <StatCard
            label="Total points"
            value={totals.weighted}
            icon={Gauge}
            iconClass="bg-teal-500/12 text-teal-600 dark:text-teal-300"
            delay={0.25}
          />
        </div>
      </div>

      <TimelineStrip semesters={semesters} />

      {/* data actions */}
      <div
        className="no-print mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2"
        aria-label="Data actions"
      >
        <Button
          size="sm"
          onClick={onCopy}
          disabled={!hasData}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <ClipboardCopy className="size-4" />
          Copy CGPA
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          disabled={!hasData}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <Download className="size-4" />
          JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onExportCsv}
          disabled={!hasData}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <FileJson className="size-4" />
          CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onPdf}
          disabled={!hasData}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <FileText className="size-4" />
          PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onImport}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <Upload className="size-4" />
          Import
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onPrint}
          className="w-full justify-center rounded-full sm:w-auto"
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={!hasData}
          className="col-span-2 w-full justify-center rounded-full text-destructive hover:border-destructive/40 sm:ml-auto sm:w-auto"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      {/* meta */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/8 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Save className="size-3.5" />
          Autosaved locally
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          Updated{" "}
          {new Date(lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.section>
  );
}
