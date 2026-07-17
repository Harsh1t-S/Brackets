import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchSection() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/problems?search=${encodeURIComponent(q)}` : "/problems");
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="card p-8 sm:p-10">
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Find your next challenge
          </h2>
          <p className="mt-3 text-center text-ink-muted">
            Search coding problems by title, difficulty, or topic.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search problems..."
                className="input py-3.5 pl-11 pr-4"
              />
            </div>
            <button type="submit" className="btn btn-primary px-8 py-3.5">
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
