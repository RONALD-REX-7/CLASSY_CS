/**
 * Action Plan component — shows NEXT STEPS after recommendations.
 *
 * Each action has:
 *  - Title
 *  - Explanation
 *  - Priority
 *  - Category
 *
 * Reuses existing CLASSY components. Additive-only.
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  BookOpen,
  Target,
  ClipboardList,
} from "lucide-react";
import type { ActionPlan, ActionItem } from "@/types/college";

/* ------------------------------------------------------------------ */
/* Action Plan Component                                               */
/* ------------------------------------------------------------------ */

export function ActionPlanDisplay({ plan }: { plan: ActionPlan }) {
  if (plan.actions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-tight">Next Steps</h3>
      <div className="space-y-2">
        {plan.actions.map((action, i) => (
          <ActionCard key={i} item={action} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Action Card                                                         */
/* ------------------------------------------------------------------ */

const PRIORITY_STYLES = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-sky-500",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  eligibility: <CheckCircle2 className="size-3.5" />,
  academic: <BookOpen className="size-3.5" />,
  entrance: <Target className="size-3.5" />,
  application: <ClipboardList className="size-3.5" />,
  profile: <Info className="size-3.5" />,
};

function ActionCard({ item, index }: { item: ActionItem; index: number }) {
  return (
    <Card
      className={cn(
        "border border-border/60 border-l-2 shadow-none",
        PRIORITY_STYLES[item.priority],
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {index}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {CATEGORY_ICONS[item.category] || <Info className="size-3.5" />}
              <p className="text-xs font-semibold">{item.title}</p>
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
              {item.explanation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
