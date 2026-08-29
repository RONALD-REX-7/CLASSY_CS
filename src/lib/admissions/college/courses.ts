/**
 * Course explorer data — structured course discovery.
 *
 * Engineering and medical options with descriptions.
 * No unsupported career or salary guarantees.
 */

import type { CourseOption } from "@/types/college";

/* ------------------------------------------------------------------ */
/* Engineering courses                                                 */
/* ------------------------------------------------------------------ */

export const ENGINEERING_COURSES: CourseOption[] = [
  {
    code: "CSE",
    name: "Computer Science and Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main", "JEE Advanced"],
    description: "Covers programming, algorithms, systems design, and software engineering.",
  },
  {
    code: "AI-DS",
    name: "AI & Data Science",
    category: "engineering",
    pathways: ["TNEA", "JEE Main"],
    description: "Focuses on artificial intelligence, machine learning, and data analytics.",
  },
  {
    code: "AI-ML",
    name: "AI & Machine Learning",
    category: "engineering",
    pathways: ["TNEA", "JEE Main"],
    description: "Specialized in machine learning, deep learning, and intelligent systems.",
  },
  {
    code: "ECE",
    name: "Electronics and Communication Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main", "JEE Advanced"],
    description: "Covers electronics, signal processing, and communication systems.",
  },
  {
    code: "EEE",
    name: "Electrical and Electronics Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main", "JEE Advanced"],
    description: "Focuses on electrical systems, power electronics, and control systems.",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main", "JEE Advanced"],
    description: "Covers design, manufacturing, thermodynamics, and fluid mechanics.",
  },
  {
    code: "CE",
    name: "Civil Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main", "JEE Advanced"],
    description: "Focuses on structural design, construction, and infrastructure.",
  },
  {
    code: "BME",
    name: "Biomedical Engineering",
    category: "engineering",
    pathways: ["TNEA", "JEE Main"],
    description: "Applies engineering principles to healthcare and medical devices.",
  },
  {
    code: "BT",
    name: "Biotechnology",
    category: "engineering",
    pathways: ["TNEA", "JEE Main"],
    description: "Combines biology with engineering for bioprocess and genetic engineering.",
  },
];

/* ------------------------------------------------------------------ */
/* Medical courses                                                     */
/* ------------------------------------------------------------------ */

export const MEDICAL_COURSES: CourseOption[] = [
  {
    code: "MBBS",
    name: "Bachelor of Medicine and Bachelor of Surgery",
    category: "medical",
    pathways: ["NEET UG"],
    description: "Professional medical degree for becoming a physician.",
  },
  {
    code: "BDS",
    name: "Bachelor of Dental Surgery",
    category: "medical",
    pathways: ["NEET UG"],
    description: "Professional degree for dental practice.",
  },
  {
    code: "BAMS",
    name: "Bachelor of Ayurvedic Medicine and Surgery",
    category: "medical",
    pathways: ["NEET UG"],
    description: "Traditional Ayurvedic medicine degree.",
  },
  {
    code: "BHMS",
    name: "Bachelor of Homeopathic Medicine and Surgery",
    category: "medical",
    pathways: ["NEET UG"],
    description: "Homeopathic medicine degree.",
  },
  {
    code: "NURSING",
    name: "B.Sc Nursing",
    category: "medical",
    pathways: ["NEET UG", "State Entrance"],
    description: "Professional nursing degree.",
  },
  {
    code: "AHS",
    name: "Allied Health Sciences",
    category: "medical",
    pathways: ["NEET UG", "State Entrance"],
    description: "Includes physiotherapy, occupational therapy, and related fields.",
  },
];

/* ------------------------------------------------------------------ */
/* All courses                                                         */
/* ------------------------------------------------------------------ */

export const ALL_COURSES: CourseOption[] = [...ENGINEERING_COURSES, ...MEDICAL_COURSES];

/**
 * Get courses by category.
 */
export function getCoursesByCategory(
  category: "engineering" | "medical",
): CourseOption[] {
  return ALL_COURSES.filter((c) => c.category === category);
}

/**
 * Get courses by admission pathway.
 */
export function getCoursesByPathway(pathway: string): CourseOption[] {
  return ALL_COURSES.filter((c) => c.pathways.includes(pathway));
}
