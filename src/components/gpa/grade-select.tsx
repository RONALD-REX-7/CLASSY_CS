import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADES, GRADE_POINTS, type Grade } from "@/lib/gpa";
import { cn } from "@/lib/utils";

interface GradeSelectProps {
  value: Grade | "";
  onChange: (grade: Grade) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/**
 * Accessible grade dropdown (Radix) showing both the grade and its point
 * value, e.g. "A+ · 9".
 */
export function GradeSelect({
  value,
  onChange,
  placeholder = "Select grade",
  disabled,
  id,
  className,
  ...rest
}: GradeSelectProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next as Grade)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-label={rest["aria-label"]}
        className={cn("glass-inset w-full", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {GRADES.map((grade) => (
          <SelectItem key={grade} value={grade}>
            <span className="inline-flex w-full items-center justify-between gap-6">
              <span className="font-display font-semibold">{grade}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {GRADE_POINTS[grade]}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
