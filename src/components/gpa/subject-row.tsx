import { GradeChip } from "@/components/gpa/grade-chip";
import { GradeSelect } from "@/components/gpa/grade-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatCredits,
  validateSubject,
  type Grade,
  type Subject,
  type SubjectInput,
  type ValidationErrors,
} from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

interface SubjectRowProps {
  subject: Subject;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (input: SubjectInput) => void;
  onDelete: () => void;
}

/**
 * A single subject in the list. Displays name and credits; flips into an
 * inline edit form when `isEditing`.
 */
export function SubjectRow({
  subject,
  index,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: SubjectRowProps) {
  const [name, setName] = useState(subject.name);
  const [credits, setCredits] = useState(String(subject.credits));
  const [grade, setGrade] = useState<Grade>(subject.grade);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Re-seed the edit fields whenever this row enters edit mode.
  useEffect(() => {
    if (isEditing) {
      setName(subject.name);
      setCredits(String(subject.credits));
      setGrade(subject.grade);
      setErrors({});
    }
  }, [isEditing, subject]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const creditsNum = parseFloat(credits);
    const validation = validateSubject({ name, credits: creditsNum, grade });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onSave({ name: name.trim(), credits: creditsNum, grade });
  };

  const clearError = (field: keyof ValidationErrors) =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {isEditing ? (
        /* ---------------- EDIT MODE ---------------- */
        <form
          onSubmit={handleSave}
          noValidate
          className="glass rounded-2xl p-4"
          aria-label={`Edit ${subject.name}`}
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_100px_140px_auto] sm:items-center">
            <div>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
                placeholder="Subject name"
                maxLength={80}
                aria-label="Subject name"
                aria-invalid={Boolean(errors.name)}
                className={cn(
                  "glass-inset",
                  errors.name && "border-destructive/60",
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <Input
                type="number"
                inputMode="decimal"
                min={0.5}
                max={24}
                step={0.5}
                value={credits}
                onChange={(e) => {
                  setCredits(e.target.value);
                  clearError("credits");
                }}
                placeholder="Credits"
                aria-label="Credits"
                aria-invalid={Boolean(errors.credits)}
                className={cn(
                  "glass-inset tabular-nums",
                  errors.credits && "border-destructive/60",
                )}
              />
              {errors.credits && (
                <p className="mt-1 text-xs font-medium text-destructive" role="alert">
                  {errors.credits}
                </p>
              )}
            </div>
            <div>
              <GradeSelect
                value={grade}
                onChange={setGrade}
                placeholder="Grade"
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="btn-grad rounded-full border-0 text-white"
              >
                <Check className="size-4" />
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onCancelEdit}
                aria-label="Cancel editing"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      ) : (
        /* ---------------- DISPLAY MODE ---------------- */
        <div className="glass-inset group flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(58,84,180,0.35)]">
          {/* index chip */}
          <span className="hidden size-8 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500/15 to-sky-500/15 font-display text-xs font-bold tabular-nums text-indigo-600 dark:text-indigo-300 sm:grid">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* name + meta */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{subject.name}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              {formatCredits(subject.credits)} credit
              {subject.credits === 1 ? "" : "s"}
            </p>
          </div>

          {/* chips */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="glass-soft hidden rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted-foreground md:inline-flex">
              {formatCredits(subject.credits)} CR
            </span>
            <GradeChip grade={subject.grade} />
          </div>

          {/* actions */}
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`Edit ${subject.name}`}
              className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              aria-label={`Delete ${subject.name}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
