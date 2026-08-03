import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { AddSubjectForm } from "@/components/gpa/add-subject-form";
import { EmptyState } from "@/components/gpa/empty-state";
import { GpaRing } from "@/components/gpa/gpa-ring";
import { GradeBreakdown } from "@/components/gpa/grade-breakdown";
import { LoadingScreen } from "@/components/gpa/loading-screen";
import { RatingBadge } from "@/components/gpa/rating-badge";
import { StatCard } from "@/components/gpa/stat-card";
import { SubjectRow } from "@/components/gpa/subject-row";
import { Navbar } from "@/components/navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { APP_NAME, EXPORT_FILE_NAME, STORAGE_KEYS } from "@/lib/constants";
import {
  buildExport,
  computeGpa,
  computeTotals,
  createId,
  getRating,
  parseImportPayload,
  sanitizeSubjects,
  type Subject,
  type SubjectInput,
} from "@/lib/gpa";
import { exportGpaPdf, type ReportProfile } from "@/lib/pdf";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calculator as CalculatorIcon,
  ClipboardCopy,
  Download,
  FileText,
  Gauge,
  Layers,
  Plus,
  Printer,
  RotateCcw,
  Save,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface ConfirmState {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

const EMPTY_PROFILE: ReportProfile = { studentName: "", semester: "" };

export default function Calculator() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(
    STORAGE_KEYS.subjects,
    [],
    (raw) => sanitizeSubjects(raw).subjects,
  );
  const [profile, setProfile] = useLocalStorage<ReportProfile>(
    STORAGE_KEYS.profile,
    EMPTY_PROFILE,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addSectionRef = useRef<HTMLDivElement>(null);

  /* Brief branded splash so the app feels like an app, not a hard paint-in. */
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  /* ------------------------------ derived state ------------------------------ */
  const totals = useMemo(() => computeTotals(subjects), [subjects]);
  const gpa = useMemo(() => computeGpa(subjects), [subjects]);
  const hasData = subjects.length > 0;
  const rating = getRating(gpa);
  const avgCredits = totals.count > 0 ? totals.credits / totals.count : 0;

  /* ------------------------------ CRUD actions ------------------------------ */

  const handleAdd = (input: SubjectInput) => {
    setSubjects((prev) => [...prev, { id: createId(), ...input }]);
    toast.success(`${input.name} added`);
  };

  const handleSaveEdit = (id: string, input: SubjectInput) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...input } : s)),
    );
    setEditingId(null);
    toast.success(`${input.name} updated`);
  };

  const handleDelete = (subject: Subject) => {
    const index = subjects.findIndex((s) => s.id === subject.id);
    setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
    if (editingId === subject.id) setEditingId(null);
    toast(subject.name, {
      description: "Subject deleted",
      action: {
        label: "Undo",
        onClick: () =>
          setSubjects((prev) => {
            const next = [...prev];
            next.splice(Math.min(index, next.length), 0, subject);
            return next;
          }),
      },
    });
  };

  const handleReset = () => {
    setSubjects([]);
    setEditingId(null);
    toast.info("Calculator reset");
  };

  /* ------------------------------ data actions ------------------------------ */

  const handleExport = () => {
    if (!hasData) {
      toast.error("Nothing to export yet", {
        description: "Add a subject first, then export.",
      });
      return;
    }
    const payload = buildExport(APP_NAME, subjects);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = EXPORT_FILE_NAME;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as JSON");
  };

  /** Structured, branded PDF report of the current grade sheet. */
  const handleExportPdf = () => {
    if (!hasData) {
      toast.error("Nothing to export yet", {
        description: "Add a subject first, then export a PDF report.",
      });
      return;
    }
    try {
      exportGpaPdf(subjects, profile);
      toast.success("PDF report downloaded");
    } catch {
      toast.error("Couldn't generate the PDF", {
        description: "Please try again.",
      });
    }
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { subjects: imported, skipped } = parseImportPayload(
          String(reader.result),
        );
        if (imported.length === 0) {
          toast.error("No valid subjects found", {
            description: "The file didn't contain any readable subjects.",
          });
          return;
        }
        const apply = () => {
          setSubjects(imported);
          setEditingId(null);
          toast.success(`Imported ${imported.length} subject${imported.length === 1 ? "" : "s"}`);
          if (skipped > 0) {
            toast.info(`${skipped} invalid entr${skipped === 1 ? "y" : "ies"} skipped`);
          }
        };
        if (hasData) {
          setConfirm({
            title: "Replace current subjects?",
            description: `Importing will replace your ${subjects.length} current subject${subjects.length === 1 ? "" : "s"} with ${imported.length} from the file.`,
            confirmLabel: "Replace & import",
            onConfirm: apply,
          });
        } else {
          apply();
        }
      } catch {
        toast.error("Invalid file", {
          description: `That doesn't look like a ${APP_NAME} export.`,
        });
      }
    };
    reader.readAsText(file);
    // Reset the input so selecting the same file again still fires onChange.
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const handleCopy = async () => {
    if (!hasData) {
      toast.error("Nothing to copy", {
        description: "Add a subject first, then copy your GPA.",
      });
      return;
    }
    const text = `My GPA is ${gpa.toFixed(2)}/10 — ${rating.label} (via ${APP_NAME})`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("GPA copied to clipboard");
    } catch {
      /* Clipboard API can be blocked in iframes — fall back to execCommand. */
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast.success("GPA copied to clipboard");
      } catch {
        toast.error("Couldn't copy", { description: "Please copy manually." });
      }
      document.body.removeChild(textarea);
    }
  };

  const handlePrint = () => window.print();

  const scrollToAdd = () => {
    addSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("add-name")?.focus(), 450);
  };

  /* -------------------------------- rendering -------------------------------- */

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6">
        {/* Print-only header (visible only when printing) */}
        <div className="print-header hidden items-center justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <p className="font-display text-2xl font-bold">{APP_NAME}</p>
            <p className="text-sm text-slate-500">GPA report</p>
            {(profile.studentName.trim() || profile.semester.trim()) && (
              <p className="mt-1.5 text-sm font-medium text-slate-700">
                {[profile.studentName.trim(), profile.semester.trim()]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Generated {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}
          </p>
        </div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
            GPA Calculator
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your semester, <span className="text-gradient">at a glance</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Add your subjects, pick your grades, and watch your GPA update
            live — everything autosaves to this browser.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,390px)_1fr] lg:items-start">
          {/* ================= LEFT: summary panel ================= */}
          <section className="space-y-4 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Current GPA
                </h2>
                <RatingBadge gpa={gpa} hasData={hasData} />
              </div>

              <div className="mt-6 grid place-items-center">
                <GpaRing gpa={gpa} hasData={hasData} />
              </div>

              <div className="mt-5 min-h-[3.5rem] text-center">
                <RatingBadge gpa={gpa} hasData={hasData} showMessage />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <StatCard
                  label="Subjects"
                  value={totals.count}
                  icon={BookOpen}
                  iconClass="bg-sky-500/12 text-sky-600 dark:text-sky-300"
                  delay={0.15}
                />
                <StatCard
                  label="Total credits"
                  value={totals.credits}
                  icon={Layers}
                  iconClass="bg-indigo-500/12 text-indigo-600 dark:text-indigo-300"
                  delay={0.2}
                />
                <StatCard
                  label="Weighted points"
                  value={totals.weighted}
                  icon={Gauge}
                  iconClass="bg-violet-500/12 text-violet-600 dark:text-violet-300"
                  delay={0.25}
                />
                <StatCard
                  label="Avg credits"
                  value={avgCredits}
                  suffix="/subject"
                  icon={TrendingUp}
                  iconClass="bg-teal-500/12 text-teal-600 dark:text-teal-300"
                  delay={0.3}
                />
              </div>
            </motion.div>

            {/* Report details (optional) — stamped onto the PDF header */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13, duration: 0.5 }}
              className="no-print glass rounded-2xl p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-sm font-bold tracking-tight">
                  Report details
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <FileText className="size-3.5" />
                  Optional · on PDF
                </span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="report-student"
                    className="mb-1.5 block text-xs font-semibold text-muted-foreground"
                  >
                    Student name
                  </label>
                  <Input
                    id="report-student"
                    value={profile.studentName}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, studentName: e.target.value }))
                    }
                    placeholder="e.g. A. Student"
                    maxLength={60}
                    className="bg-white/60 dark:bg-white/5"
                  />
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="report-semester"
                    className="mb-1.5 block text-xs font-semibold text-muted-foreground"
                  >
                    Semester / class
                  </label>
                  <Input
                    id="report-semester"
                    value={profile.semester}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, semester: e.target.value }))
                    }
                    placeholder="e.g. III Year · V Sem"
                    maxLength={40}
                    className="bg-white/60 dark:bg-white/5"
                  />
                </div>
              </div>
            </motion.div>

            {/* Action toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="no-print glass flex flex-wrap items-center gap-2 rounded-2xl p-3"
              aria-label="Calculator actions"
            >
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                disabled={!hasData}
                className="rounded-full"
              >
                <ClipboardCopy className="size-4" />
                Copy GPA
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleExport} className="rounded-full">
                <Download className="size-4" />
                JSON
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleExportPdf} className="rounded-full">
                <FileText className="size-4" />
                PDF
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-full">
                <Upload className="size-4" />
                Import
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handlePrint} className="rounded-full">
                <Printer className="size-4" />
                Print
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  hasData &&
                  setConfirm({
                    title: "Reset calculator?",
                    description: "All subjects will be removed from this browser. This can't be undone (unless you exported first).",
                    confirmLabel: "Reset everything",
                    destructive: true,
                    onConfirm: handleReset,
                  })
                }
                disabled={!hasData}
                className="ml-auto rounded-full text-destructive hover:border-destructive/40"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </motion.div>
          </section>

          {/* ================= RIGHT: subjects ================= */}
          <section className="min-w-0 space-y-5">
            <div ref={addSectionRef} className="no-print scroll-mt-24">
              <AddSubjectForm onAdd={handleAdd} />
            </div>

            {/* List header */}
            <div className="flex items-center justify-between px-1">
              <h2 className="font-display text-lg font-bold tracking-tight">
                Your subjects
                <span className="glass-soft ml-2 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
                  {totals.count}
                </span>
              </h2>
              {hasData && (
                <span className="hidden items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:inline-flex">
                  <Save className="size-3.5" />
                  Autosaved locally
                </span>
              )}
            </div>

            {/* Subject list */}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {subjects.map((subject, index) => (
                  <SubjectRow
                    key={subject.id}
                    subject={subject}
                    index={index}
                    isEditing={editingId === subject.id}
                    onEdit={() => setEditingId(subject.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onSave={(input) => handleSaveEdit(subject.id, input)}
                    onDelete={() => handleDelete(subject)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {!hasData && <EmptyState onAdd={scrollToAdd} />}

            {hasData && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <GradeBreakdown subjects={subjects} />
              </motion.div>
            )}
          </section>
        </div>

        {/* Formula reference */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-14"
          id="formula"
        >
          <div className="glass flex flex-col items-center gap-2 rounded-3xl p-8 text-center sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:text-indigo-300">
                <CalculatorIcon className="size-5" />
              </span>
              <div className="text-left">
                <p className="font-display text-sm font-bold">The formula</p>
                <p className="text-xs text-muted-foreground">10-point grading scale</p>
              </div>
            </div>
            <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              GPA = <span className="text-gradient">Σ (Credit × Grade point)</span> ÷ Σ (Credits)
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* ---------- Floating action button ---------- */}
      <motion.button
        type="button"
        onClick={scrollToAdd}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="btn-grad no-print fixed bottom-6 right-5 z-40 grid size-14 place-items-center rounded-full border-0 text-white shadow-[0_16px_36px_-12px_rgba(79,70,229,0.65)] sm:bottom-8 sm:right-8"
        aria-label="Add a subject"
      >
        {!hasData && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-400/50"
            style={{ animationDuration: "2.2s" }}
          />
        )}
        <Plus className="size-6" />
      </motion.button>

      {/* ---------- Hidden file input for imports ---------- */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
        }}
      />

      {/* ---------- Shared confirm dialog (reset / import replace) ---------- */}
      <AlertDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => !open && setConfirm(null)}
      >
        <AlertDialogContent className="glass border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirm?.onConfirm();
                setConfirm(null);
              }}
              className={
                confirm?.destructive
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "btn-grad border-0 text-white"
              }
            >
              {confirm?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
