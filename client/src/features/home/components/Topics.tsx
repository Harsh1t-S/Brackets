import { useNavigate } from "react-router-dom";

const topics = [
  "Array",
  "String",
  "Hash Map",
  "Linked List",
  "Stack",
  "Sliding Window",
  "Binary Search",
  "Graph",
  "Divide and Conquer",
  "Heap",
  "Math",
  "Recursion",
];

export default function Topics() {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            Explore by topic
          </h2>
          <p className="mt-2 text-ink-muted">
            Master every important data structure and algorithm.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => navigate(`/problems?tag=${encodeURIComponent(topic)}`)}
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-muted transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
