export type DegreeClass = "FIRST_CLASS_DISTINCTION" | "FIRST_CLASS" | "SECOND_CLASS";

export function classifyDegree(cgpa: number, hasArrearHistory: boolean): DegreeClass {
  if (cgpa >= 8.5 && !hasArrearHistory) {
    return "FIRST_CLASS_DISTINCTION";
  } else if (cgpa >= 6.5) {
    return "FIRST_CLASS";
  } else {
    return "SECOND_CLASS";
  }
}
