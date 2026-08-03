import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { CgpaSummary } from "@/components/gpa/cgpa-summary";
import { LoadingScreen } from "@/components/gpa/loading-screen";
import { SemesterCard } from "@/components/gpa/semester-card";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  APP_NAME,
  CSV_FILE_NAME,
  EXPORT_FILE_NAME,
  STORAGE_KEYS,
} from "@/lib/constants";
import {
  buildCgpaExport,
  buildSemesterCsv,
  computeCgpa,
  computeCgpaTotals,
  createId,
  createSemester,
  getRating,
  parseCgpaImport,
  sanitizeSemesters,
  sanitizeSubjects,
  type Semester,
  type Subject,
  type SubjectInput,
} from "@/lib/gpa";
import { exportGpaPdf, type ReportProfile } from "@/lib/pdf";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator as CalculatorIcon, GraduationCap, Plus } from "lucide-react";
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
  /* ------------------------------ state ------------------------------ */
  const [semesters, setSemesters] = useLocalStorage<Semester[]>(
    STORAGE_KEYS.semesters,
    [],
    (raw) => sanitizeSemesters(raw).semesters,
  );
  const [profile, setProfile] = useLocalStorage<ReportProfile>(
    STORAGE_KEYS.profile,
    EMPTY_PROFILE,
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Brief branded splash so the app feels like an app, not a hard paint-in. */
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  /* Seed one semester on first run; migrate any legacy single-semester
     data (classycs.subjects.v1) into it so nothing is lost. */
  useEffect(() => {
    if (semesters.length === 0) {
      let migrated = false;
      try {
        const legacy = window.localStorage.getItem(STORAGE_KEYS.subjects);
        if (legacy) {
          const cleaned = sanitizeSubjects(JSON.parse(legacy));
          if (cleaned.subjects.length > 0) {
            setSemesters([
              {
                id: createId(),
                name: "Semester 1",
                subjects: cleaned.subjects,
                updatedAt: Date.now(),
              },
            ]);
            migrated = true;
          }
        }
      } catch {
        /* ignore corrupt legacy data */
      }
      if (!migrated) setSemesters([createSemester("Semester 1")]);
      return;
    }
    // Keep the most recent semester expanded by default.
    setExpandedId((prev) => prev ?? semesters[semesters.length - 1].id);
  }, [semesters, setSemesters]);

  /* --------------------------- derived state -------------------------- */
  const totals = useMemo(() => computeCgpaTotals(semesters), [semesters]);
  const cgpa = useMemo(() => computeCgpa(semesters), [semesters]);
  const hasData = totals.subjects > 0;
  const rating = getRating(cgpa);
  const lastUpdated = useMemo(
    () => Math.max(0, ...semesters.map((semester) => semester.updatedAt)),
    [semesters],
  );

  /* --------------------------- semester CRUD -------------------------- */

  const handleAddSemester = () => {
    const semester = createSemester(`Semester ${semesters.length + 1}`);
    setSemesters((prev) => [...prev, semester]);
    setExpandedId(semester.id);
    toast.success("Semester added");
  };

  const handleRenameSemester = (id: string, name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === id
          ? { ...semester, name: clean.slice(0, 40), updatedAt: Date.now() }
          : semester,
      ),
    );
    toast.success("Semester renamed");
  };

  const handleDuplicateSemester = (id: string) => {
    const copyId = createId();
    setSemesters((prev) => {
      const index = prev.findIndex((semester) => semester.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const copy: Semester = {
        id: copyId,
        name: `${source.name} (copy)`,
        subjects: source.subjects.map((subject) => ({
          ...subject,
          id: createId(),
        })),
        updatedAt: Date.now(),
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setExpandedId(copyId);
    toast.success("Semester duplicated");
  };

  const handleDeleteSemester = (id: string) => {
    const semester = semesters.find((item) => item.id === id);
    if (!semester) return;
    setConfirm({
      title: "Delete this semester?",
      description: `"${semester.name}" and its ${semester.subjects.length} subject${
        semester.subjects.length === 1 ? "" : "s"
      } will be removed from this browser. This can't be undone (unless you exported first).`,
      confirmLabel: "Delete semester",
      destructive: true,
      onConfirm: () => {
        setSemesters((prev) => {
          const next = prev.filter((item) => item.id !== id);
          return next.length > 0 ? next : [createSemester("Semester 1")];
        });
        setExpandedId((prev) => (prev === id ? null : prev));
        toast.success("Semester deleted");
      },
    });
  };

  /* --------------------------- subject CRUD --------------------------- */

  const handleAddSubject = (semesterId: string, input: SubjectInput) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              subjects: [...semester.subjects, { id: createId(), ...input }],
              updatedAt: Date.now(),
            }
          : semester,
      ),
    );
    toast.success(`${input.name} added`);
  };

  const handleUpdateSubject = (
    semesterId: string,
    subjectId: string,
    input: SubjectInput,
  ) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              subjects: semester.subjects.map((subject) =>
                subject.id === subjectId ? { ...subject, ...input } : subject,
              ),
              updatedAt: Date.now(),
            }
          : semester,
      ),
    );
    toast.success(`${input.name} updated`);
  };

  const handleDeleteSubject = (semesterId: string, subject: Subject) => {
    const semester = semesters.find((item) => item.id === semesterId);
    const index = semester
      ? semester.subjects.findIndex((item) => item.id === subject.id)
      : -1;

    setSemesters((prev) =>
      prev.map((item) =>
        item.id === semesterId
          ? {
              ...item,
              subjects: item.subjects.filter((s) => s.id !== subject.id),
              updatedAt: Date.now(),
            }
          : item,
      ),
    );

    toast(subject.name, {
      description: "Subject deleted",
      action: {
        label: "Undo",
        onClick: () =>
          setSemesters((prev) =>
            prev.map((item) => {
              if (item.id !== semesterId) return item;
              const next = [...item.subjects];
              next.splice(Math.min(Math.max(index, 0), next.length), 0, subject);
              return { ...item, subjects: next, updatedAt: Date.now() };
            }),
          ),
      },
    });
  };

  /* ----------------------------- data actions ------------------------- */

  const handleExport = () => {
    if (!hasData) {
      toast.error("Nothing to export yet", {
        description: "Add a subject first, then export.",
      });
      return;
    }
    const payload = buildCgpaExport(APP_NAME, semesters);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = EXPORT_FILE_NAME;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exported as JSON");
  };

  const handleExportCsv = () => {
    if (!hasData) {
      toast.error("Nothing to export yet", {
        description: "Add a subject first, then export a CSV summary.",
      });
      return;
    }
    const csv = buildSemesterCsv(semesters);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = CSV_FILE_NAME;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("CSV summary exported");
  };

  /** Structured, branded PDF report of every semester + overall CGPA. */
  const handleExportPdf = () => {
    if (!hasData) {
      toast.error("Nothing to export yet", {
        description: "Add a subject first, then export a PDF report.",
      });
      return;
    }
    try {
      exportGpaPdf(semesters, profile);
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
        const { semesters: imported, skipped } = parseCgpaImport(
          String(reader.result),
        );
        if (imported.length === 0) {
          toast.error("No valid semesters found", {
            description: "The file didn't contain any readable data.",
          });
          return;
        }
        const apply = () => {
          setSemesters(imported);
          setExpandedId(imported[imported.length - 1].id);
          toast.success(
            `Imported ${imported.length} semester${imported.length === 1 ? "" : "s"}`,
          );
          if (skipped > 0) {
            toast.info(`${skipped} invalid entr${skipped === 1 ? "y" : "ies"} skipped`);
          }
        };
        if (hasData) {
          setConfirm({
            title: "Replace current semesters?",
            description: `Importing will replace your ${semesters.length} current semester${
              semesters.length === 1 ? "" : "s"
            } with ${imported.length} from the file.`,
            confirmLabel: "Replace & import",
            onConfirm: apply,
          });
        } else {
          apply();
        }
      } catch {
        toast.error("Invalid file", {
          description: `That doesn't look like a ${APP_NAME} backup.`,
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
        description: "Add a subject first, then copy your CGPA.",
      });
      return;
    }
    const text = `My CGPA is ${cgpa.toFixed(2)}/10 — ${rating.label} (via ${APP_NAME})`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("CGPA copied to clipboard");
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
        toast.success("CGPA copied to clipboard");
      } catch {
        toast.error("Couldn't copy", { description: "Please copy manually." });
      }
      document.body.removeChild(textarea);
    }
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    const fresh = createSemester("Semester 1");
    setSemesters([fresh]);
    setExpandedId(fresh.id);
    toast.info("Calculator reset");
  };

  /* ------------------------------- render ----------------------------- */

  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6">
        {/* Print-only header (visible only when printing) */}
        <div className="print-header hidden items-center justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <p className="font-display text-2xl font-bold">{APP_NAME}</p>
            <p className="text-sm text-slate-500">
              CGPA report — {totals.semesters} semester
              {totals.semesters === 1 ? "" : "s"}
            </p>
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
            CGPA Tracker
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your journey, <span className="text-gradient">semester by semester</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Track every semester, watch your CGPA update live, and keep
            everything safely on your device — no sign-up needed.
          </p>
        </motion.div>

        {/* ===================== CGPA dashboard ===================== */}
        <CgpaSummary
          semesters={semesters}
          totals={totals}
          cgpa={cgpa}
          lastUpdated={lastUpdated}
          onCopy={handleCopy}
          onExport={handleExport}
          onExportCsv={handleExportCsv}
          onImport={() => fileInputRef.current?.click()}
          onPdf={handleExportPdf}
          onPrint={handlePrint}
          onReset={() =>
            setConfirm({
              title: "Reset calculator?",
              description: "All semesters and subjects will be removed from this browser. This can't be undone (unless you exported first).",
              confirmLabel: "Reset everything",
              destructive: true,
              onConfirm: handleReset,
            })
          }
        />

        {/* ====================== semesters ======================== */}
        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold tracking-tight">
              Semesters
              <span className="glass-soft ml-2 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
                {totals.semesters}
              </span>
            </h2>
            <Button
              type="button"
              onClick={handleAddSemester}
              className="btn-grad rounded-full border-0 text-white"
            >
              <Plus className="size-4" />
              Add semester
            </Button>
          </div>

          {/* One column on mobile, two balanced columns on desktop */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
            {semesters.map((semester, index) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                isCurrent={index === semesters.length - 1}
                expanded={expandedId === semester.id}
                canDelete={semesters.length > 1}
                onToggle={() =>
                  setExpandedId((prev) =>
                    prev === semester.id ? null : semester.id,
                  )
                }
                onRename={(name) => handleRenameSemester(semester.id, name)}
                onDuplicate={() => handleDuplicateSemester(semester.id)}
                onDelete={() => handleDeleteSemester(semester.id)}
                onAddSubject={(input) => handleAddSubject(semester.id, input)}
                onUpdateSubject={(subjectId, input) =>
                  handleUpdateSubject(semester.id, subjectId, input)
                }
                onDeleteSubject={(subject) =>
                  handleDeleteSubject(semester.id, subject)
                }
              />
            ))}
          </div>
        </section>

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
                <GraduationCap className="size-5" />
              </span>
              <div className="text-left">
                <p className="font-display text-sm font-bold">The formula</p>
                <p className="text-xs text-muted-foreground">Weighted across all semesters</p>
              </div>
            </div>
            <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              CGPA ={" "}
              <span className="text-gradient">
                Σ (Credit × Grade point)
              </span>{" "}
              ÷ Σ (Credits)
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* ---------- Floating action button: quick-add a semester ---------- */}
      <motion.button
        type="button"
        onClick={handleAddSemester}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="btn-grad no-print fixed bottom-6 right-5 z-40 grid size-14 place-items-center rounded-full border-0 text-white shadow-[0_16px_36px_-12px_rgba(79,70,229,0.65)] sm:bottom-8 sm:right-8"
        aria-label="Add a semester"
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

      {/* ---------- Shared confirm dialog (reset / import replace / delete) ---------- */}
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
