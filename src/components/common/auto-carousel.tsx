"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Horizontally auto-scrolling strip (used by the home feeds). Pauses on
 * hover/touch, supports drag, loops back to the start, and respects
 * prefers-reduced-motion.
 */
export function AutoCarousel({
  speed = 0.6,
  className,
  children,
}: {
  /** Pixels per tick (~30ms). */
  speed?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const drag = useRef({ on: false, x: 0, left: 0 });
  // Fractional position accumulator: browsers may round scrollLeft to whole
  // pixels, so adding sub-pixel speeds directly to it would never move.
  const pos = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = ref.current;
      if (!el || paused.current || drag.current.on) return;
      // Re-sync after user scrolls (drag, wheel, touch).
      if (Math.abs(el.scrollLeft - pos.current) > 1) pos.current = el.scrollLeft;
      pos.current += speed;
      if (pos.current >= el.scrollWidth - el.clientWidth - 1) pos.current = 0;
      el.scrollLeft = pos.current;
    }, 30);
    return () => clearInterval(timer);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-grab gap-3 overflow-x-auto select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => {
        paused.current = false;
        drag.current.on = false;
      }}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => (paused.current = false)}
      onMouseDown={(e) => {
        const el = ref.current;
        if (!el) return;
        drag.current = { on: true, x: e.pageX, left: el.scrollLeft };
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || !drag.current.on) return;
        e.preventDefault();
        el.scrollLeft = drag.current.left - (e.pageX - drag.current.x);
      }}
      onMouseUp={() => (drag.current.on = false)}
    >
      {children}
    </div>
  );
}
