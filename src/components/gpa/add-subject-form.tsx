import { GradeSelect } from "@/components/gpa/grade-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CREDITS_MAX,
  CREDITS_MIN,
  validateSubject,
  type Grade,
  type SubjectInput,
  type ValidationErrors,
} from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

interface AddSubjectFormProps {
  onAdd: (input: SubjectInput) => void;
}

/**
 * The "add a subject" glass card. Owns its field state and inline
 * validation; hands a clean `SubjectInput` to the parent on success.
 */
export function AddSubjectForm({ onAdd }: AddSubjectFormProps) {
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const clearError = (field: keyof ValidationErrors) =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const creditsNum = parseFloat(credits);
    // Validate name + credits normally; "AB" is a stand-in so the grade
    // check doesn't fire before we add our own "pick a grade" message.
    const validation = validateSubject({
      name,
      credits: creditsNum,
      grade: grade || "AB",
    });
    if (!grade) validation.grade = "Pick a grade.";

    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    // Validation above guarantees a grade was chosen — narrow for TypeScript.
    if (!grade) return;

    onAdd({ name: name.trim(), credits: creditsNum, grade });
    setName("");
    setCredits("");
    setGrade("");
    setErrors({});
    // Keep the keyboard flow going — straight into the next subject name.
    nameRef.current?.focus();
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      noValidate
      className="glass rounded-2xl p-5 sm:p-6"
      aria-label="Add a subject"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/12 text-indigo-600 dark:text-indigo-300">
          <Sparkles className="size-4" />
        </span>
        <h2 className="font-display text-base font-bold tracking-tight">
          Add a subject
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_110px_150px_auto] sm:items-start">
        {/* Subject name */}
        <div>
          <Label
            htmlFor="add-name"
            className="text-xs font-semibold text-muted-foreground"
          >
            Subject name
          </Label>
          <Input
            id="add-name"
            ref={nameRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            placeholder="e.g. Digital Signal Processing"
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            className={cn(
              "glass-inset mt-1.5 h-11",
              errors.name && "border-destructive/60",
            )}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs font-medium text-destructive"
                role="alert"
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Credits */}
        <div>
          <Label
            htmlFor="add-credits"
            className="text-xs font-semibold text-muted-foreground"
          >
            Credits
          </Label>
          <Input
            id="add-credits"
            type="number"
            inputMode="decimal"
            min={CREDITS_MIN}
            max={CREDITS_MAX}
            step={0.5}
            value={credits}
            onChange={(e) => {
              setCredits(e.target.value);
              clearError("credits");
            }}
            placeholder="3"
            aria-invalid={Boolean(errors.credits)}
            className={cn(
              "glass-inset mt-1.5 h-11 tabular-nums",
              errors.credits && "border-destructive/60",
            )}
          />
          <AnimatePresence>
            {errors.credits && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs font-medium text-destructive"
                role="alert"
              >
                {errors.credits}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Grade */}
        <div>
          <Label
            htmlFor="add-grade"
            className="text-xs font-semibold text-muted-foreground"
          >
            Grade
          </Label>
          <div className="mt-1.5">
            <GradeSelect
              id="add-grade"
              value={grade}
              onChange={(next) => {
                setGrade(next);
                clearError("grade");
              }}
              placeholder="Select grade"
              className="h-11"
            />
          </div>
          <AnimatePresence>
            {errors.grade && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-xs font-medium text-destructive"
                role="alert"
              >
                {errors.grade}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <div className="sm:pt-[26px]">
          <Button
            type="submit"
            size="lg"
            className="btn-grad w-full rounded-xl border-0 text-white sm:w-auto"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
