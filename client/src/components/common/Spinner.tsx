import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-ink-subtle ${className}`}
      aria-hidden
    />
  );
}

/** Full-height centered loader with an accessible label. */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-96 flex-col items-center justify-center gap-3 text-ink-muted"
    >
      <Spinner size={26} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
