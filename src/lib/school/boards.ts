/**
 * Board configurations for CLASSY School module.
 *
 * Each board defines:
 *  - Which class levels are supported
 *  - Available streams per class level
 *  - Default subject structures per stream
 *  - Mark schemes (theory, practical, internal)
 *
 * RULES:
 *  - No arbitrary multipliers or normalization
 *  - No fake conversions
 *  - If a conversion is unknown, it is clearly labeled as such
 *  - Subject structures come from real board documentation
 */

import type {
  BoardClassConfig,
  BoardConfig,
  ClassLevel,
  SchoolSubject,
  Stream,
} from "@/types/school";
import { createId } from "../gpa";

/* ------------------------------------------------------------------ */
/* Tamil Nadu State Board (tn-state)                                   */
/* ------------------------------------------------------------------ */

const TN_STATE_CLASS_10: BoardClassConfig = {
  classLevel: 10,
  streams: ["custom"],
  subjectConfigs: {
    custom: [
      { name: "Tamil", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Science", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Social Science", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Hindi / Other Language", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    pcm: [], pcb: [], pcmb: [], commerce: [], humanities: [], vocational: [],
  },
};

const TN_STATE_CLASS_11_12 = (classLevel: ClassLevel): BoardClassConfig => ({
  classLevel,
  streams: ["pcm", "pcb", "pcmb", "commerce", "humanities"],
  subjectConfigs: {
    custom: [],
    pcm: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true, streams: ["pcm", "pcmb"] },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
    ],
    pcb: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcb", "pcmb"] },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
    ],
    pcmb: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true, streams: ["pcm", "pcmb"] },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcb", "pcmb"] },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, theoryMaxMarks: 70, practicalMaxMarks: 30, streams: ["pcm", "pcb", "pcmb"] },
    ],
    commerce: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Commerce", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Economics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Accountancy", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Business Mathematics / Computer Applications", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    humanities: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "History", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Political Science", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Economics / Geography", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Sociology / Psychology", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    vocational: [
      { name: "Tamil / Hindi", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 1", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 2", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 3", category: "core", defaultMaxMarks: 100, mandatory: true },
    ],
  },
});

/* ------------------------------------------------------------------ */
/* CBSE                                                                */
/* ------------------------------------------------------------------ */

