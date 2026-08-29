/**
 * School module page — Class 10, 11, 12 academic tracker.
 *
 * Additive-only: reuses existing CLASSY components and styling.
 * No changes to existing pages or routes.
 */

import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoardSelector } from "@/components/school/board-selector";
import { SubjectEntry, AddSubjectForm } from "@/components/school/subject-entry";
import { PerformanceSummary, SubjectTable, InsightsList } from "@/components/school/result-display";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { getBoardById, getDefaultSubjects, createSubjectsFromDefaults } from "@/lib/school/boards";
import { calculateAcademicPerformance } from "@/lib/school/engine";
import { validateAcademicProfile, hasValidationErrors } from "@/lib/school/validation";
import { generateInsights } from "@/lib/school/insights";
import { getPathways } from "@/lib/school/pathways";
import { BookOpen, Sparkles, GraduationCap, Map } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { ClassLevel, SchoolSubject, Stream } from "@/types/school";
import { STREAM_LABELS } from "@/types/school";

/* ------------------------------------------------------------------ */
/* Storage keys                                                        */
/* ------------------------------------------------------------------ */

const STORAGE = {
  boardId: "classy.school.boardId",
  classLevel: "classy.school.classLevel",
  stream: "classy.school.stream",
  subjects10: "classy.school.subjects.10",
  subjects11: "classy.school.subjects.11",
  subjects12: "classy.school.subjects.12",
} as const;

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function School() {
  const [boardId, setBoardId] = useLocalStorage(STORAGE.boardId, "tn-state");
  const [classLevel, setClassLevel] = useLocalStorage<ClassLevel>(STORAGE.classLevel, 10);
  const [stream, setStream] = useLocalStorage<Stream>(STORAGE.stream, "pcm");
  const [subjects10, setSubjects10] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects10, []);
  const [subjects11, setSubjects11] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects11, []);
  const [subjects12, setSubjects12] = useLocalStorage<SchoolSubject[]>(STORAGE.subjects12, []);

  // Get current subjects based on class level
  const currentSubjects = classLevel === 10 ? subjects10 : classLevel === 11 ? subjects11 : subjects12;
  const setCurrentSubjects = classLevel === 10 ? setSubjects10 : classLevel === 11 ? setSubjects11 : setSubjects12;

  // When board or class level changes, seed default subjects if empty
  useEffect(() => {
    if (currentSubjects.length === 0) {
      const defaults = getDefaultSubjects(boardId, classLevel, stream);
      if (defaults.length > 0) {
        const seeded = createSubjectsFromDefaults(defaults);
        setCurrentSubjects(seeded);
      }
    }
  }, [boardId, classLevel, stream]); // eslint-disable-line react-hooks/exhaustive-deps

  // When stream changes on Class 11/12, update subjects to match new stream defaults
  useEffect(() => {
    if (classLevel < 11) return;
    // Only re-seed if current subjects are empty (don't overwrite user data)
    if (currentSubjects.length === 0) {
      const defaults = getDefaultSubjects(boardId, classLevel, stream);
      if (defaults.length > 0) {
        const seeded = createSubjectsFromDefaults(defaults);
        setCurrentSubjects(seeded);
      }
    }
  }, [stream, classLevel, boardId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Calculations ── */
  const performance = useMemo(
    () => calculateAcademicPerformance(currentSubjects),
    [currentSubjects],
  );

  const validation = useMemo(
    () => validateAcademicProfile(currentSubjects, boardId, classLevel, stream),
    [currentSubjects, boardId, classLevel, stream],
  );

  const insights = useMemo(
    () => generateInsights(currentSubjects, stream, classLevel),
    [currentSubjects, stream, classLevel],
  );

  const pathways = useMemo(
    () => getPathways(stream, classLevel),
    [stream, classLevel],
  );

  const hasErrors = hasValidationErrors(validation);

  /* ── Handlers ── */
  const handleAddSubject = (subject: SchoolSubject) => {
    setCurrentSubjects((prev) => [...prev, subject]);
    toast.success(`${subject.name} added`);
  };

  const handleUpdateSubject = (updated: SchoolSubject) => {
    setCurrentSubjects((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
    toast.success(`${updated.name} updated`);
  };

  const handleDeleteSubject = (id: string) => {
    const subject = currentSubjects.find((s) => s.id === id);
    setCurrentSubjects((prev) => prev.filter((s) => s.id !== id));
    if (subject) toast.info(`${subject.name} removed`);
  };

  const handleBoardChange = (newBoardId: string) => {
    setBoardId(newBoardId);
    setCurrentSubjects([]);
  };

  const handleClassLevelChange = (level: ClassLevel) => {
    setClassLevel(level);
    // Reset subjects for the new class level (fresh load from storage or seed defaults)
  };

  const handleStreamChange = (newStream: Stream) => {
    setStream(newStream);
    setCurrentSubjects([]);
  };

  const boardName = getBoardById(boardId)?.name ?? boardId;

  return (
    <div className="min-h-screen overflow-x-clip">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10 sm:px-6">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">
            School Academics
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Track your <span className="text-gradient">Class 10–12 performance</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Enter your board marks, see instant insights, and explore
            academic pathways — everything stays on your device.
          </p>
        </motion.div>

        {/* Board + Class + Stream selector */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <BoardSelector
            boardId={boardId}
            classLevel={classLevel}
            stream={stream}
            onBoardChange={handleBoardChange}
            onClassLevelChange={handleClassLevelChange}
            onStreamChange={handleStreamChange}
          />
        </motion.section>

        {/* Class tabs — each tab stores its own subjects independently */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Tabs
            value={String(classLevel)}
            onValueChange={(v) => handleClassLevelChange(Number(v) as ClassLevel)}
          >
            <TabsList className="glass mb-6">
              <TabsTrigger value="10" className="cursor-pointer">
                <GraduationCap className="mr-1.5 size-4" />
                Class 10
              </TabsTrigger>
              <TabsTrigger value="11" className="cursor-pointer">
                <BookOpen className="mr-1.5 size-4" />
                Class 11
              </TabsTrigger>
              <TabsTrigger value="12" className="cursor-pointer">
                <Sparkles className="mr-1.5 size-4" />
                Class 12
              </TabsTrigger>
            </TabsList>

            {/* All tabs share the same content — class level is controlled by state */}
            <TabsContent value={String(classLevel)} forceMount>
              <div className="space-y-6">
                {/* Context banner */}
                <div className="glass-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                  <BookOpen className="size-4 shrink-0 text-indigo-500" />
                  <span>
                    <span className="font-semibold text-foreground">{boardName}</span>
                    {" · "}
                    Class {classLevel}
                    {classLevel >= 11 && (
                      <>
                        {" · "}
                        <span className="font-semibold text-foreground">{STREAM_LABELS[stream]}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Subject entry */}
                <div>
                  <h2 className="mb-3 font-display text-lg font-bold tracking-tight">
                    Subjects & Marks
                    <span className="glass-soft ml-2 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
                      {currentSubjects.length}
                    </span>
                  </h2>

                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {currentSubjects.map((subject) => (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SubjectEntry
                            subject={subject}
                            errors={validation.subjects?.[subject.id]}
                            onUpdate={handleUpdateSubject}
                            onDelete={handleDeleteSubject}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {currentSubjects.length === 0 && (
                    <div className="glass-soft flex flex-col items-center gap-3 rounded-2xl py-12 text-center">
                      <BookOpen className="size-10 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No subjects yet. Add your first subject below.
                      </p>
                    </div>
                  )}

                  {/* Add subject form */}
                  <div className="mt-4">
                    <AddSubjectForm onAdd={handleAddSubject} />
                  </div>
                </div>

                {/* Performance results — only when there's data */}
                {performance && currentSubjects.some((s) => s.obtainedMarks > 0) && (
                  <>
                    <div>
                      <h2 className="mb-3 font-display text-lg font-bold tracking-tight">
                        Performance Summary
                      </h2>
                      <PerformanceSummary performance={performance} />
                    </div>

                    <div>
                      <h2 className="mb-3 font-display text-lg font-bold tracking-tight">
                        Subject Breakdown
                      </h2>
                      <SubjectTable performances={performance.subjectPerformances} />
                    </div>
                  </>
                )}

                {/* Insights */}
                {insights.length > 0 && (
                  <div>
                    <h2 className="mb-3 font-display text-lg font-bold tracking-tight">
                      Insights
                    </h2>
                    <InsightsList insights={insights} />
                  </div>
                )}

                {/* Pathways (Class 11-12 only) */}
                {pathways && (
                  <div>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                      <Map className="size-5 text-indigo-500" />
                      Academic Pathways
                    </h2>
                    <p className="mb-4 text-xs text-muted-foreground">
                      Guidance based on your stream — not a scientifically validated career assessment.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pathways.pathways.map((pathway) => (
                        <div
                          key={pathway.name}
                          className={cn(
                            "glass-soft rounded-xl p-4",
                            pathway.fit === "primary" && "border-l-2 border-indigo-500/50",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{pathway.name}</p>
                            {pathway.fit === "primary" && (
                              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {pathway.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {pathway.programmes.map((p) => (
                              <span
                                key={p}
                                className="glass inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {pathways.entranceExams.length > 0 && (
                      <div className="mt-4 glass-soft flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
                        <Sparkles className="size-4 shrink-0 text-indigo-500" />
                        <span className="text-muted-foreground">
                          Relevant entrance exams:{" "}
                          <span className="font-semibold text-foreground">
                            {pathways.entranceExams.join(", ")}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
