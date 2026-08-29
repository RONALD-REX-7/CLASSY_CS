/**
 * Foundation types for CLASSY expansion modules.
 *
 * These types are intentionally minimal and forward-looking. They establish
 * the data contracts that School, Boards, Exams, Admissions, Recommendations,
 * and Scenarios modules will consume — without over-engineering fields that
 * have no concrete use yet.
 *
 * RULE: All new types must be importable without side effects. No runtime
 * code, no default values, no React components — pure type definitions.
 */

/* ------------------------------------------------------------------ */
/* IDs                                                                 */
/* ------------------------------------------------------------------ */

/** Branded string types prevent accidentally swapping IDs at compile time. */
export type StudentProfileId = string & { readonly __brand: "StudentProfileId" };
export type BoardId = string & { readonly __brand: "BoardId" };
export type EntranceExamId = string & { readonly __brand: "EntranceExamId" };
export type CollegeId = string & { readonly __brand: "CollegeId" };
export type CourseId = string & { readonly __brand: "CourseId" };
export type AcademicResultId = string & { readonly __brand: "AcademicResultId" };
export type AdmissionRuleId = string & { readonly __brand: "AdmissionRuleId" };
export type ScenarioId = string & { readonly __brand: "ScenarioId" };
export type RecommendationId = string & { readonly __brand: "RecommendationId" };
export type CutoffId = string & { readonly __brand: "CutoffId" };
export type DataSourceId = string & { readonly __brand: "DataSourceId" };

/* ------------------------------------------------------------------ */
/* Student Profile                                                     */
/* ------------------------------------------------------------------ */

