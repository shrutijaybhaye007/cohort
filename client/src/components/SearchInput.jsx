import { Search, X } from "lucide-react";

/**
 * Debounced search input with clear button.
 * Props: value, onChange, placeholder, className
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
  id,
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 text-sm border border-line rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40 placeholder:text-ink-soft/60"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
