export interface CourseRecord {
  courseCode: string;
  credits: number;
  gradePoints: number;
}

export function calculateCgpa(courses: CourseRecord[]): number {
  if (courses.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    totalPoints += c.credits * c.gradePoints;
    totalCredits += c.credits;
  }
  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
}
