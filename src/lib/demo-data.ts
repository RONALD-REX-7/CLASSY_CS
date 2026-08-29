/**
 * Demo mode — fictional data for hackathon judges.
 *
 * ALL DATA IS FICTIONAL. Clearly labelled as such.
 * Never mixes with real student data.
 */

import type { StudentProfile, AcademicResult } from "@/types";
import type { SchoolSubject } from "@/types/school";
import type {
  CollegeExtended,
  CutoffExtended,
  CollegeRecommendation,
  TargetLadder,
  AdmissionReadiness,
} from "@/types/college";

/* ------------------------------------------------------------------ */
/* Demo label                                                          */
/* ------------------------------------------------------------------ */

export const DEMO_LABEL = "DEMO DATA — NOT A REAL STUDENT";
export const DEMO_MODE_KEY = "classy.demoMode";

/* ------------------------------------------------------------------ */
/* Fictional student profile                                           */
/* ------------------------------------------------------------------ */

export const DEMO_PROFILE: StudentProfile = {
  id: "demo-profile-001" as any,
  name: "Priya Sharma",
  rollNumber: "TN-2024-12345",
  birthYear: 2006,
  category: "General",
  state: "Tamil Nadu",
  boardId: "tn-state" as any,
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
};

/* ------------------------------------------------------------------ */
/* Fictional Class 12 subjects                                         */
/* ------------------------------------------------------------------ */

export const DEMO_CLASS12_SUBJECTS: SchoolSubject[] = [
  {
    id: "demo-math",
    name: "Mathematics",
    category: "core",
    maxMarks: 100,
    obtainedMarks: 92,
    requiredFor: "pcm",
  },
  {
    id: "demo-physics",
    name: "Physics",
    category: "core",
    maxMarks: 100,
    obtainedMarks: 88,
    requiredFor: "pcm",
  },
  {
    id: "demo-chemistry",
    name: "Chemistry",
    category: "core",
    maxMarks: 100,
    obtainedMarks: 85,
    requiredFor: "pcm",
  },
  {
    id: "demo-tamil",
    name: "Tamil",
    category: "language",
    maxMarks: 100,
    obtainedMarks: 90,
  },
  {
    id: "demo-english",
    name: "English",
    category: "language",
    maxMarks: 100,
    obtainedMarks: 87,
  },
];

/* ------------------------------------------------------------------ */
/* Fictional TNEA score                                                */
/* ------------------------------------------------------------------ */

export const DEMO_TNEA_SCORE = 186.5; // out of 200
export const DEMO_CATEGORY = "General";
export const DEMO_AUTHORITY = "TNEA";

/* ------------------------------------------------------------------ */
/* Fictional colleges                                                  */
/* ------------------------------------------------------------------ */

export const DEMO_COLLEGES: CollegeExtended[] = [
  {
    id: "demo-college-001" as any,
    name: "Anna University — CEG",
    code: "CEG",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "state-govt",
    officialUrl: "https://ceg.annauniv.edu",
    verifiedAt: "2024-06-01",
  },
  {
    id: "demo-college-002" as any,
    name: "MIT, Chromepet",
    code: "MIT",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "state-govt",
    officialUrl: "https://mitindia.edu",
    verifiedAt: "2024-06-01",
  },
  {
    id: "demo-college-003" as any,
    name: "SSN College of Engineering",
    code: "SSN",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "state-private",
    officialUrl: "https://ssn.edu.in",
    verifiedAt: "2024-06-01",
  },
  {
    id: "demo-college-004" as any,
    name: "PSG College of Technology",
    code: "PSG",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "state-private",
    verifiedAt: "2024-06-01",
  },
  {
    id: "demo-college-005" as any,
    name: "Kumaraguru College of Technology",
    code: "KCT",
    city: "Coimbatore",
    state: "Tamil Nadu",
    type: "state-private",
    verifiedAt: "2024-06-01",
  },
  {
    id: "demo-college-006" as any,
    name: "Sri Sivasubramaniya Nadar College",
    code: "SSN",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "state-private",
    verifiedAt: "2024-06-01",
  },
];

/* ------------------------------------------------------------------ */
/* Fictional cutoff data (TNEA, CSE, General)                          */
/* ------------------------------------------------------------------ */

export const DEMO_CUTOFFS: CutoffExtended[] = [
  // CEG CSE — General — closing rank
  {
    id: "demo-cutoff-001" as any,
    collegeId: "demo-college-001" as any,
    courseId: "demo-course-001" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2023,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 190,
    source: "TNEA 2023 Official Counselling",
    verifiedAt: "2024-01-15",
  },
  {
    id: "demo-cutoff-002" as any,
    collegeId: "demo-college-001" as any,
    courseId: "demo-course-001" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2022,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 188,
    source: "TNEA 2022 Official Counselling",
    verifiedAt: "2023-12-01",
  },
  // MIT CSE — General
  {
    id: "demo-cutoff-003" as any,
    collegeId: "demo-college-002" as any,
    courseId: "demo-course-002" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2023,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 195,
    source: "TNEA 2023 Official Counselling",
    verifiedAt: "2024-01-15",
  },
  {
    id: "demo-cutoff-004" as any,
    collegeId: "demo-college-002" as any,
    courseId: "demo-course-002" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2022,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 193,
    source: "TNEA 2022 Official Counselling",
    verifiedAt: "2023-12-01",
  },
  // SSN CSE — General
  {
    id: "demo-cutoff-005" as any,
    collegeId: "demo-college-003" as any,
    courseId: "demo-course-003" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2023,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 200,
    source: "TNEA 2023 Official Counselling",
    verifiedAt: "2024-01-15",
  },
  // PSG CSE — General
  {
    id: "demo-cutoff-006" as any,
    collegeId: "demo-college-004" as any,
    courseId: "demo-course-004" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2023,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 196,
    source: "TNEA 2023 Official Counselling",
    verifiedAt: "2024-01-15",
  },
  // KCT CSE — General
  {
    id: "demo-cutoff-007" as any,
    collegeId: "demo-college-005" as any,
    courseId: "demo-course-005" as any,
    authority: "TNEA",
    admissionPath: "general",
    category: "General",
    quota: "state",
    year: 2023,
    round: 1,
    cutoffType: "closing-rank",
    cutoffValue: 210,
    source: "TNEA 2023 Official Counselling",
    verifiedAt: "2024-01-15",
  },
];

