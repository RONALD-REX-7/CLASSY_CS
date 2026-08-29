/**
 * School module types for CLASSY.
 *
 * Covers Class 10, 11, and 12 across Tamil Nadu State Board, CBSE,
 * and an extensible international framework.
 *
 * RULE: All types are pure — no runtime code, no React components.
 */

import type { BoardId, StudentProfileId } from "./foundation";

/* ------------------------------------------------------------------ */
/* Class level                                                         */
/* ------------------------------------------------------------------ */

export type ClassLevel = 10 | 11 | 12;

/* ------------------------------------------------------------------ */
/* Stream (Class 11-12)                                                */
/* ------------------------------------------------------------------ */

export type Stream =
  | "pcm"
  | "pcb"
  | "pcmb"
  | "commerce"
  | "humanities"
  | "vocational"
  | "custom";

export const STREAM_LABELS: Record<Stream, string> = {
  pcm: "Physics, Chemistry, Mathematics",
  pcb: "Physics, Chemistry, Biology",
  pcmb: "Physics, Chemistry, Mathematics, Biology",
  commerce: "Commerce",
  humanities: "Humanities",
  vocational: "Vocational",
  custom: "Custom combination",
};

/* ------------------------------------------------------------------ */
/* Subject category                                                    */
/* ------------------------------------------------------------------ */

/**
 * Classifies a subject within a board's structure.
 * Helps distinguish core, language, elective, and additional subjects.
 */
export type SubjectCategory =
  | "language"
  | "core"
  | "elective"
  | "additional"
  | "practical"
  | "other";

/* ------------------------------------------------------------------ */
/* School subject                                                      */
/* ------------------------------------------------------------------ */

/**
 * A single subject with marks breakdown.
 * Flexible enough to support any board's reporting style.
 */
export interface SchoolSubject {
  /** Stable unique id (uuid). */
  id: string;
  /** Display name (e.g. "Mathematics", "Tamil", "Physics"). */
  name: string;
  /** Board-defined category (language, core, elective, etc.). */
  category: SubjectCategory;
  /** Maximum possible marks for this subject. */
  maxMarks: number;
  /** Marks obtained by the student. */
  obtainedMarks: number;
  /** Theory component marks (optional — not all boards separate this). */
  theoryMarks?: number;
  /** Practical component marks (optional). */
  practicalMarks?: number;
  /** Internal assessment marks (optional — e.g. CBSE internal). */
  internalMarks?: number;
  /** Letter grade if the board reports grades (optional). */
  grade?: string;
  /** Whether this subject is mandatory for the board/class combination. */
  requiredFor?: string;
  /** Which streams require this subject (empty = all streams). */
  streams?: Stream[];
}

/* ------------------------------------------------------------------ */
/* Board configuration                                                 */
/* ------------------------------------------------------------------ */

/**
 * Defines a board's structure for a given class level.
 * Each board has different subject requirements, mark schemes,
 * and assessment components.
 */
export interface BoardSubjectConfig {
  /** Subject display name. */
  name: string;
  /** Category within the board structure. */
  category: SubjectCategory;
  /** Default max marks (user can override). */
  defaultMaxMarks: number;
  /** Whether this subject is mandatory. */
  mandatory: boolean;
  /** Which streams require this subject (empty = all). */
  streams?: Stream[];
  /** Whether marks are split into theory/practical/internal. */
  hasTheory?: boolean;
  hasPractical?: boolean;
  hasInternal?: boolean;
  /** Theory max marks if split. */
  theoryMaxMarks?: number;
  /** Practical max marks if split. */
  practicalMaxMarks?: number;
  /** Internal assessment max marks if split. */
  internalMaxMarks?: number;
}

export interface BoardClassConfig {
  /** Class level (10, 11, or 12). */
  classLevel: ClassLevel;
  /** Available streams for this class level. */
  streams: Stream[];
  /** Default subjects for each stream. */
  subjectConfigs: Record<Stream, BoardSubjectConfig[]>;
}

export interface BoardConfig {
  /** Unique board identifier. */
  id: string;
  /** Board display name. */
  name: string;
  /** Country / region. */
  region: string;
  /** Available class levels. */
  classLevels: ClassLevel[];
  /** Configuration per class level. */
  classConfigs: Record<ClassLevel, BoardClassConfig>;
}

/* ------------------------------------------------------------------ */
/* School academic result                                              */
/* ------------------------------------------------------------------ */

/**
 * A complete academic result for a class level + board combination.
 */
