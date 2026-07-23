import { Search } from "lucide-react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search problems...",
}: Props) {
  return (
    <div className="relative w-full sm:max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="input py-2.5 pl-10 pr-4"
      />
    </div>
  );
}