/* ------------------------------------------------------------------ */
/* Fictional recommendation ladder (pre-computed for demo)             */
/* ------------------------------------------------------------------ */

export const DEMO_TARGET_LADDER: TargetLadder = {
  safe: [
    {
      collegeId: "demo-college-005" as any,
      collegeName: "Kumaraguru College of Technology",
      courseId: "demo-course-005" as any,
      courseName: "CSE",
      classification: "SAFE",
      explanation:
        "SAFE — Your TNEA score 186.5 is within the historical range (190–210) for KCT CSE. Based on 2023 data, this is a strong position.",
      studentScore: 186.5,
      cutoffValue: 210,
      historicalRange: { min: 190, max: 210 },
      scoreGap: -23.5,
      authority: "TNEA",
      admissionPath: "general",
      category: "General",
      eligibilityPassed: true,
      sources: ["TNEA 2023 Official Counselling"],
      city: "Coimbatore",
      state: "Tamil Nadu",
      institutionType: "state-private",
    },
  ],
  target: [
    {
      collegeId: "demo-college-003" as any,
      collegeName: "SSN College of Engineering",
      courseId: "demo-course-003" as any,
      courseName: "CSE",
      classification: "TARGET",
      explanation:
        "TARGET — Your TNEA score 186.5 falls within the historical range (188–200) for SSN CSE. This is competitive based on 2023 data.",
      studentScore: 186.5,
      cutoffValue: 200,
      historicalRange: { min: 188, max: 200 },
      scoreGap: -13.5,
      authority: "TNEA",
      admissionPath: "general",
      category: "General",
      eligibilityPassed: true,
      sources: ["TNEA 2023 Official Counselling"],
      city: "Chennai",
      state: "Tamil Nadu",
      institutionType: "state-private",
    },
    {
      collegeId: "demo-college-004" as any,
      collegeName: "PSG College of Technology",
      courseId: "demo-course-004" as any,
      courseName: "CSE",
      classification: "TARGET",
      explanation:
        "TARGET — Your TNEA score 186.5 falls within the historical range (188–196) for PSG CSE. This is competitive based on 2023 data.",
      studentScore: 186.5,
      cutoffValue: 196,
      historicalRange: { min: 188, max: 196 },
      scoreGap: -9.5,
      authority: "TNEA",
      admissionPath: "general",
      category: "General",
      eligibilityPassed: true,
      sources: ["TNEA 2023 Official Counselling"],
      city: "Coimbatore",
      state: "Tamil Nadu",
      institutionType: "state-private",
    },
  ],
  reach: [
    {
      collegeId: "demo-college-002" as any,
      collegeName: "MIT, Chromepet",
      courseId: "demo-course-002" as any,
      courseName: "CSE",
      classification: "REACH",
      explanation:
        "REACH — Your TNEA score 186.5 is above the historical range (188–195) for MIT CSE. Admission is possible but not certain.",
      studentScore: 186.5,
      cutoffValue: 195,
      historicalRange: { min: 188, max: 195 },
      scoreGap: 8.5,
      authority: "TNEA",
      admissionPath: "general",
      category: "General",
      eligibilityPassed: true,
      sources: ["TNEA 2023 Official Counselling"],
      city: "Chennai",
      state: "Tamil Nadu",
      institutionType: "state-govt",
    },
    {
      collegeId: "demo-college-001" as any,
      collegeName: "Anna University — CEG",
      courseId: "demo-course-001" as any,
      courseName: "CSE",
      classification: "REACH",
      explanation:
        "REACH — Your TNEA score 186.5 is above the historical range (188–190) for CEG CSE. Admission is possible but not certain.",
      studentScore: 186.5,
      cutoffValue: 190,
      historicalRange: { min: 188, max: 190 },
      scoreGap: 3.5,
      authority: "TNEA",
      admissionPath: "general",
      category: "General",
      eligibilityPassed: true,
      sources: ["TNEA 2023 Official Counselling"],
      city: "Chennai",
      state: "Tamil Nadu",
      institutionType: "state-govt",
    },
  ],
  backup: [],
};

/* ------------------------------------------------------------------ */
/* Fictional admission readiness                                       */
/* ------------------------------------------------------------------ */

export const DEMO_READINESS: AdmissionReadiness = {
  level: "STRONG",
  factors: {
    eligibilityCompleteness: { score: 1, max: 1, label: "Category: General, State: Tamil Nadu" },
    academicReadiness: { score: 1, max: 1, label: "Class 12: 88.4%" },
    entranceReadiness: { score: 0.8, max: 1, label: "TNEA score: 186.5/200" },
    targetCompetitiveness: { score: 0.6, max: 1, label: "2 targets identified" },
    profileCompleteness: { score: 1, max: 1, label: "Profile complete" },
  },
  summary:
    "STRONG — You have a solid academic profile, competitive entrance score, and multiple viable targets. Focus on counselling strategy.",
};
