import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-ink-subtle">
        <FileQuestion size={30} />
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink">404</h1>
      <p className="mt-3 text-ink-muted">
        This page doesn't exist — maybe the problem got deleted, or the link is off.
      </p>
      <Link to="/" className="btn btn-primary mt-8 px-6 py-3">
        <ArrowLeft size={18} />
        Back home
      </Link>
    </div>
  );
}
