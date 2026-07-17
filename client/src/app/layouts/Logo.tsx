import { Link } from "react-router-dom";
import { Braces } from "lucide-react";

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-on-brand shadow-sm transition-transform group-hover:-rotate-6">
        <Braces size={20} strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-gradient">
        Bracket
      </span>
    </Link>
  );
}