export interface SchoolResult {
  /** Unique result id. */
  id: string;
  /** Student profile this result belongs to. */
  profileId: StudentProfileId;
  /** Board ID reference. */
  boardId: string;
  /** Class level. */
  classLevel: ClassLevel;
  /** Stream (Class 11/12 only). */
  stream?: Stream;
  /** Year the exam was taken. */
  year: number;
  /** Subjects with marks. */
  subjects: SchoolSubject[];
  /** ISO date. */
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Academic performance summary                                        */
/* ------------------------------------------------------------------ */

/**
 * Computed performance data from a set of subjects.
 * All fields are derived — never stored manually.
 */
export interface AcademicPerformance {
  /** Total marks obtained across all subjects. */
  totalObtained: number;
  /** Total maximum marks across all subjects. */
  totalMaximum: number;
  /** Overall percentage (totalObtained / totalMaximum * 100). */
  percentage: number;
  /** Per-subject percentages. */
  subjectPerformances: SubjectPerformance[];
  /** Average percentage across subjects. */
  averagePercentage: number;
  /** Best performing subject name. */
  strongestSubject: string;
  /** Worst performing subject name. */
  weakestSubject: string;
  /** Overall academic level label. */
  academicLevel: AcademicLevel;
  /** Number of subjects below threshold (e.g. < 50%). */
  subjectsBelowPass: number;
}

/**
 * Performance data for a single subject.
 */
export interface SubjectPerformance {
  subjectName: string;
  obtainedMarks: number;
  maxMarks: number;
  percentage: number;
  /** Theory percentage if available. */
  theoryPercentage?: number;
  /** Practical percentage if available. */
  practicalPercentage?: number;
  /** Internal assessment percentage if available. */
  internalPercentage?: number;
  /** Performance band for this subject. */
  level: AcademicLevel;
}

/**
 * Broad performance labels.
 * No fake statistical precision — just clear, understandable bands.
 */
export type AcademicLevel =
  | "excellent"
  | "strong"
  | "competitive"
  | "needs-improvement";

export interface LevelBand {
  level: AcademicLevel;
  label: string;
  minPercentage: number;
  color: string;
  chipBg: string;
}

export const ACADEMIC_LEVELS: LevelBand[] = [
  {
    level: "excellent",
    label: "Excellent",
    minPercentage: 90,
    color: "text-emerald-600 dark:text-emerald-400",
    chipBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    level: "strong",
    label: "Strong",
    minPercentage: 75,
    color: "text-teal-600 dark:text-teal-400",
    chipBg: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  },
  {
    level: "competitive",
    label: "Competitive",
    minPercentage: 60,
    color: "text-sky-600 dark:text-sky-400",
    chipBg: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    level: "needs-improvement",
    label: "Needs Improvement",
    minPercentage: 0,
    color: "text-amber-600 dark:text-amber-400",
    chipBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
];

/* ------------------------------------------------------------------ */
/* Academic pathway                                                    */
/* ------------------------------------------------------------------ */

/**
 * A suggested academic pathway based on stream + class level.
 * This is guidance, not scientifically validated career assessment.
 */
export interface AcademicPathway {
  /** Source stream. */
  stream: Stream;
  /** Class level this guidance applies to. */
  classLevel: ClassLevel;
  /** Possible career/education pathways. */
  pathways: PathwayOption[];
  /** Linked entrance exams (Class 12 bridge). */
  entranceExams: string[];
}

export interface PathwayOption {
  /** Pathway name (e.g. "Engineering / Technology"). */
  name: string;
  /** Brief description. */
  description: string;
  /** Typical degree programmes. */
  programmes: string[];
  /** Whether this is a primary or secondary recommendation. */
  fit: "primary" | "secondary";
}

/* ------------------------------------------------------------------ */
/* Student school profile                                              */
/* ------------------------------------------------------------------ */

/**
 * School-specific profile data stored under classy.school.profiles.v1.
 */
export interface SchoolProfile {
  /** Unique id. */
  id: string;
  /** Student name. */
  name: string;
  /** Board ID (from BoardConfig). */
  boardId: string;
  /** Class level. */
  classLevel: ClassLevel;
  /** Stream (Class 11/12 only). */
  stream?: Stream;
  /** Category for eligibility (General, OBC-NCL, etc.). */
  category?: string;
  /** State for domicile. */
  state?: string;
  /** Completed results. */
  results: SchoolResult[];
  /** Preferred courses for future planning. */
  preferredCourses?: string[];
  /** ISO date. */
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface SchoolValidationErrors {
  name?: string;
  board?: string;
  classLevel?: string;
  stream?: string;
  subjects?: Record<string, SchoolSubjectErrors>;
}

export interface SchoolSubjectErrors {
  name?: string;
  maxMarks?: string;
  obtainedMarks?: string;
  theoryMarks?: string;
  practicalMarks?: string;
  internalMarks?: string;
}
