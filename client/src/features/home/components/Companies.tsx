const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Adobe",
  "Netflix",
  "Uber",
  "Meta",
  "Apple",
];

export default function Companies() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            Prepare for top companies
          </h2>
          <p className="mt-2 text-ink-muted">
            Practice questions asked by leading tech companies.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {companies.map((company) => (
            <div
              key={company}
              className="card flex items-center justify-center p-6 text-center text-base font-semibold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-line-strong hover:text-ink"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
