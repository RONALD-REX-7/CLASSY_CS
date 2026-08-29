/**
 * Data provenance types for CLASSY.
 *
 * Every piece of admission/cutoff/rule data should be traceable to its
 * source. This supports transparent recommendations — the user can see
 * exactly where each data point came from and how trustworthy it is.
 */

import type { DataSourceId } from "./foundation";

/* ------------------------------------------------------------------ */
/* Data Source                                                         */
/* ------------------------------------------------------------------ */

/**
 * Where did a piece of data come from?
 *
 * Every data point (cutoff, rule, exam result) can optionally reference
 * a DataSource. This creates an audit trail for the recommendation engine.
 */
export interface DataSource {
  id: DataSourceId;
  /** Short name (e.g. "JoSAA 2024 Official", "CBSE 2024 Results"). */
  name: string;
  /** Authority that published this data. */
  authority: string;
  /** URL of the source document/page. */
  sourceUrl?: string;
  /** What kind of data this source provides. */
  dataType: DataSourceType;
  /** Academic year the data covers. */
  academicYear: string;
  /** When this data was last verified against the source. */
  verifiedAt?: string;
  /** How trustworthy is this data right now? */
  freshness: DataFreshness;
  /** Free-text notes about this source. */
  notes?: string;
}

/** Categories of data sources. */
export type DataSourceType =
  | "cutoff"
  | "rule"
  | "exam-result"
  | "syllabus"
  | "ranking"
  | "seat-matrix"
  | "counseling-schedule"
  | "other";

/**
 * How current is this data?
 *
 * - FRESH:     Updated within the current academic cycle
 * - RECENT:    Updated within the last 12 months
 * - STALE:     Older than 12 months, may need re-verification
 * - UNVERIFIED: Never been checked against the original source
 */
export type DataFreshness = "FRESH" | "RECENT" | "STALE" | "UNVERIFIED";
