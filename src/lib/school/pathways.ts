/**
 * Academic pathway explorer.
 *
 * Provides guidance-based pathway recommendations based on
 * stream + class level. This is guidance, NOT scientifically
 * validated career assessment. No claims of certainty.
 */

import type {
  AcademicPathway,
  ClassLevel,
  PathwayOption,
  Stream,
} from "@/types/school";

/* ------------------------------------------------------------------ */
/* Pathway definitions                                                 */
/* ------------------------------------------------------------------ */

const PATHWAYS: AcademicPathway[] = [
  // ── Class 10 ──────────────────────────────────────────────────
  {
    stream: "custom",
    classLevel: 10,
    pathways: [
      {
        name: "Science (PCM/PCB/PCMB)",
        description: "Choose a science stream after Class 10 for engineering, medicine, or research pathways.",
        programmes: ["B.Tech", "MBBS", "B.Sc", "BCA"],
        fit: "secondary",
      },
      {
        name: "Commerce",
        description: "Choose commerce for business, finance, and economics pathways.",
        programmes: ["B.Com", "BBA", "CA Foundation", "CS"],
        fit: "secondary",
      },
      {
        name: "Humanities / Arts",
        description: "Choose humanities for law, social sciences, and creative fields.",
        programmes: ["BA", "LLB (integrated)", "BFA", "B.Lib"],
        fit: "secondary",
      },
    ],
    entranceExams: [], // No entrance exams at Class 10 level
  },

  // ── Class 11-12 PCM ──────────────────────────────────────────
  {
    stream: "pcm",
    classLevel: 11,
    pathways: [
      {
        name: "Engineering / Technology",
        description: "Primary pathway for PCM students. Leads to B.Tech, B.E., and related programmes.",
        programmes: ["B.Tech", "B.E.", "BCA", "B.Arch"],
        fit: "primary",
      },
      {
        name: "Pure Sciences / Research",
        description: "For students interested in fundamental science research.",
        programmes: ["B.Sc (Honours)", "Integrated M.Sc", "BS-MS"],
        fit: "secondary",
      },
      {
        name: "Architecture / Design",
        description: "For students with spatial and creative abilities.",
        programmes: ["B.Arch", "B.Des", "B.Planning"],
        fit: "secondary",
      },
    ],
    entranceExams: ["TNEA", "JEE Main"],
  },
  {
    stream: "pcm",
    classLevel: 12,
    pathways: [
      {
        name: "Engineering / Technology",
        description: "Primary pathway for PCM students. Apply through JEE Main, TNEA, state counselling.",
        programmes: ["B.Tech", "B.E.", "BCA", "B.Arch"],
        fit: "primary",
      },
      {
        name: "Pure Sciences / Research",
        description: "For students interested in fundamental science research.",
        programmes: ["B.Sc (Honours)", "Integrated M.Sc", "BS-MS"],
        fit: "secondary",
      },
      {
        name: "Architecture / Design",
        description: "Apply through NATA or JEE Paper 2.",
        programmes: ["B.Arch", "B.Des", "B.Planning"],
        fit: "secondary",
      },
    ],
    entranceExams: ["JEE Main", "TNEA"],
  },

  // ── Class 11-12 PCB ──────────────────────────────────────────
  {
    stream: "pcb",
    classLevel: 11,
    pathways: [
      {
        name: "Medicine / Dentistry",
        description: "Primary pathway for PCB students. Leads to MBBS, BDS, and related clinical programmes.",
        programmes: ["MBBS", "BDS", "BAMS", "BHMS", "B.V.Sc"],
        fit: "primary",
      },
      {
        name: "Allied Health Sciences",
        description: "For students interested in healthcare support roles.",
        programmes: ["B.Sc Nursing", "B.Pharm", "BPT", "BMLT"],
        fit: "secondary",
      },
      {
        name: "Life Sciences / Research",
        description: "For students interested in biology research.",
        programmes: ["B.Sc Biology", "Integrated M.Sc", "BS-MS"],
        fit: "secondary",
      },
    ],
    entranceExams: ["NEET"],
  },
  {
    stream: "pcb",
    classLevel: 12,
    pathways: [
      {
        name: "Medicine / Dentistry",
        description: "Primary pathway for PCB students. Apply through NEET.",
        programmes: ["MBBS", "BDS", "BAMS", "BHMS", "B.V.Sc"],
        fit: "primary",
      },
      {
        name: "Allied Health Sciences",
        description: "Nursing, pharmacy, physiotherapy, and related fields.",
        programmes: ["B.Sc Nursing", "B.Pharm", "BPT", "BMLT"],
        fit: "secondary",
      },
      {
        name: "Life Sciences / Research",
        description: "For students interested in biology research.",
        programmes: ["B.Sc Biology", "Integrated M.Sc", "BS-MS"],
        fit: "secondary",
      },
    ],
    entranceExams: ["NEET"],
  },

  // ── Class 11-12 PCMB ─────────────────────────────────────────
  {
    stream: "pcmb",
    classLevel: 11,
    pathways: [
      {
        name: "Engineering / Technology",
        description: "PCM subjects qualify you for engineering pathways.",
        programmes: ["B.Tech", "B.E.", "BCA"],
        fit: "primary",
      },
      {
        name: "Medicine / Dentistry",
        description: "Biology + Physics + Chemistry qualifies you for medical pathways.",
        programmes: ["MBBS", "BDS", "BAMS"],
        fit: "primary",
      },
      {
        name: "Biotechnology / Bioengineering",
        description: "Combines biology and engineering — a growing interdisciplinary field.",
        programmes: ["B.Tech Biotech", "B.Sc Biology", "Integrated M.Sc"],
        fit: "secondary",
      },
    ],
    entranceExams: ["JEE Main", "NEET"],
  },
  {
    stream: "pcmb",
    classLevel: 12,
    pathways: [
      {
        name: "Engineering / Technology",
        description: "Apply through JEE Main and state counselling.",
        programmes: ["B.Tech", "B.E.", "BCA"],
        fit: "primary",
      },
      {
        name: "Medicine / Dentistry",
        description: "Apply through NEET.",
        programmes: ["MBBS", "BDS", "BAMS"],
        fit: "primary",
      },
      {
        name: "Biotechnology / Bioengineering",
        description: "Interdisciplinary field combining biology and engineering.",
        programmes: ["B.Tech Biotech", "B.Sc Biology", "Integrated M.Sc"],
        fit: "secondary",
      },
    ],
    entranceExams: ["JEE Main", "NEET", "TNEA"],
  },

  // ── Class 11-12 Commerce ─────────────────────────────────────
  {
    stream: "commerce",
    classLevel: 11,
    pathways: [
      {
        name: "Business / Management",
        description: "Primary pathway for commerce students. Leads to BBA, B.Com, and related programmes.",
        programmes: ["B.Com", "BBA", "BMS"],
        fit: "primary",
      },
      {
        name: "Chartered Accountancy / Company Secretary",
        description: "Professional certification pathways for commerce students.",
        programmes: ["CA Foundation", "CMA Foundation", "CS Foundation"],
        fit: "primary",
      },
      {
        name: "Economics / Finance",
        description: "For students interested in economics research and financial analysis.",
        programmes: ["BA Economics", "B.Sc Finance", "B.Com (Hons)"],
        fit: "secondary",
      },
    ],
    entranceExams: [],
  },
  {
    stream: "commerce",
    classLevel: 12,
    pathways: [
      {
        name: "Business / Management",
        description: "Apply for BBA, B.Com, BMS programmes.",
        programmes: ["B.Com", "BBA", "BMS"],
        fit: "primary",
      },
      {
        name: "Professional Certifications",
        description: "Direct entry into CA, CMA, CS Foundation after Class 12.",
        programmes: ["CA Foundation", "CMA Foundation", "CS Foundation"],
        fit: "primary",
      },
      {
        name: "Economics / Finance",
        description: "BA Economics, B.Sc Finance programmes.",
        programmes: ["BA Economics", "B.Sc Finance", "B.Com (Hons)"],
        fit: "secondary",
      },
    ],
    entranceExams: [],
  },

  // ── Class 11-12 Humanities ───────────────────────────────────
  {
    stream: "humanities",
    classLevel: 11,
    pathways: [
      {
        name: "Law",
        description: "Integrated law programmes (5-year) after Class 12.",
        programmes: ["BA LLB", "BBA LLB", "B.Com LLB"],
        fit: "primary",
      },
      {
        name: "Social Sciences / Liberal Arts",
        description: "For students interested in history, political science, sociology, and related fields.",
        programmes: ["BA (Hons)", "BA Liberal Arts", "B.Ed"],
        fit: "primary",
      },
      {
        name: "Media / Communications / Design",
        description: "For students interested in creative and media fields.",
        programmes: ["BJMC", "B.Des", "BFA", "B.Arch"],
        fit: "secondary",
      },
    ],
    entranceExams: [],
  },
  {
    stream: "humanities",
    classLevel: 12,
    pathways: [
      {
        name: "Law",
        description: "Apply for CLAT, AILET, or state law entrance exams.",
        programmes: ["BA LLB", "BBA LLB", "B.Com LLB"],
        fit: "primary",
      },
      {
        name: "Social Sciences / Liberal Arts",
        description: "BA programmes across universities.",
        programmes: ["BA (Hons)", "BA Liberal Arts", "B.Ed"],
        fit: "primary",
      },
      {
        name: "Media / Communications / Design",
        description: "Creative fields — apply through specific institution exams.",
        programmes: ["BJMC", "B.Des", "BFA", "B.Arch"],
        fit: "secondary",
      },
    ],
    entranceExams: ["CLAT", "AILET"],
  },

  // ── Vocational ───────────────────────────────────────────────
  {
    stream: "vocational",
    classLevel: 11,
    pathways: [
      {
        name: "Diploma / Polytechnic",
        description: "Direct entry into technical diploma programmes.",
        programmes: ["Diploma in Engineering", "Diploma in Pharmacy", "Diploma in IT"],
        fit: "primary",
      },
      {
        name: "Skill-based Certification",
        description: "Industry-recognized skill certifications.",
        programmes: ["NSDC Certifications", "Skill India", "ITI"],
        fit: "secondary",
      },
    ],
    entranceExams: [],
  },
  {
    stream: "vocational",
    classLevel: 12,
    pathways: [
      {
        name: "Diploma / Polytechnic",
        description: "Technical diploma programmes.",
        programmes: ["Diploma in Engineering", "Diploma in Pharmacy"],
        fit: "primary",
      },
      {
        name: "Skill-based Certification",
        description: "Industry certifications and apprenticeships.",
        programmes: ["NSDC Certifications", "ITI", "Apprenticeship"],
        fit: "secondary",
      },
    ],
    entranceExams: [],
  },
];

/* ------------------------------------------------------------------ */
/* Pathway lookup helpers                                              */
/* ------------------------------------------------------------------ */

/**
 * Get pathway options for a given stream + class level.
 */
export function getPathways(stream: Stream, classLevel: ClassLevel): AcademicPathway | undefined {
  return PATHWAYS.find((p) => p.stream === stream && p.classLevel === classLevel);
}

/**
 * Get all available streams for a given class level.
 */
export function getStreamsForClassLevel(classLevel: ClassLevel): Stream[] {
  const streams = new Set<Stream>();
  for (const p of PATHWAYS) {
    if (p.classLevel === classLevel) {
      streams.add(p.stream);
    }
  }
  return Array.from(streams);
}
