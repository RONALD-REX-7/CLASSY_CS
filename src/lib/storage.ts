/**
 * Namespaced localStorage layer for CLASSY modules.
 *
 * All new modules (School, Boards, Exams, Admissions, etc.) store data
 * under "classy.*" keys to avoid collisions with existing College data
 * (which uses "classycs.*" keys).
 *
 * RULES:
 *  - Never read or write unknown keys.
 *  - All access is try/catch (private browsing can throw).
 *  - Every function is synchronous and side-effect free (except the
 *    actual localStorage write).
 *  - Old keys are never removed — only new ones are added.
 */

import type {
  AcademicResult,
  AdmissionRule,
  College,
  Course,
  Cutoff,
  DataSource,
  Recommendation,
  Scenario,
  StudentProfile,
} from "@/types";
import { createId } from "./gpa";

/* ------------------------------------------------------------------ */
/* Storage key namespace                                               */
/* ------------------------------------------------------------------ */

/**
 * Central map of all storage keys for new modules.
 *
 * Existing keys (DO NOT TOUCH):
 *   classycs.subjects.v1
 *   classycs.semesters.v1
 *   classycs.profile.v1
 *   classycs-theme
 *
 * New module keys live under the "classy." namespace.
 */
export const MODULE_STORAGE_KEYS = {
  /** Student profiles. */
  profiles: "classy.profiles.v1",
  /** Academic results (board exams, entrance exams). */
  academicResults: "classy.results.v1",
  /** Education boards. */
  boards: "classy.boards.v1",
  /** Entrance exams. */
  entranceExams: "classy.exams.v1",
  /** Colleges. */
  colleges: "classy.colleges.v1",
  /** Courses. */
  courses: "classy.courses.v1",
  /** Cutoff data. */
  cutoffs: "classy.cutoffs.v1",
  /** Admission rules. */
  rules: "classy.rules.v1",
  /** User-created scenarios. */
  scenarios: "classy.scenarios.v1",
  /** Generated recommendations. */
  recommendations: "classy.recommendations.v1",
  /** Data provenance / sources. */
  dataSources: "classy.sources.v1",
} as const;

/* ------------------------------------------------------------------ */
/* Generic read/write helpers                                          */
/* ------------------------------------------------------------------ */

/**
 * Read a JSON array from localStorage and parse it safely.
 * Returns an empty array if the key is missing or corrupt.
 */
function readArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Write a JSON array to localStorage safely.
 * Silently ignores storage errors (private mode, quota exceeded).
 */
function writeArray<T>(key: string, data: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage unavailable — keep working in-memory */
  }
}

/**
 * Read a single JSON object from localStorage.
 * Returns null if missing or corrupt.
 */
function readObject<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Write a single JSON object to localStorage.
 */
function writeObject<T>(key: string, data: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

/* ------------------------------------------------------------------ */
/* Typed collection helpers                                            */
/* ------------------------------------------------------------------ */

/**
 * Generic CRUD for any entity stored as a localStorage array.
 *
 * Usage:
 *   const profiles = createCollectionStore<StudentProfile>(MODULE_STORAGE_KEYS.profiles);
 *   const all = profiles.getAll();
 *   profiles.upsert({ ...existing, name: "Updated" });
 *   profiles.remove(id);
 */
export function createCollectionStore<T extends { id: string }>(
  key: string,
) {
  return {
    /** Read all entities. */
    getAll(): T[] {
      return readArray<T>(key);
    },

    /** Find one entity by ID. */
    getById(id: string): T | undefined {
      return readArray<T>(key).find((item) => item.id === id);
    },

    /** Insert a new entity. If an entity with the same ID exists, replace it. */
    upsert(entity: T): void {
      const items = readArray<T>(key);
      const index = items.findIndex((item) => item.id === entity.id);
      if (index >= 0) {
        items[index] = entity;
      } else {
        items.push(entity);
      }
      writeArray(key, items);
    },

    /** Remove an entity by ID. */
    remove(id: string): void {
      const items = readArray<T>(key).filter((item) => item.id !== id);
      writeArray(key, items);
    },

    /** Replace the entire collection. */
    replaceAll(items: T[]): void {
      writeArray(key, items);
    },

    /** Clear all entities. */
    clear(): void {
      writeArray(key, []);
    },

    /** Count of stored entities. */
    count(): number {
      return readArray<T>(key).length;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Pre-built module stores                                             */
/* ------------------------------------------------------------------ */

/** Student profiles collection store. */
export const profileStore = createCollectionStore<StudentProfile>(
  MODULE_STORAGE_KEYS.profiles,
);

/** Academic results collection store. */
export const resultStore = createCollectionStore<AcademicResult>(
  MODULE_STORAGE_KEYS.academicResults,
);

/** Boards collection store. */
export const boardStore = createCollectionStore<import("@/types").Board>(
  MODULE_STORAGE_KEYS.boards,
);

/** Entrance exams collection store. */
export const examStore = createCollectionStore<import("@/types").EntranceExam>(
  MODULE_STORAGE_KEYS.entranceExams,
);

/** Colleges collection store. */
export const collegeStore = createCollectionStore<College>(
  MODULE_STORAGE_KEYS.colleges,
);

/** Courses collection store. */
export const courseStore = createCollectionStore<Course>(
  MODULE_STORAGE_KEYS.courses,
);

/** Cutoffs collection store. */
export const cutoffStore = createCollectionStore<Cutoff>(
  MODULE_STORAGE_KEYS.cutoffs,
);

/** Admission rules collection store. */
export const ruleStore = createCollectionStore<AdmissionRule>(
  MODULE_STORAGE_KEYS.rules,
);

/** Scenarios collection store. */
export const scenarioStore = createCollectionStore<Scenario>(
  MODULE_STORAGE_KEYS.scenarios,
);

/** Recommendations collection store. */
export const recommendationStore = createCollectionStore<Recommendation>(
  MODULE_STORAGE_KEYS.recommendations,
);

/** Data sources collection store. */
export const dataSourceStore = createCollectionStore<DataSource>(
  MODULE_STORAGE_KEYS.dataSources,
);

/* ------------------------------------------------------------------ */
/* Utility: generate branded IDs                                       */
/* ------------------------------------------------------------------ */

/**
 * Generate a branded ID for a specific entity type.
 *
 * The branding is a TypeScript-only compile-time construct. At runtime
 * it's just a UUID string, so localStorage doesn't care about brands.
 */
export function generateId(): string {
  return createId();
}

/* ------------------------------------------------------------------ */
/* Storage health check (for debugging)                                */
/* ------------------------------------------------------------------ */

/**
 * Returns a snapshot of all module storage keys and their sizes.
 * Useful for debugging and data auditing.
 */
export function getStorageSnapshot(): Record<string, { count: number; bytes: number }> {
  const snapshot: Record<string, { count: number; bytes: number }> = {};
  for (const [name, key] of Object.entries(MODULE_STORAGE_KEYS)) {
    try {
      const raw = window.localStorage.getItem(key);
      const bytes = raw ? raw.length * 2 : 0; // UTF-16 = 2 bytes per char
      const parsed = raw ? JSON.parse(raw) : [];
      snapshot[name] = {
        count: Array.isArray(parsed) ? parsed.length : 0,
        bytes,
      };
    } catch {
      snapshot[name] = { count: 0, bytes: 0 };
    }
  }
  return snapshot;
}
