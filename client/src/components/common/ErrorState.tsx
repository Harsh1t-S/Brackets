import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Consistent inline error panel with an optional Retry action. */
export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="card flex flex-col items-center gap-3 p-10 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hard/10 text-hard">
        <AlertTriangle size={22} />
      </span>
      <div>
        <h2 className="font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary mt-1 px-4 py-2 text-sm"
        >
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
