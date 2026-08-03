import { AddSubjectForm } from "@/components/gpa/add-subject-form";
import { GradeBreakdown } from "@/components/gpa/grade-breakdown";
import { SubjectRow } from "@/components/gpa/subject-row";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  computeGpa,
  computeTotals,
  formatCredits,
  formatGpa,
  getRating,
  type Semester,
  type Subject,
  type SubjectInput,
} from "@/lib/gpa";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

/** "3" for 3, "3.5" for 3.5 — no trailing zeros. */
function formatPoint(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

interface SemesterCardProps {
  semester: Semester;
  isCurrent: boolean;
  expanded: boolean;
  canDelete: boolean;
  onToggle: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddSubject: (input: SubjectInput) => void;
  onUpdateSubject: (subjectId: string, input: SubjectInput) => void;
  onDeleteSubject: (subject: Subject) => void;
}

/**
 * A collapsible semester card (accordion). The header shows the name,
 * current-semester badge, credits/subjects meta and the semester GPA; the
 * expanded body holds the add-subject form, the subject rows, per-semester
 * totals and a grade breakdown.
 */
export function SemesterCard({
  semester,
  isCurrent,
  expanded,
  canDelete,
  onToggle,
  onRename,
  onDuplicate,
  onDelete,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}: SemesterCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(semester.name);

  const totals = computeTotals(semester.subjects);
  const gpa = computeGpa(semester.subjects);
  const rating = getRating(gpa);
  const hasSubjects = semester.subjects.length > 0;

  const commitRename = () => {
    if (draftName.trim()) onRename(draftName);
    setRenaming(false);
  };

  return (
    <motion.div layout className="glass overflow-hidden rounded-2xl">
      {/* ------------------------- header ------------------------- */}
      <div className="flex items-center gap-1 p-3 sm:p-4">
        {renaming ? (
          /* Inline rename — rendered outside the toggle so clicks don't collapse */
          <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1">
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              autoFocus
              maxLength={40}
              className="h-9"
              aria-label="Semester name"
            />
            <Button size="icon-sm" onClick={commitRename} aria-label="Save name">
              <Check className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setRenaming(false)}
              aria-label="Cancel rename"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`semester-${semester.id}-body`}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/5"
            >
              <ChevronDown className="size-4 text-muted-foreground" />
            </motion.span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate font-display text-sm font-bold sm:text-base">
                  {semester.name}
                </span>
                {isCurrent && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                    <GraduationCap className="size-3" />
                    Current
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                {hasSubjects
                  ? `${formatCredits(totals.credits)} credits · ${
                      totals.count
                    } subject${totals.count === 1 ? "" : "s"} · ${formatPoint(
                      totals.weighted,
                    )} points`
                  : "No subjects yet"}
              </span>
            </span>

            <span className="shrink-0 text-right" aria-label={`GPA ${formatGpa(gpa)} out of 10`}>
              <span
                className="font-display text-lg font-extrabold tabular-nums"
                style={{ color: hasSubjects ? rating.ringFrom : undefined }}
              >
                {formatGpa(gpa)}
              </span>
              <span className="ml-0.5 text-[10px] font-semibold text-muted-foreground">
                /10
              </span>
            </span>
          </button>
        )}

        {/* per-semester actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${semester.name} options`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border-foreground/10">
            <DropdownMenuItem
              onSelect={() => {
                setDraftName(semester.name);
                setRenaming(true);
              }}
            >
              <Pencil className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDuplicate}>
              <Copy className="size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onDelete}
              disabled={!canDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ------------------------- body -------------------------- */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            id={`semester-${semester.id}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-foreground/8 px-3 pb-4 pt-3 sm:px-4">
              <AddSubjectForm onAdd={onAddSubject} />

              {hasSubjects ? (
                <>
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {semester.subjects.map((subject, i) => (
                        <SubjectRow
                          key={subject.id}
                          subject={subject}
                          index={i}
                          isEditing={editingId === subject.id}
                          onEdit={() => setEditingId(subject.id)}
                          onCancelEdit={() => setEditingId(null)}
                          onSave={(input) => {
                            onUpdateSubject(subject.id, input);
                            setEditingId(null);
                          }}
                          onDelete={() => onDeleteSubject(subject)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                  <GradeBreakdown subjects={semester.subjects} />
                </>
              ) : (
                <p className="glass-inset rounded-xl p-4 text-center text-sm text-muted-foreground">
                  No subjects yet — add your first one above.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
