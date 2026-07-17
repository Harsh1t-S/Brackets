interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export default function DifficultyFilter({ value = "", onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="input px-4 py-2.5 sm:w-56"
    >
      <option value="">All Difficulties</option>
      <option value="EASY">Easy</option>
      <option value="MEDIUM">Medium</option>
      <option value="HARD">Hard</option>
    </select>
  );
}
