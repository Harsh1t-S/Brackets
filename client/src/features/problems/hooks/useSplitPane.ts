import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag-to-resize for a split layout. Returns the current size as a
 * percentage plus the props for the divider handle. Listeners live on the
 * window so the drag survives the cursor outrunning the thin handle.
 */
export function useSplitPane({
  initial = 50,
  min = 20,
  max = 80,
  direction = "horizontal",
  storageKey,
}: {
  initial?: number;
  min?: number;
  max?: number;
  /** "horizontal" = side-by-side panes (drag left/right). */
  direction?: "horizontal" | "vertical";
  /** Remember this split across problems and reloads when set. */
  storageKey?: string;
} = {}) {
  const [size, setSize] = useState(() => {
    if (!storageKey) return initial;
    try {
      const saved = Number(localStorage.getItem(storageKey));
      // Guard against a stored value from an older min/max, or junk.
      return saved >= min && saved <= max ? saved : initial;
    } catch {
      return initial;
    }
  });

  // Persist the layout so it doesn't snap back on every problem you open.
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, String(Math.round(size)));
    } catch {
      // Private mode / quota — the drag still works for this session.
    }
  }, [size, storageKey]);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct =
        direction === "horizontal"
          ? ((e.clientX - rect.left) / rect.width) * 100
          : ((e.clientY - rect.top) / rect.height) * 100;
      setSize(Math.min(max, Math.max(min, pct)));
    },
    [direction, min, max]
  );

  const stop = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    // Kill text selection / cursor flicker for the duration of the drag.
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor =
      direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = "";
    };
  }, [dragging, onPointerMove, stop, direction]);

  /** Keyboard support so the divider isn't mouse-only. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const back = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const fwd = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
      if (e.key === back) setSize((s) => Math.max(min, s - 2));
      if (e.key === fwd) setSize((s) => Math.min(max, s + 2));
    },
    [direction, min, max]
  );

  return {
    size,
    dragging,
    containerRef,
    handleProps: {
      role: "separator" as const,
      "aria-orientation":
        direction === "horizontal"
          ? ("vertical" as const)
          : ("horizontal" as const),
      "aria-valuenow": Math.round(size),
      tabIndex: 0,
      onPointerDown: (e: React.PointerEvent) => {
        // Primary button only — a right-click here used to begin a drag that
        // then followed the cursor until the next click anywhere.
        if (e.button !== 0) return;
        e.preventDefault();
        setDragging(true);
      },
      /** Double-click the divider to restore the default split. */
      onDoubleClick: () => setSize(initial),
      onKeyDown,
    },
  };
}
