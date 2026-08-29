/**
 * CLASSY module constants.
 *
 * These complement the existing constants in `@/lib/constants.ts`.
 * New module keys live under the "classy." namespace — never overwriting
 * the existing "classycs." keys.
 */

/* ------------------------------------------------------------------ */
/* Module IDs                                                          */
/* ------------------------------------------------------------------ */

/** Unique identifiers for each functional module. */
export const MODULES = {
  COLLEGE: "college",
  SCHOOL: "school",
  BOARDS: "boards",
  EXAMS: "exams",
  ADMISSIONS: "admissions",
  RECOMMENDATIONS: "recommendations",
  SCENARIOS: "scenarios",
  PROFILES: "profiles",
} as const;

export type ModuleId = (typeof MODULES)[keyof typeof MODULES];

/* ------------------------------------------------------------------ */
/* Rule authority identifiers                                          */
/* ------------------------------------------------------------------ */

/** Known admission authorities. */
export const AUTHORITIES = {
  JOSAA: "JoSAA",
  CSAB: "CSAB",
  TNEA: "TNEA",
  WBJEE: "WBJEE Board",
  MHT_CET: "MHT-CET",
  COMEDK: "COMEDK",
  BITS: "BITS Pilani",
  KCET: "KCET",
  OTHER: "Other",
} as const;

/* ------------------------------------------------------------------ */
/* Academic year helper                                                */
/* ------------------------------------------------------------------ */

/**
 * Returns the current academic year string (e.g. "2025-26").
 * Assumes the academic year runs April–March.
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${String(year + 1).slice(2)}`;
}

/* ------------------------------------------------------------------ */
/* Category definitions                                                */
/* ------------------------------------------------------------------ */

/** Standard reservation categories for Indian admissions. */
export const CATEGORIES = [
  "General",
  "OBC-NCL",
  "SC",
  "ST",
  "EWS",
  "General-PwD",
  "OBC-NCL-PwD",
  "SC-PwD",
  "ST-PwD",
  "EWS-PwD",
] as const;

export type Category = (typeof CATEGORIES)[number];
