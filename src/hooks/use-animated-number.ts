import { useEffect, useRef, useState } from "react";

/**
 * Smoothly animates a number toward its target with a cubic ease-out.
 * Used by the GPA ring readout and the stat cards so values "count up"
 * whenever the underlying data changes.
 */
export function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    const from = previous.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // cubic ease-out: fast start, gentle landing
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previous.current = to;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
