/**
 * CLASSY integration components — barrel export.
 *
 * These are additive-only components for the admission intelligence layer.
 * They do NOT modify or replace existing CLASSY components.
 */

export {
  SourceLabel,
  ExplainableResult,
  ClassificationBadge,
  type ExplainableResultProps,
  type DataSourceLabel,
} from "./explainable-result";

export {
  StudentAdmissionReport,
  type StudentReportProps,
} from "./student-report";

export {
  WhatIfReport,
  type WhatIfReportProps,
} from "./what-if-report";

export {
  ActionPlanDisplay,
} from "./action-plan";
