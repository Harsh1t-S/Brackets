import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";

export default function CTA() {
  const { user } = useAuth();

  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[100px]" />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {user
              ? "Ready for your next challenge?"
              : "Ready to start your coding journey?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
            {user
              ? "Pick a problem and keep the momentum going."
              : "Join developers preparing for coding interviews with Bracket."}
          </p>
          <Link
            to={user ? "/problems" : "/register"}
            className="btn btn-primary mt-8 px-8 py-3.5 text-base"
          >
            {user ? "Browse problems" : "Create free account"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
