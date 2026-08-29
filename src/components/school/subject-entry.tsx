/**
 * Subject marks entry form.
 * Allows adding/editing school subjects with marks breakdown.
 * Uses existing shadcn/ui components for consistency.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SchoolSubject, SchoolSubjectErrors } from "@/types/school";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";

interface SubjectEntryProps {
  subject: SchoolSubject;
  errors?: SchoolSubjectErrors;
  onUpdate: (updated: SchoolSubject) => void;
  onDelete: (id: string) => void;
}

export function SubjectEntry({ subject, errors, onUpdate, onDelete }: SubjectEntryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...subject });

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...subject });
    setEditing(false);
  };

  const hasSplitMarks = subject.theoryMarks !== undefined || subject.practicalMarks !== undefined;
  const percentage = subject.maxMarks > 0
    ? Math.round((subject.obtainedMarks / subject.maxMarks) * 10000) / 100
    : 0;

  return (
    <div className="glass-soft group rounded-xl p-4 transition-all">
      {editing ? (
        /* ── Edit mode ── */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-4">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Subject Name</label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="h-9 text-sm"
                placeholder="e.g. Mathematics"
              />
              {errors?.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Marks</label>
              <Input
                type="number"
                value={draft.maxMarks}
                onChange={(e) => setDraft({ ...draft, maxMarks: Number(e.target.value) })}
                className="h-9 text-sm"
                min={1}
              />
              {errors?.maxMarks && <p className="mt-1 text-xs text-destructive">{errors.maxMarks}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Obtained</label>
              <Input
                type="number"
                value={draft.obtainedMarks}
                onChange={(e) => setDraft({ ...draft, obtainedMarks: Number(e.target.value) })}
                className="h-9 text-sm"
                min={0}
              />
              {errors?.obtainedMarks && <p className="mt-1 text-xs text-destructive">{errors.obtainedMarks}</p>}
            </div>
            {hasSplitMarks && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Theory</label>
                  <Input
                    type="number"
                    value={draft.theoryMarks ?? 0}
                    onChange={(e) => setDraft({ ...draft, theoryMarks: Number(e.target.value) })}
                    className="h-9 text-sm"
                    min={0}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Practical</label>
                  <Input
                    type="number"
                    value={draft.practicalMarks ?? 0}
                    onChange={(e) => setDraft({ ...draft, practicalMarks: Number(e.target.value) })}
                    className="h-9 text-sm"
                    min={0}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="btn-grad border-0 text-white cursor-pointer"
            >
              <Check className="size-3.5" />
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        /* ── Display mode ── */
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{subject.name}</p>
              <span className="glass-soft inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {subject.category}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {subject.obtainedMarks} / {subject.maxMarks}
              {percentage > 0 && (
                <span className={cn(
                  "ml-2 font-medium",
                  percentage >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                  percentage >= 75 ? "text-teal-600 dark:text-teal-400" :
                  percentage >= 60 ? "text-sky-600 dark:text-sky-400" :
                  "text-amber-600 dark:text-amber-400",
                )}>
                  {percentage.toFixed(1)}%
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 cursor-pointer"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${subject.name}`}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 cursor-pointer text-destructive hover:text-destructive"
              onClick={() => onDelete(subject.id)}
              aria-label={`Delete ${subject.name}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Add new subject form                                                */
/* ------------------------------------------------------------------ */

interface AddSubjectFormProps {
  onAdd: (subject: SchoolSubject) => void;
}

export function AddSubjectForm({ onAdd }: AddSubjectFormProps) {
  const [name, setName] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      category: "core",
      maxMarks,
      obtainedMarks: 0,
    });
    setName("");
    setMaxMarks(100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Subject name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Physics"
          className="h-9 text-sm"
        />
      </div>
      <div className="w-24">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Max</label>
        <Input
          type="number"
          value={maxMarks}
          onChange={(e) => setMaxMarks(Number(e.target.value))}
          className="h-9 text-sm"
          min={1}
        />
      </div>
      <Button type="submit" size="sm" className="btn-grad border-0 text-white cursor-pointer">
        Add
      </Button>
    </form>
  );
}
