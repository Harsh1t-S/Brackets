import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import type { AdminProblem, Difficulty, Example, TestCase } from "../../../types/adminProblem";

import { useCreateProblem, useUpdateProblem } from "../hooks/useAdminProblems";
import { useToast } from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";
import RichTextEditor from "../../../components/common/RichTextEditor";

interface Props {
  open: boolean;
  onClose: () => void;
  editingProblem?: AdminProblem | null;
}

interface CodeEntry {
  language: string;
  code: string;
}

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "csharp"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toEntries(obj: Record<string, string> = {}): CodeEntry[] {
  const entries = Object.entries(obj).map(([language, code]) => ({ language, code }));
  return entries.length ? entries : [{ language: "javascript", code: "" }];
}

function toObject(entries: CodeEntry[]): Record<string, string> {
  const obj: Record<string, string> = {};
  entries.forEach((e) => {
    if (e.language.trim()) obj[e.language.trim()] = e.code;
  });
  return obj;
}

const emptyExample: Example = { input: "", output: "", explanation: "" };
const emptyTestCase: TestCase = { input: "", output: "", isHidden: false };

export default function ProblemFormModal({ open, onClose, editingProblem }: Props) {
  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [tags, setTags] = useState("");
  const [companies, setCompanies] = useState("");
  const [acceptance, setAcceptance] = useState(0);
  const [examples, setExamples] = useState<Example[]>([{ ...emptyExample }]);
  const [testCases, setTestCases] = useState<TestCase[]>([{ ...emptyTestCase }]);
  const [starter, setStarter] = useState<CodeEntry[]>(toEntries());
  const [solution, setSolution] = useState<CodeEntry[]>(toEntries());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingProblem) {
      resetForm();
      return;
    }
    // Populate the form from the problem being edited.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(editingProblem.title);
    setSlug(editingProblem.slug);
    setSlugEdited(true);
    setDifficulty(editingProblem.difficulty);
    setDescription(editingProblem.description);
    setConstraints(editingProblem.constraints ?? "");
    setTags(editingProblem.tags.join(", "));
    setCompanies(editingProblem.companies?.join(", ") ?? "");
    setAcceptance(editingProblem.acceptance);
    setExamples(
      editingProblem.examples?.length
        ? editingProblem.examples.map((e) => ({
            input: e.input,
            output: e.output,
            explanation: e.explanation ?? "",
          }))
        : [{ ...emptyExample }]
    );
    setStarter(toEntries(editingProblem.starterCode));
    setSolution(toEntries(editingProblem.solutionCode));
    setTestCases(
      editingProblem.testCases?.length
        ? editingProblem.testCases.map((tc) => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden,
          }))
        : [{ ...emptyTestCase }]
    );
    setError("");
  }, [editingProblem]);

  function resetForm() {
    setTitle("");
    setSlug("");
    setSlugEdited(false);
    setDifficulty("EASY");
    setDescription("");
    setConstraints("");
    setTags("");
    setCompanies("");
    setAcceptance(0);
    setExamples([{ ...emptyExample }]);
    setTestCases([{ ...emptyTestCase }]);
    setStarter(toEntries());
    setSolution(toEntries());
    setError("");
  }

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  // Examples helpers
  function updateExample(i: number, field: keyof Example, value: string) {
    setExamples((prev) =>
      prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex))
    );
  }
  function addExample() {
    setExamples((prev) => [...prev, { ...emptyExample }]);
  }
  function removeExample(i: number) {
    setExamples((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Test case helpers
  function updateTestCase(i: number, field: keyof TestCase, value: string | boolean) {
    setTestCases((prev) =>
      prev.map((tc, idx) => (idx === i ? { ...tc, [field]: value } : tc))
    );
  }
  function addTestCase() {
    setTestCases((prev) => [...prev, { ...emptyTestCase }]);
  }
  function removeTestCase(i: number) {
    setTestCases((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Code helpers
  function updateCode(
    set: React.Dispatch<React.SetStateAction<CodeEntry[]>>,
    i: number,
    field: keyof CodeEntry,
    value: string
  ) {
    set((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }
  function addCode(set: React.Dispatch<React.SetStateAction<CodeEntry[]>>) {
    set((prev) => [...prev, { language: "python", code: "" }]);
  }
  function removeCode(set: React.Dispatch<React.SetStateAction<CodeEntry[]>>, i: number) {
    set((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setError("");
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description,
      difficulty,
      constraints,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      companies: companies.split(",").map((c) => c.trim()).filter(Boolean),
      examples: examples.filter((e) => e.input.trim() || e.output.trim()),
      testCases: testCases.filter((tc) => tc.input.trim() && tc.output.trim()),
      starterCode: toObject(starter),
      solutionCode: toObject(solution),
      acceptance,
    };

    try {
      if (editingProblem) {
        await updateMutation.mutateAsync({ id: editingProblem.id, data: payload });
        toast(`"${payload.title}" updated`, "success");
      } else {
        await createMutation.mutateAsync(payload);
        toast(`"${payload.title}" created`, "success");
      }
      resetForm();
      onClose();
    } catch (err) {
      const data = (
        err as {
          response?: { data?: { message?: string; errors?: Record<string, string[]> } };
        }
      )?.response?.data;
      // Surface the first field-level validation message when present.
      const fieldErrors = data?.errors
        ? Object.entries(data.errors as Record<string, string[]>)
            .map(([field, msgs]) => `${field}: ${msgs[0]}`)
            .slice(0, 2)
            .join(" — ")
        : "";
      setError(
        fieldErrors ||
          data?.message ||
          "Failed to save problem. Please try again."
      );
    }
  }

  if (!open) return null;

  const loading = createMutation.isPending || updateMutation.isPending;

  function close() {
    resetForm();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      labelledBy="problem-form-title"
      dismissable={!loading}
      className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden"
    >
      <>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="problem-form-title" className="text-lg font-bold text-ink">
            {editingProblem ? "Edit Problem" : "Add Problem"}
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="btn btn-ghost h-9 w-9 !p-0 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
          {error && (
            <div className="rounded-lg border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-hard">
              {error}
            </div>
          )}

          <div className="border-b border-line pb-2">
            <h3 className="text-base font-semibold text-ink">Basics</h3>
            <p className="mt-0.5 text-xs text-ink-subtle">
              Title, difficulty and tags — shown on the problem card.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Title</label>
              <input
                className="input px-3 py-2.5"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Two Sum"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Slug</label>
              <input
                className="input px-3 py-2.5 font-mono text-sm"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                placeholder="two-sum"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Difficulty
              </label>
              <select
                className="input px-3 py-2.5"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Acceptance (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                className="input px-3 py-2.5"
                value={acceptance}
                onChange={(e) => setAcceptance(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Tags</label>
              <input
                className="input px-3 py-2.5"
                placeholder="Array, Hash Map, Binary Search"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="mt-1 text-xs text-ink-subtle">Comma-separated.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Companies
              </label>
              <input
                className="input px-3 py-2.5"
                placeholder="Google, Amazon, Meta"
                value={companies}
                onChange={(e) => setCompanies(e.target.value)}
              />
              <p className="mt-1 text-xs text-ink-subtle">
                Comma-separated — who asks this problem.
              </p>
            </div>
          </div>

          <div className="border-b border-line pb-2 pt-2">
            <h3 className="text-base font-semibold text-ink">Statement</h3>
            <p className="mt-0.5 text-xs text-ink-subtle">
              What the solver reads: description, constraints and examples.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Description</label>
            <div>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                ariaLabel="Problem description"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Constraints</label>
            <div>
              <RichTextEditor
                value={constraints}
                onChange={setConstraints}
                ariaLabel="Problem constraints"
              />
            </div>
          </div>

          {/* Examples */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Examples</label>
              <button
                type="button"
                onClick={addExample}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:opacity-80"
              >
                <Plus size={15} /> Add example
              </button>
            </div>
            <div className="space-y-3">
              {examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-2 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                      Example {i + 1}
                    </span>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(i)}
                        className="text-ink-subtle hover:text-hard"
                        aria-label="Remove example"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className="input px-3 py-2 font-mono text-sm"
                      placeholder="Input"
                      value={ex.input}
                      onChange={(e) => updateExample(i, "input", e.target.value)}
                    />
                    <input
                      className="input px-3 py-2 font-mono text-sm"
                      placeholder="Output"
                      value={ex.output}
                      onChange={(e) => updateExample(i, "output", e.target.value)}
                    />
                  </div>
                  <input
                    className="input mt-3 px-3 py-2 text-sm"
                    placeholder="Explanation (optional)"
                    value={ex.explanation}
                    onChange={(e) => updateExample(i, "explanation", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-line pb-2 pt-2">
            <h3 className="text-base font-semibold text-ink">Grading</h3>
            <p className="mt-0.5 text-xs text-ink-subtle">
              Test cases the interpreter runs against submissions.
            </p>
          </div>

          {/* Test cases */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:opacity-80"
              >
                <Plus size={15} /> Add test case
              </button>
            </div>
            <p className="mb-3 text-xs text-ink-subtle">
              Used for grading submissions. Hidden cases are never shown to users.
            </p>
            <div className="space-y-3">
              {testCases.map((tc, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-2 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                      Case {i + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => updateTestCase(i, "isHidden", e.target.checked)}
                          className="h-3.5 w-3.5 accent-[var(--color-brand)]"
                        />
                        Hidden
                      </label>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(i)}
                          className="text-ink-subtle hover:text-hard"
                          aria-label="Remove test case"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <textarea
                      rows={2}
                      className="input px-3 py-2 font-mono text-sm"
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) => updateTestCase(i, "input", e.target.value)}
                    />
                    <textarea
                      rows={2}
                      className="input px-3 py-2 font-mono text-sm"
                      placeholder="Expected output"
                      value={tc.output}
                      onChange={(e) => updateTestCase(i, "output", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-line pb-2 pt-2">
            <h3 className="text-base font-semibold text-ink">Code</h3>
            <p className="mt-0.5 text-xs text-ink-subtle">
              Per-language starter stubs and the reference solution.
            </p>
          </div>

          {/* Starter code */}
          <CodeSection
            title="Starter code"
            entries={starter}
            onAdd={() => addCode(setStarter)}
            onRemove={(i) => removeCode(setStarter, i)}
            onChange={(i, field, value) => updateCode(setStarter, i, field, value)}
          />

          {/* Solution code */}
          <CodeSection
            title="Solution code"
            entries={solution}
            onAdd={() => addCode(setSolution)}
            onRemove={(i) => removeCode(setSolution, i)}
            onChange={(i, field, value) => updateCode(setSolution, i, field, value)}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={close}
            className="btn btn-secondary px-5 py-2.5"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary px-6 py-2.5"
          >
            {loading
              ? "Saving..."
              : editingProblem
              ? "Update Problem"
              : "Save Problem"}
          </button>
        </div>
      </>
    </Modal>
  );
}

function CodeSection({
  title,
  entries,
  onAdd,
  onRemove,
  onChange,
}: {
  title: string;
  entries: CodeEntry[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: keyof CodeEntry, value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-ink">{title}</label>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:opacity-80"
        >
          <Plus size={15} /> Add language
        </button>
      </div>
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface-2 p-3">
            <div className="mb-2 flex items-center gap-2">
              <select
                className="input w-40 px-2 py-1.5 text-sm"
                value={entry.language}
                onChange={(e) => onChange(i, "language", e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="ml-auto text-ink-subtle hover:text-hard"
                  aria-label="Remove language"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <textarea
              rows={5}
              className="input p-3 font-mono text-sm"
              placeholder="// code..."
              value={entry.code}
              onChange={(e) => onChange(i, "code", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
