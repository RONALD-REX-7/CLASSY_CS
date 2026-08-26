/**
 * GPA / CGPA domain logic — pure functions, no UI concerns.
 *
 * Grade mapping (10-point scale):
 *   O=10, A+=9, A=8, B+=7, B=6, C=5, U=0, AB=0
 *
 * Formulas:
 *   Semester GPA = Σ(credit × grade point) / Σ(credits)
 *   CGPA          = Σ(grade points across all semesters) / Σ(credits across all semesters)
 */

/** Valid grade values, in display order. */
export const GRADES = ["O", "A+", "A", "B+", "B", "C", "U", "AB"] as const;
export type Grade = (typeof GRADES)[number];

/** Grade → grade point mapping. */
export const GRADE_POINTS: Record<Grade, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  U: 0,
  AB: 0,
};

/** A single graded subject entry. */
export interface Subject {
  /** Stable unique id (uuid) used for React keys + edit targeting. */
  id: string;
  name: string;
  /** Credits must be a positive number (0.5–24). */
  credits: number;
  grade: Grade;
}

export interface SubjectInput {
  name: string;
  credits: number;
  grade: Grade;
}

/* ------------------------------------------------------------------ */
/* Performance rating                                                  */
/* ------------------------------------------------------------------ */

export type RatingKey =
  | "excellent"
  | "veryGood"
  | "good"
  | "average"
  | "needsImprovement";

export interface Rating {
  key: RatingKey;
  /** Minimum GPA (inclusive) for this band. */
  min: number;
  label: string;
  message: string;
  /** Tailwind classes for text/chip theming. */
  text: string;
  chip: string;
  /** Hex stops for the ring gradient + glow. */
  ringFrom: string;
  ringTo: string;
  glow: string;
}