/** A student's static academic identity. */
export interface StudentProfile {
  id: StudentProfileId;
  /** Full display name. */
  name: string;
  /** Optional roll / registration number. */
  rollNumber?: string;
  /** Year of birth or graduation — used for age-based eligibility. */
  birthYear?: number;
  /** Category for reservation-based rules (e.g. "General", "OBC", "SC", "ST"). */
  category?: string;
  /** Home state for domicile-based admissions. */
  state?: string;
  /** Board ID reference for 10th/12th results. */
  boardId?: BoardId;
  /** ISO date of profile creation. */
  createdAt: string;
  /** ISO date of last modification. */
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Academic Result                                                     */
/* ------------------------------------------------------------------ */

/** A single exam result attached to a student profile. */
export interface AcademicResult {
  id: AcademicResultId;
  /** The student profile this result belongs to. */
  profileId: StudentProfileId;
  /** What kind of exam (e.g. "board-10th", "board-12th", "jee-main", "neet", "tnea"). */
  examType: ExamType;
  /** Year the exam was taken. */
  year: number;
  /** Total marks obtained. */
  marksObtained: number;
  /** Maximum possible marks. */
  marksMaximum: number;
  /** Percentage or percentile — computed, not stored manually. */
  percentage: number;
  /** Rank, if applicable (entrance exams). */
  rank?: number;
  /** Subject-wise breakdown. */
  subjects: ExamSubjectResult[];
  /** Reference to where this data was sourced. */
  dataSourceId?: DataSourceId;
  /** ISO date. */
  createdAt: string;
  updatedAt: string;
}

/** Recognized exam categories. */
export type ExamType =
  | "board-10th"
  | "board-12th"
  | "jee-main"
  | "jee-advanced"
  | "neet"
  | "tnea"
  | "wbjee"
  | "mht-cet"
  | "comede-k"
  | "bitsat"
  | "other";

/** A subject result within an exam. */
export interface ExamSubjectResult {
  name: string;
  marksObtained: number;
  marksMaximum: number;
  /** Grade, if the board reports grades instead of marks. */
  grade?: string;
}

/* ------------------------------------------------------------------ */
/* Board                                                               */
/* ------------------------------------------------------------------ */

/** An education board (CBSE, ICSE, State boards, etc.). */
export interface Board {
  id: BoardId;
  name: string;
  /** ISO 3166-1 alpha-2 country code or state code. */
  region: string;
  /** Grading scale identifier — references a normalization rule. */
  gradingScale: string;
  /** Whether this board uses marks (0–100) or grades (A+, A, …). */
  reportingMode: "marks" | "grades" | "both";
  dataSource?: DataSourceId;
}

/* ------------------------------------------------------------------ */
/* Entrance Exam                                                       */
/* ------------------------------------------------------------------ */

/** An entrance examination (JEE, NEET, TNEA, etc.). */
export interface EntranceExam {
  id: EntranceExamId;
  /** Short display name (e.g. "JEE Main"). */
  name: string;
  /** Exam type for classification. */
  examType: ExamType;
  /** Year. */
  year: number;
  /** Total marks. */
  totalMarks: number;
  /** Marking scheme description (e.g. "+4 / -1"). */
  markingScheme?: string;
  /** Normalization method used across sessions, if any. */
  normalizationMethod?: string;
  /** Official website URL. */
  officialUrl?: string;
  dataSource?: DataSourceId;
}

/* ------------------------------------------------------------------ */
/* College + Course                                                    */
/* ------------------------------------------------------------------ */

/** A college or institution. */
export interface College {
  id: CollegeId;
  name: string;
  /** Short code if available (e.g. "IITB"). */
  code?: string;
  /** Location. */
  city?: string;
  state?: string;
  /** NIRF ranking tier, if known. */
  rankingTier?: string;
  /** Type of institution. */
  institutionType?: "iit" | "nit" | "iiit" | "bits" | "state" | "private" | "deemed" | "other";
  dataSource?: DataSourceId;
}

/** A specific course/programme offered by a college. */
export interface Course {
  id: CourseId;
  collegeId: CollegeId;
  name: string;
  /** e.g. "B.Tech", "MBBS", "B.Sc". */
  degree: string;
  /** e.g. "Computer Science", "Mechanical". */
  branch?: string;
  /** Duration in years. */
  durationYears?: number;
  /** Total seats. */
  totalSeats?: number;
}

/* ------------------------------------------------------------------ */
/* Cutoff                                                              */
/* ------------------------------------------------------------------ */

/** A recorded admission cutoff for a college + course combination. */
export interface Cutoff {
  id: CutoffId;
  collegeId: CollegeId;
  courseId: CourseId;
  /** The entrance exam this cutoff applies to. */
  examType: ExamType;
  year: number;
  /** Category-specific cutoff. */
  category: string;
  /** Closing rank or closing marks, depending on examType. */
  closingValue: number;
  /** Whether the closing value is a rank or a mark. */
  valueType: "rank" | "marks" | "percentile";
  round?: number;
  dataSource?: DataSourceId;
}

/* ------------------------------------------------------------------ */
/* Scenario (what-if)                                                  */
/* ------------------------------------------------------------------ */

/** A user-created what-if scenario for exploring admission possibilities. */
export interface Scenario {
  id: ScenarioId;
  profileId: StudentProfileId;
  /** Human-readable label (e.g. "If I score 280 in JEE Main"). */
  label: string;
  /** Hypothetical exam results. */
  hypotheticalResults: Partial<AcademicResult>[];
  /** Preferred college/course IDs to check against. */
  preferredColleges: { collegeId: CollegeId; courseId: CourseId }[];
  /** ISO date. */
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Recommendation                                                      */
/* ------------------------------------------------------------------ */

/** A computed admission recommendation based on profile + rules + cutoffs. */
export interface Recommendation {
  id: RecommendationId;
  scenarioId: ScenarioId;
  collegeId: CollegeId;
  courseId: CourseId;
  /** Probability assessment. */
  likelihood: "high" | "medium" | "low" | "unlikely";
  /** Which rules were evaluated to produce this result. */
  appliedRuleIds: AdmissionRuleId[];
  /** Human-readable reasoning. */
  reasoning: string;
  /** Confidence in this recommendation. */
  confidence: number; // 0–1
  createdAt: string;
}
