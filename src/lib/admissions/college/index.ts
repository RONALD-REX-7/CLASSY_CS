/**
 * College recommendation module — barrel export.
 */

// Classification
export {
  classify,
  classifyRankBased,
  classifyMarksBased,
  computeHistoricalRange,
  calculateScoreGap,
} from "./classification";

// Recommendations
export {
  generateRecommendations,
  createWhatIfScenario,
  compareScenarios,
  comparePathways,
  compareColleges,
  assessAdmissionReadiness,
  generateActionPlan,
  type RecommendationInput,
} from "./recommendation";

// Courses
export {
  ENGINEERING_COURSES,
  MEDICAL_COURSES,
  ALL_COURSES,
  getCoursesByCategory,
  getCoursesByPathway,
} from "./courses";
