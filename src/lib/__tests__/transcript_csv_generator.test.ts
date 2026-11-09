import { describe, it, expect } from "vitest";
import { exportTranscriptCsv } from "../transcript_csv_generator";

describe("Transcript CSV Generator", () => {
  it("exports valid CSV structure", () => {
    const csv = exportTranscriptCsv([{ courseCode: "EC3301", credits: 3, gradePoints: 9 }]);
    expect(csv).toContain("CourseCode,Credits,GradePoints");
    expect(csv).toContain("EC3301,3,9");
  });
});
