/**
 * Explore page — structured discovery for courses and colleges.
 * This is a new additive page. Does not modify existing pages.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building,
  Cpu,
  FlaskConical,
  GraduationCap,
  Heart,
  MapPin,
  Search,
} from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Course categories */
const COURSE_CATEGORIES = [
  {
    title: "Engineering",
    icon: Cpu,
    color: "bg-indigo-500/12 text-indigo-600 dark:text-indigo-300",
    courses: [
      { name: "CSE", full: "Computer Science & Engineering" },
      { name: "AI & DS", full: "Artificial Intelligence & Data Science" },
      { name: "AI & ML", full: "Artificial Intelligence & Machine Learning" },
      { name: "ECE", full: "Electronics & Communication Engineering" },
      { name: "EEE", full: "Electrical & Electronics Engineering" },
      { name: "Mechanical", full: "Mechanical Engineering" },
      { name: "Civil", full: "Civil Engineering" },
      { name: "Biomedical", full: "Biomedical Engineering" },
      { name: "Biotechnology", full: "Biotechnology Engineering" },
    ],
  },
  {
    title: "Medical",
    icon: Heart,
    color: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
    courses: [
      { name: "MBBS", full: "Medicine" },
      { name: "BDS", full: "Dental Surgery" },
      { name: "AYUSH", full: "Ayurveda, Yoga, Unani, Siddha, Homeopathy" },
      { name: "Nursing", full: "Nursing Sciences" },
      { name: "Allied Health", full: "Allied Health Sciences" },
    ],
  },
  {
    title: "Science & Research",
    icon: FlaskConical,
    color: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
    courses: [
      { name: "B.Sc", full: "Bachelor of Science" },
      { name: "M.Sc", full: "Master of Science" },
      { name: "Integrated M.Sc", full: "Integrated Master of Science" },
    ],
  },
];

/** College focus areas */
const COLLEGE_AREAS = [
  {
    state: "Tamil Nadu",
    count: "Engineering, Medical, Arts & Science",
    colleges: [
      "College of Engineering, Guindy (CEG)",
      "MIT Campus, Anna University",
      "PSG College of Technology",
      "SSN College of Engineering",
      "Madras Medical College",
    ],
  },
  {
    state: "Karnataka",
    count: "Engineering, Medical, Research",
    colleges: [
      "NIT Karnataka, Surathkal",
      "Manipal Institute of Technology",
      "M.S. Ramaiah Institute of Technology",
    ],
  },
  {
    state: "Maharashtra",
    count: "Engineering, Medical, Architecture",
    colleges: [
      "IIT Bombay",
      "VJTI Mumbai",
      "CoEP Technological University",
    ],
  },
  {
    state: "All India",
    count: "IITs, NITs, IIITs, AIIMS",
    colleges: [
      "IIT Madras",
      "IIT Delhi",
      "IIT Bombay",
      "NIT Trichy",
      "AIIMS Delhi",
    ],
  },
];

export default function Explore() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
            Explore
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Discover <span className="text-gradient">courses & colleges</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Browse engineering, medical, and science programmes. Explore colleges by state and discover realistic admission pathways.
          </p>
        </motion.div>

        {/* Courses section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="size-5 text-indigo-500" />
            <h2 className="font-display text-lg font-bold tracking-tight">
              Course Explorer
            </h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">
            Find the right programme for your stream and interests.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COURSE_CATEGORIES.map((cat, ci) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ci * 0.08, duration: 0.5, ease: EASE }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-9 place-items-center rounded-xl transition-transform ${cat.color}`}
                  >
                    <cat.icon className="size-4.5" />
                  </span>
                  <h3 className="font-display text-base font-bold tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                <div className="mt-4 space-y-2">
                  {cat.courses.map((course) => (
                    <div
                      key={course.name}
                      className="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{course.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {course.full}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-xs text-muted-foreground"
          >
            More disciplines and detailed programme information will be added as verified data becomes available.
          </motion.p>
        </motion.section>

        {/* Colleges section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building className="size-5 text-emerald-500" />
            <h2 className="font-display text-lg font-bold tracking-tight">
              College Explorer
            </h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">
            Browse colleges by state. Initial focus: Tamil Nadu, expanding India-wide.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {COLLEGE_AREAS.map((area, ai) => (
              <motion.div
                key={area.state}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + ai * 0.06, duration: 0.5, ease: EASE }}
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-indigo-500/12 text-indigo-600 dark:text-indigo-300">
                    <MapPin className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{area.state}</h3>
                    <p className="text-xs text-muted-foreground">{area.count}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {area.colleges.map((c) => (
                    <p key={c} className="text-xs font-medium text-muted-foreground">
                      {c}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Find your pathway CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="glass rounded-2xl p-6 sm:p-8 text-center">
            <Search className="mx-auto size-8 text-indigo-500/40" />
            <h2 className="mt-3 font-display text-lg font-bold tracking-tight">
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
              Build your academic profile first, then Classy will suggest relevant pathways and realistic college targets based on your scores.
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="btn-grad h-11 rounded-full border-0 text-sm text-white">
                <Link to="/school">
                  <GraduationCap className="size-4" />
                  Build your profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="glass-soft h-11 rounded-full border-0 text-sm">
                <Link to="/admission">
                  Explore admissions
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
