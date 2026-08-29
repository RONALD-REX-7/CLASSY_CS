/**
 * Board + class level + stream selector.
 * Reuses existing shadcn/ui components for consistency with CLASSY design.
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClassLevel, Stream } from "@/types/school";
import { STREAM_LABELS } from "@/types/school";
import { getBoardById, getStreamsForBoard } from "@/lib/school/boards";
import { BookOpen, GraduationCap } from "lucide-react";

interface BoardSelectorProps {
  boardId: string;
  classLevel: ClassLevel;
  stream: Stream;
  onBoardChange: (boardId: string) => void;
  onClassLevelChange: (classLevel: ClassLevel) => void;
  onStreamChange: (stream: Stream) => void;
  disabled?: boolean;
}

const CLASS_LEVELS: ClassLevel[] = [10, 11, 12];

export function BoardSelector({
  boardId,
  classLevel,
  stream,
  onBoardChange,
  onClassLevelChange,
  onStreamChange,
  disabled,
}: BoardSelectorProps) {
  const board = getBoardById(boardId);
  const availableStreams = getStreamsForBoard(boardId, classLevel);
  const showStream = classLevel >= 11;

  return (
    <div className="space-y-5">
      {/* Board selection */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="size-4 text-indigo-500" />
          Board
        </label>
        <div className="flex flex-wrap gap-2">
          {["tn-state", "cbse", "international"].map((id) => {
            const b = getBoardById(id);
            if (!b) return null;
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => onBoardChange(id)}
                className={cn(
                  "glass-soft rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                  boardId === id
                    ? "bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:text-indigo-300 dark:bg-white/10"
                    : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 border border-transparent",
                )}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Class level selection */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="size-4 text-indigo-500" />
          Class
        </label>
        <div className="flex flex-wrap gap-2">
          {CLASS_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              disabled={disabled}
              onClick={() => onClassLevelChange(level)}
              className={cn(
                "glass-soft rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                classLevel === level
                  ? "bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:text-indigo-300 dark:bg-white/10"
                  : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 border border-transparent",
              )}
            >
              Class {level}
            </button>
          ))}
        </div>
      </div>

      {/* Stream selection (Class 11-12 only) */}
      {showStream && (
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            Stream
          </label>
          <div className="flex flex-wrap gap-2">
            {availableStreams.map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => onStreamChange(s)}
                className={cn(
                  "glass-soft rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                  stream === s
                    ? "bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:text-indigo-300 dark:bg-white/10"
                    : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 border border-transparent",
                )}
              >
                {STREAM_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
