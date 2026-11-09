export type AnnaGrade = "O" | "A+" | "A" | "B+" | "B" | "C" | "U" | "RA";

export function gradeToPoints(grade: AnnaGrade): number {
  switch (grade) {
    case "O":  return 10;
    case "A+": return 9;
    case "A":  return 8;
    case "B+": return 7;
    case "B":  return 6;
    case "C":  return 5;
    case "U":
    case "RA": return 0;
  }
}
