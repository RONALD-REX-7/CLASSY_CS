/**
 * Global app constants.
 * Centralising these keeps the brand consistent across the landing page,
 * calculator, footer and stored data.
 */

export const APP_NAME = "CLASSY_CS";
export const APP_TAGLINE = "Your GPA, beautifully calculated.";
export const APP_VERSION = "1.1.0";

/** localStorage keys — versioned so future migrations are trivial. */
export const STORAGE_KEYS = {
  subjects: "classycs.subjects.v1",
  /** Optional student name + semester shown on PDF/print reports. */
  profile: "classycs.profile.v1",
  theme: "classycs-theme",
} as const;

/** Export / import file name for JSON data transfers. */
export const EXPORT_FILE_NAME = "classycs-data.json";

/** Structured PDF report file name. */
export const PDF_FILE_NAME = "classycs-gpa-report.pdf";