export const RATINGS: Rating[] = [
  {
    key: "excellent",
    min: 9,
    label: "Excellent",
    message: "Outstanding — you're at the very top of the class.",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    ringFrom: "#10b981",
    ringTo: "#14b8a6",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    key: "veryGood",
    min: 8,
    label: "Very Good",
    message: "Strong performance — just a step away from perfect.",
    text: "text-teal-600 dark:text-teal-400",
    chip: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
    ringFrom: "#14b8a6",
    ringTo: "#0ea5e9",
    glow: "rgba(20, 184, 166, 0.35)",
  },
  {
    key: "good",
    min: 7,
    label: "Good",
    message: "Solid work — keep pushing toward the top bands.",
    text: "text-sky-600 dark:text-sky-400",
    chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    ringFrom: "#0ea5e9",
    ringTo: "#6366f1",
    glow: "rgba(14, 165, 233, 0.35)",
  },
  {
    key: "average",
    min: 5,
    label: "Average",
    message: "You're on track — with room to climb higher.",
    text: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    ringFrom: "#f59e0b",
    ringTo: "#f97316",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  {
    key: "needsImprovement",
    min: 0,
    label: "Needs Improvement",
    message: "Time to level up your study plan — you've got this.",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    ringFrom: "#f43f5e",
    ringTo: "#e11d48",
    glow: "rgba(244, 63, 94, 0.35)",
  },
];

/** Highest band that applies to the given GPA. */
export function getRating(gpa: number): Rating {
  return RATINGS.find((r) => gpa >= r.min) ?? RATINGS[RATINGS.length - 1];
}

/* ------------------------------------------------------------------ */
/* Calculation                                                         */
/* ------------------------------------------------------------------ */

export interface Totals {
  count: number;
  credits: number;
  weighted: number;
}

/** Sum credits and credit-weighted grade points across all subjects. */
export function computeTotals(subjects: Subject[]): Totals {
  let credits = 0;
  let weighted = 0;
  for (const subject of subjects) {
    const point = GRADE_POINTS[subject.grade] ?? 0;
    const credit =
      typeof subject.credits === "number" && isFinite(subject.credits)
        ? Math.max(0, subject.credits)
        : 0;
    credits += credit;
    weighted += credit * point;
  }
  return { count: subjects.length, credits, weighted };
}

/** Live GPA on the 10-point scale. Returns 0 when there is nothing to average. */
export function computeGpa(subjects: Subject[]): number {
  const { credits, weighted } = computeTotals(subjects);
  if (credits <= 0) return 0;
  return weighted / credits;
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

export function formatGpa(gpa: number): string {
  return gpa > 0 ? gpa.toFixed(2) : "—";
}

/** "3" for 3, "3.5" for 3.5 — no trailing zeros. */
export function formatCredits(credits: number): string {
  return Number.isInteger(credits) ? String(credits) : credits.toFixed(1);
}

/** Weighted points for a single subject (credit × grade point). */
export function subjectPoints(subject: Subject): number {
  return subject.credits * (GRADE_POINTS[subject.grade] ?? 0);
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface ValidationErrors {
  name?: string;
  credits?: string;
  grade?: string;
}

export const CREDITS_MIN = 0.5;
export const CREDITS_MAX = 24;

/** Validate a subject before add/edit. Returns a map of field → message. */
export function validateSubject(input: SubjectInput): ValidationErrors {
  const errors: ValidationErrors = {};

  const name = input.name.trim();
  if (!name) errors.name = "Enter a subject name.";
  else if (name.length > 80) errors.name = "Keep the name under 80 characters.";

  if (!isFinite(input.credits) || input.credits < CREDITS_MIN)
    errors.credits = `Credits must be at least ${formatCredits(CREDITS_MIN)}.`;
  else if (input.credits > CREDITS_MAX)
    errors.credits = `Credits can't exceed ${formatCredits(CREDITS_MAX)}.`;

  if (!GRADES.includes(input.grade)) errors.grade = "Pick a grade.";

  return errors;
}

/* ------------------------------------------------------------------ */
/* Persistence helpers (localStorage-safe)                             */
/* ------------------------------------------------------------------ */

export function loadSubjects(key: string): Subject[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return sanitizeSubjects(parsed).subjects;
  } catch {
    return [];
  }
}

export function saveSubjects(key: string, subjects: Subject[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(subjects));
  } catch {
    /* storage unavailable (private mode / sandboxed iframe) — ignore */
  }
}

/**
 * Coerce unknown data into a clean Subject list. Anything invalid is
 * dropped and counted, so imported files never crash the UI.
 */
export function sanitizeSubjects(data: unknown): {
  subjects: Subject[];
  skipped: number;
} {
  if (!Array.isArray(data)) return { subjects: [], skipped: 0 };

  const subjects: Subject[] = [];
  let skipped = 0;

  for (const item of data) {
    if (!item || typeof item !== "object") {
      skipped++;
      continue;
    }
    const record = item as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const credits = Number(record.credits);
    const grade = record.grade as Grade;

    if (
      name &&
      credits >= CREDITS_MIN &&
      credits <= CREDITS_MAX &&
      GRADES.includes(grade)
    ) {
      subjects.push({ id: createId(), name, credits, grade });
    } else {
      skipped++;
    }
  }

  return { subjects, skipped };
}

/* ------------------------------------------------------------------ */
/* Ids + serialisation                                                 */
/* ------------------------------------------------------------------ */

/** Crypto-safe unique id with a timestamp prefix for readability. */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface ExportPayload {
  app: string;
  version: number;
  exportedAt: string;
  subjects: Omit<Subject, "id">[];
}

/** Build the portable JSON payload used for exports. */
export function buildExport(app: string, subjects: Subject[]): ExportPayload {
  return {
    app,
    version: 1,
    exportedAt: new Date().toISOString(),
    subjects: subjects.map(({ name, credits, grade }) => ({
      name,
      credits,
      grade,
    })),
  };
}

/** Parse an exported payload and return clean subjects. */
export function parseImportPayload(
  json: string,
): { subjects: Subject[]; skipped: number } {
  const parsed: unknown = JSON.parse(json);
  const payload =
    parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>).subjects
      : parsed;
  return sanitizeSubjects(payload);
}

/* ------------------------------------------------------------------ */
/* Semesters + CGPA                                                    */
/* ------------------------------------------------------------------ */

/** A semester bucket that holds its own subjects. */
export interface Semester {
  /** Stable unique id (uuid). */
  id: string;
  /** Display name, e.g. "Semester 1" or "III Year · V Sem". */
  name: string;
  subjects: Subject[];
  /** Epoch ms of the last edit — used for the "last updated" readout. */
  updatedAt: number;
}

