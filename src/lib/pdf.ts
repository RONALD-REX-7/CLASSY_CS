import { APP_NAME, APP_VERSION, PDF_FILE_NAME } from "@/lib/constants";
import {
  computeGpa,
  computeTotals,
  formatCredits,
  getRating,
  GRADES,
  GRADE_POINTS,
  subjectPoints,
  type Subject,
} from "@/lib/gpa";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

/* ------------------------------------------------------------------ */
/* Palette (matches the light glassmorphism theme)                     */
/* ------------------------------------------------------------------ */

const INDIGO: [number, number, number] = [79, 70, 229];
const SKY: [number, number, number] = [14, 165, 233];
const INK: [number, number, number] = [30, 41, 59];
const MUTED: [number, number, number] = [100, 116, 139];
const LINE: [number, number, number] = [219, 227, 240];
const TINT: [number, number, number] = [241, 244, 255];
const STRIPE: [number, number, number] = [247, 249, 254];

/** Optional identity details stamped onto the report header. */
export interface ReportProfile {
  studentName: string;
  semester: string;
}

/** Convert a #rrggbb hex string to an rgb tuple for jsPDF. */
function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const bigint = parseInt(value, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/** "3" for 3, "3.5" for 3.5 — no trailing zeros. */
function formatPoint(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/**
 * Generate a structured, branded PDF report of the current grade sheet.
 *
 * Layout (academic-report style, inspired by institutional timetables):
 *   · branded header band (CLASSY_CS · GPA REPORT · generated date)
 *     — plus an optional student name / semester line
 *   · summary block — GPA card + rating chip, and a 2×2 stats grid
 *   · subjects table  — S.NO / SUBJECT / CREDITS / GRADE / POINT / WEIGHTED
 *   · grade scale reference table
 *   · footer with version, privacy note and page numbers
 */
export function exportGpaPdf(
  subjects: Subject[],
  profile?: ReportProfile,
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const totals = computeTotals(subjects);
  const gpa = computeGpa(subjects);
  const rating = getRating(gpa);
  const ratingRgb = hexToRgb(rating.ringFrom);
  const avgCredits = totals.count > 0 ? totals.credits / totals.count : 0;
  const generated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ------------------------- header band ------------------------- */
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFillColor(...SKY);
  doc.rect(0, 30, pageWidth, 1.4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(APP_NAME, margin, 13.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 226, 255);
  doc.text("GPA REPORT  ·  structured grade summary", margin, 20);
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(generated, pageWidth - margin, 13.5, { align: "right" });
  doc.setFontSize(8);
  doc.setTextColor(219, 226, 255);
  doc.text(`v${APP_VERSION}`, pageWidth - margin, 20, { align: "right" });

  // Optional student / semester line — only when something is filled in.
  const profileLine = [
    profile?.studentName?.trim() ? `Student: ${profile.studentName.trim()}` : "",
    profile?.semester?.trim() ? `Semester: ${profile.semester.trim()}` : "",
  ]
    .filter(Boolean)
    .join("   ·   ");

  if (profileLine) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(profileLine, margin, 26.2);
  }

  let y = 46;

  /* ------------------------ summary block ------------------------ */
  const cardH = 36;
  const gap = 4;
  const leftW = (contentWidth - gap) * 0.42;
  const rightW = contentWidth - gap - leftW;

  // GPA card
  doc.setFillColor(...TINT);
  doc.setDrawColor(...ratingRgb);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, leftW, cardH, 4, 4, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...MUTED);
  doc.text("CURRENT GPA", margin + 5, y + 8);

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ratingRgb);
  doc.text(`${gpa > 0 ? gpa.toFixed(2) : "—"} / 10`, margin + 5, y + 19);

  // Rating chip
  const chipLabel = totals.count > 0 ? rating.label : "No data";
  doc.setFillColor(...ratingRgb);
  doc.roundedRect(margin + 5, y + 23, 6 + chipLabel.length * 1.7 + 4, 6.5, 3.2, 3.2, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(chipLabel, margin + 5 + 3.4, y + 27.6);

  // Stats grid (2 × 2)
  const stats: { label: string; value: string }[] = [
    { label: "SUBJECTS", value: String(totals.count) },
    { label: "TOTAL CREDITS", value: formatPoint(totals.credits) },
    { label: "WEIGHTED POINTS", value: formatPoint(totals.weighted) },
    { label: "AVG CREDITS / SUBJECT", value: formatPoint(avgCredits) },
  ];
  const cellW = (rightW - gap) / 2;
  const cellH = (cardH - gap) / 2;

  stats.forEach((stat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + leftW + gap + col * (cellW + gap);
    const cy = y + row * (cellH + gap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cy, cellW, cellH, 3.5, 3.5, "FD");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text(stat.label, x + 4, cy + 8);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(stat.value, x + 4, cy + 21);
  });

  y += cardH + 12;

  /* ------------------------ subjects table ----------------------- */
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text("Subject breakdown", margin, y);

  autoTable(doc, {
    startY: y + 4,
    margin: { left: margin, right: margin },
    head: [["S.NO", "SUBJECT", "CREDITS", "GRADE", "GRADE POINT", "WEIGHTED"]],
    body: subjects.map((subject, i) => [
      String(i + 1),
      subject.name,
      formatPoint(subject.credits),
      subject.grade,
      String(GRADE_POINTS[subject.grade]),
      formatPoint(subjectPoints(subject)),
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9.5,
      cellPadding: 2.6,
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.2,
      valign: "middle",
    },
    headStyles: {
      fillColor: INDIGO,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: STRIPE },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      1: { fontStyle: "bold" },
      2: { halign: "center" },
      3: { halign: "center", fontStyle: "bold" },
      4: { halign: "center" },
      5: { halign: "center", fontStyle: "bold" },
    },
    didDrawPage: (data) => {
      const footerY = pageHeight - 11;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(
        `${APP_NAME} v${APP_VERSION} · local-first · data never leaves your device`,
        margin,
        footerY + 4.5,
      );
      doc.text(`Page ${data.pageNumber}`, pageWidth - margin, footerY + 4.5, {
        align: "right",
      });
    },
  });

  /* ------------------- grade scale reference --------------------- */
  const afterTable =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y + 10;

  let scaleY = afterTable + 12;
  if (scaleY + 34 > pageHeight - 16) {
    doc.addPage();
    scaleY = 20;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text("Grade scale reference (10-point)", margin, scaleY);

  autoTable(doc, {
    startY: scaleY + 4,
    margin: { left: margin, right: margin },
    head: [GRADES.map((grade) => `${grade}`)],
    body: [GRADES.map((grade) => String(GRADE_POINTS[grade]))],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
      halign: "center",
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: SKY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9.5,
    },
    alternateRowStyles: { fillColor: STRIPE },
    didDrawPage: (data) => {
      const footerY = pageHeight - 11;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(
        `${APP_NAME} v${APP_VERSION} · local-first · data never leaves your device`,
        margin,
        footerY + 4.5,
      );
      doc.text(`Page ${data.pageNumber}`, pageWidth - margin, footerY + 4.5, {
        align: "right",
      });
    },
  });

  /* --------------------------- footer ---------------------------- */
  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? pageHeight - 20;
  const noteY = Math.min(finalY + 12, pageHeight - 24);

  doc.setDrawColor(...ratingRgb);
  doc.setLineWidth(0.6);
  doc.line(margin, noteY, margin + 22, noteY);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(
    `GPA = Σ (Credit × Grade point) ÷ Σ (Credits) · generated with ${APP_NAME}`,
    margin,
    noteY + 5,
  );

  doc.save(PDF_FILE_NAME);
}