const CBSE_CLASS_10: BoardClassConfig = {
  classLevel: 10,
  streams: ["custom"],
  subjectConfigs: {
    custom: [
      { name: "English Language & Literature", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Hindi Course A / Course B", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Mathematics (Standard / Basic)", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Science", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 60, practicalMaxMarks: 20, internalMaxMarks: 20 },
      { name: "Social Science", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Additional Subject (Optional)", category: "additional", defaultMaxMarks: 100, mandatory: false, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
    ],
    pcm: [], pcb: [], pcmb: [], commerce: [], humanities: [], vocational: [],
  },
};

const CBSE_CLASS_11_12 = (classLevel: ClassLevel): BoardClassConfig => ({
  classLevel,
  streams: ["pcm", "pcb", "pcmb", "commerce", "humanities"],
  subjectConfigs: {
    custom: [],
    pcm: [
      { name: "English Core / Elective", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20, streams: ["pcm", "pcmb"] },
      { name: "Physical Education / Computer Science / Informatics Practices", category: "elective", defaultMaxMarks: 100, mandatory: false, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10 },
    ],
    pcb: [
      { name: "English Core / Elective", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10, streams: ["pcm", "pcb", "pcmb"] },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10, streams: ["pcb", "pcmb"] },
      { name: "Physical Education / Psychology / Sociology", category: "elective", defaultMaxMarks: 100, mandatory: false, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
    ],
    pcmb: [
      { name: "English Core / Elective", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10 },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10 },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 70, practicalMaxMarks: 20, internalMaxMarks: 10 },
    ],
    commerce: [
      { name: "English Core / Elective", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Accountancy", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Business Studies", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Economics", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Mathematics / Physical Education / Informatics Practices", category: "elective", defaultMaxMarks: 100, mandatory: false, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
    ],
    humanities: [
      { name: "English Core / Elective", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "History", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Political Science", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Economics / Geography / Sociology", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Psychology / Physical Education / Fine Arts", category: "elective", defaultMaxMarks: 100, mandatory: false, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
    ],
    vocational: [
      { name: "English Core", category: "language", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasInternal: true, theoryMaxMarks: 80, internalMaxMarks: 20 },
      { name: "Vocational Subject 1", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 50, practicalMaxMarks: 30, internalMaxMarks: 20 },
      { name: "Vocational Subject 2", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 50, practicalMaxMarks: 30, internalMaxMarks: 20 },
      { name: "Vocational Subject 3", category: "core", defaultMaxMarks: 100, mandatory: true, hasTheory: true, hasPractical: true, hasInternal: true, theoryMaxMarks: 50, practicalMaxMarks: 30, internalMaxMarks: 20 },
    ],
  },
});

/* ------------------------------------------------------------------ */
/* International — extensible framework                                */
/* ------------------------------------------------------------------ */

const INTERNATIONAL_CLASS_10: BoardClassConfig = {
  classLevel: 10,
  streams: ["custom"],
  subjectConfigs: {
    custom: [
      { name: "First Language", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Second Language", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Science", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Humanities / Social Studies", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Elective 1", category: "elective", defaultMaxMarks: 100, mandatory: false },
      { name: "Elective 2", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    pcm: [], pcb: [], pcmb: [], commerce: [], humanities: [], vocational: [],
  },
};

const INTERNATIONAL_CLASS_11_12 = (classLevel: ClassLevel): BoardClassConfig => ({
  classLevel,
  streams: ["pcm", "pcb", "pcmb", "commerce", "humanities", "custom"],
  subjectConfigs: {
    custom: [],
    pcm: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Elective 1", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    pcb: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Elective 1", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    pcmb: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Physics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Chemistry", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Mathematics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Biology", category: "core", defaultMaxMarks: 100, mandatory: true },
    ],
    commerce: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Accountancy", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Business Studies", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Economics", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Elective 1", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    humanities: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "History", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Political Science / Sociology", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Economics / Geography", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Elective 1", category: "elective", defaultMaxMarks: 100, mandatory: false },
    ],
    vocational: [
      { name: "English", category: "language", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 1", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 2", category: "core", defaultMaxMarks: 100, mandatory: true },
      { name: "Vocational Subject 3", category: "core", defaultMaxMarks: 100, mandatory: false },
    ],
  },
});

/* ------------------------------------------------------------------ */
/* Assemble all board configs                                          */
/* ------------------------------------------------------------------ */

export const BOARD_CONFIGS: BoardConfig[] = [
  {
    id: "tn-state",
    name: "Tamil Nadu State Board",
    region: "IN-TN",
    classLevels: [10, 11, 12],
    classConfigs: {
      10: TN_STATE_CLASS_10,
      11: TN_STATE_CLASS_11_12(11),
      12: TN_STATE_CLASS_11_12(12),
    },
  },
  {
    id: "cbse",
    name: "CBSE",
    region: "IN",
    classLevels: [10, 11, 12],
    classConfigs: {
      10: CBSE_CLASS_10,
      11: CBSE_CLASS_11_12(11),
      12: CBSE_CLASS_11_12(12),
    },
  },
  {
    id: "international",
    name: "International (Generic)",
    region: "INTL",
    classLevels: [10, 11, 12],
    classConfigs: {
      10: INTERNATIONAL_CLASS_10,
      11: INTERNATIONAL_CLASS_11_12(11),
      12: INTERNATIONAL_CLASS_11_12(12),
    },
  },
];

/* ------------------------------------------------------------------ */
/* Board lookup helpers                                                */
/* ------------------------------------------------------------------ */

/** Get a board config by ID. */
export function getBoardById(id: string): BoardConfig | undefined {
  return BOARD_CONFIGS.find((b) => b.id === id);
}

/** Get all available streams for a board + class level. */
export function getStreamsForBoard(boardId: string, classLevel: ClassLevel): Stream[] {
  const board = getBoardById(boardId);
  return board?.classConfigs[classLevel]?.streams ?? [];
}

/** Get default subjects for a board + class level + stream. */
export function getDefaultSubjects(
  boardId: string,
  classLevel: ClassLevel,
  stream: Stream,
) {
  const board = getBoardById(boardId);
  if (!board) return [];
  const classConfig = board.classConfigs[classLevel];
  if (!classConfig) return [];
  return classConfig.subjectConfigs[stream] ?? [];
}

/**
 * Create SchoolSubject instances from BoardSubjectConfig defaults.
 * Each gets a fresh UUID and zero marks (user fills in).
 */
export function createSubjectsFromDefaults(
  configs: ReturnType<typeof getDefaultSubjects>,
): SchoolSubject[] {
  return configs.map((config) => ({
    id: createId(),
    name: config.name,
    category: config.category,
    maxMarks: config.defaultMaxMarks,
    obtainedMarks: 0,
    theoryMarks: config.hasTheory ? 0 : undefined,
    practicalMarks: config.hasPractical ? 0 : undefined,
    internalMarks: config.hasInternal ? 0 : undefined,
    grade: undefined,
    requiredFor: config.mandatory ? "required" : undefined,
    streams: config.streams,
  }));
}