/** Create a fresh, empty semester. */
export function createSemester(name = "Semester 1"): Semester {
  return { id: createId(), name, subjects: [], updatedAt: Date.now() };
}

/** Aggregated totals across every semester. */
export interface CgpaTotals {
  semesters: number;
  subjects: number;
  credits: number;
  weighted: number;
}

/** Sum subjects, credits and weighted points across all semesters. */
export function computeCgpaTotals(semesters: Semester[]): CgpaTotals {
  let subjects = 0;
  let credits = 0;
  let weighted = 0;
  for (const semester of semesters) {
    const totals = computeTotals(semester.subjects);
    subjects += totals.count;
    credits += totals.credits;
    weighted += totals.weighted;
  }
  return { semesters: semesters.length, subjects, credits, weighted };
}

/**
 * Weighted CGPA across all semesters:
 *   CGPA = Σ(grade points across all semesters) ÷ Σ(credits across all semesters)
 */
export function computeCgpa(semesters: Semester[]): number {
  const { credits, weighted } = computeCgpaTotals(semesters);
  if (credits <= 0) return 0;
  return weighted / credits;
}

/** Coerce unknown data into a clean Semester list. Anything invalid is dropped. */
export function sanitizeSemesters(data: unknown): {
  semesters: Semester[];
  skipped: number;
} {
  if (!Array.isArray(data)) return { semesters: [], skipped: 0 };

  const semesters: Semester[] = [];
  let skipped = 0;

  for (const item of data) {
    if (!item || typeof item !== "object") {
      skipped++;
      continue;
    }
    const record = item as Record<string, unknown>;
    const name =
      typeof record.name === "string" && record.name.trim()
        ? record.name.trim().slice(0, 40)
        : "";
    const cleaned = sanitizeSubjects(record.subjects);

    if (!name) {
      skipped++;
      continue;
    }

    semesters.push({
      id: createId(),
      name,
      subjects: cleaned.subjects,
      updatedAt:
        typeof record.updatedAt === "number" && isFinite(record.updatedAt)
          ? record.updatedAt
          : Date.now(),
    });
  }

  return { semesters, skipped };
}

export interface CgpaExportPayload {
  app: string;
  version: number;
  exportedAt: string;
  type: "cgpa";
  semesters: { name: string; subjects: Omit<Subject, "id">[] }[];
}

/** Build the portable JSON backup (all semesters). */
export function buildCgpaExport(
  app: string,
  semesters: Semester[],
): CgpaExportPayload {
  return {
    app,
    version: 2,
    exportedAt: new Date().toISOString(),
    type: "cgpa",
    semesters: semesters.map((semester) => ({
      name: semester.name,
      subjects: semester.subjects.map(({ name, credits, grade }) => ({
        name,
        credits,
        grade,
      })),
    })),
  };
}

/** Parse a JSON backup — new CGPA format, or a legacy single-semester export. */
export function parseCgpaImport(json: string): {
  semesters: Semester[];
  skipped: number;
} {
  const parsed: unknown = JSON.parse(json);
  if (parsed && typeof parsed === "object") {
    const record = parsed as Record<string, unknown>;
    if (Array.isArray(record.semesters)) {
      return sanitizeSemesters(record.semesters);
    }
    // Legacy single-semester payload — wrap it into one semester.
    if (record.subjects !== undefined) {
      return sanitizeSemesters([
        { name: "Semester 1", subjects: record.subjects },
      ]);
    }
  }
  return sanitizeSemesters(parsed);
}

/** Compact CSV summary of every semester + subject (spreadsheet-friendly). */
export function buildSemesterCsv(semesters: Semester[]): string {
  const escape = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;
  const rows: string[][] = [
    ["Semester", "Subject", "Credits", "Grade", "Grade Points", "Weighted"],
  ];
  for (const semester of semesters) {
    for (const subject of semester.subjects) {
      rows.push([
        semester.name,
        subject.name,
        String(subject.credits),
        subject.grade,
        String(GRADE_POINTS[subject.grade]),
        String(subjectPoints(subject)),
      ]);
    }
  }
  const totals = computeCgpaTotals(semesters);
  rows.push([
    "",
    "TOTAL",
    String(totals.credits),
    "",
    "",
    String(totals.weighted),
  ]);
  return rows.map((row) => row.map(escape).join(",")).join("\n");
}
