import type { CourseRecord } from "./cgpa_calculator";

export function exportTranscriptCsv(courses: CourseRecord[]): string {
  const header = "CourseCode,Credits,GradePoints\n";
  const rows = courses.map(c => `${c.courseCode},${c.credits},${c.gradePoints}`).join("\n");
  return header + rows;
}
