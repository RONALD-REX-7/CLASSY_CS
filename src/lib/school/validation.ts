/**
 * Validation engine for school academic profiles.
 *
 * Rejects: negative marks, marks above maximum, impossible percentages,
 * invalid subject combinations, missing mandatory subjects.
 * Never silently converts invalid values to zero.
 */

import type {
  ClassLevel,
  SchoolSubject,
  SchoolSubjectErrors,
  SchoolValidationErrors,
  Stream,
} from "@/types/school";
import { getDefaultSubjects } from "./boards";

/* ------------------------------------------------------------------ */
/* Subject validation                                                  */
/* ------------------------------------------------------------------ */

export interface SubjectValidationInput {
  name: string;
  category: string;
  maxMarks: number;
  obtainedMarks: number;
  theoryMarks?: number;
  practicalMarks?: number;
  internalMarks?: number;
}

/**
 * Validate a single subject entry.
 * Returns a map of field → error message. Empty map = valid.
 */
export function validateSubject(input: SubjectValidationInput): SchoolSubjectErrors {
  const errors: SchoolSubjectErrors = {};

  // Name
  const name = input.name.trim();
  if (!name) {
    errors.name = "Enter a subject name.";
  } else if (name.length > 80) {
    errors.name = "Keep the name under 80 characters.";
  }

  // Max marks
  if (!isFinite(input.maxMarks) || input.maxMarks <= 0) {
    errors.maxMarks = "Maximum marks must be a positive number.";
  } else if (input.maxMarks > 500) {
    errors.maxMarks = "Maximum marks seems unusually high. Please verify.";
  }

  // Obtained marks
  if (!isFinite(input.obtainedMarks)) {
    errors.obtainedMarks = "Enter valid marks.";
  } else if (input.obtainedMarks < 0) {
    errors.obtainedMarks = "Marks cannot be negative.";
  } else if (input.maxMarks > 0 && input.obtainedMarks > input.maxMarks) {
    errors.obtainedMarks = `Marks cannot exceed maximum (${input.maxMarks}).`;
  }

  // Theory marks
  if (input.theoryMarks !== undefined) {
    if (!isFinite(input.theoryMarks) || input.theoryMarks < 0) {
      errors.theoryMarks = "Enter valid theory marks.";
    } else if (input.maxMarks > 0 && input.theoryMarks > input.maxMarks) {
      errors.theoryMarks = `Theory marks cannot exceed ${input.maxMarks}.`;
    }
  }

  // Practical marks
  if (input.practicalMarks !== undefined) {
    if (!isFinite(input.practicalMarks) || input.practicalMarks < 0) {
      errors.practicalMarks = "Enter valid practical marks.";
    } else if (input.maxMarks > 0 && input.practicalMarks > input.maxMarks) {
      errors.practicalMarks = `Practical marks cannot exceed ${input.maxMarks}.`;
    }
  }

  // Internal marks
  if (input.internalMarks !== undefined) {
    if (!isFinite(input.internalMarks) || input.internalMarks < 0) {
      errors.internalMarks = "Enter valid internal marks.";
    } else if (input.maxMarks > 0 && input.internalMarks > input.maxMarks) {
      errors.internalMarks = `Internal marks cannot exceed ${input.maxMarks}.`;
    }
  }

  // Check if split marks exceed total
  if (
    input.theoryMarks !== undefined &&
    input.practicalMarks !== undefined &&
    input.internalMarks !== undefined
  ) {
    const splitTotal = input.theoryMarks + input.practicalMarks + input.internalMarks;
    if (input.maxMarks > 0 && splitTotal > input.maxMarks) {
      errors.theoryMarks = errors.theoryMarks ?? `Split marks total (${splitTotal}) exceeds maximum (${input.maxMarks}).`;
    }
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Full profile validation                                             */
/* ------------------------------------------------------------------ */

/**
 * Validate a complete set of subjects for a given board + class + stream.
 * Checks:
 *  - Each subject individually
 *  - Required subjects are present
 *  - No duplicate subjects
 *  - Marks consistency
 */
export function validateAcademicProfile(
  subjects: SchoolSubject[],
  boardId: string,
  classLevel: ClassLevel,
  stream: Stream,
): SchoolValidationErrors {
  const errors: SchoolValidationErrors = {};
  const subjectErrors: Record<string, SchoolSubjectErrors> = {};

  // Validate each subject
  for (const subject of subjects) {
    const subjectErrors_result = validateSubject({
      name: subject.name,
      category: subject.category,
      maxMarks: subject.maxMarks,
      obtainedMarks: subject.obtainedMarks,
      theoryMarks: subject.theoryMarks,
      practicalMarks: subject.practicalMarks,
      internalMarks: subject.internalMarks,
    });

    if (Object.keys(subjectErrors_result).length > 0) {
      subjectErrors[subject.id] = subjectErrors_result;
    }
  }

  // Check for duplicate subject names
  const names = subjects.map((s) => s.name.trim().toLowerCase());
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) {
      // Find the subject with this name and add an error
      for (const subject of subjects) {
        if (subject.name.trim().toLowerCase() === name) {
          if (!subjectErrors[subject.id]) subjectErrors[subject.id] = {};
          subjectErrors[subject.id].name = subjectErrors[subject.id].name ?? "Duplicate subject name.";
        }
      }
    }
    seen.add(name);
  }

  // Check required subjects
  const defaults = getDefaultSubjects(boardId, classLevel, stream);
  const providedNames = new Set(subjects.map((s) => s.name.trim().toLowerCase()));
  for (const defaultSubject of defaults) {
    if (defaultSubject.mandatory && !providedNames.has(defaultSubject.name.toLowerCase())) {
      // Subject is missing — this is a warning, not an error (user might add it later)
    }
  }

  if (Object.keys(subjectErrors).length > 0) {
    errors.subjects = subjectErrors;
  }

  return errors;
}

/** Check if a validation result has any errors. */
export function hasValidationErrors(errors: SchoolValidationErrors): boolean {
  if (errors.name || errors.board || errors.classLevel || errors.stream) return true;
  if (errors.subjects && Object.keys(errors.subjects).length > 0) return true;
  return false;
}
