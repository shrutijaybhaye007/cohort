import { useState, useMemo } from "react";
import * as api from "../api";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import ResourceCard from "../components/ResourceCard";
import SearchInput from "../components/SearchInput";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { BookOpen } from "lucide-react";

const CATEGORIES = [
  "All",
  "Web Development",
  "Programming",
  "AI/ML",
  "Data Science",
  "Database",
  "Data Structures",
  "UI/UX",
  "Cybersecurity",
  "Communication",
  "Interview Prep",
  "Resume Building",
  "Career Development",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const debouncedSearch = useDebounce(search, 350);

  const { data: allResources, loading, error } = useFetch(() => api.getResources(), []);

  const filtered = useMemo(() => {
    if (!allResources) return [];
    let list = allResources;
    if (category !== "All") list = list.filter((r) => r.category === category);
    if (difficulty !== "All") list = list.filter((r) => r.difficulty === difficulty);
    if (debouncedSearch) {
      const re = new RegExp(debouncedSearch, "i");
      list = list.filter(
        (r) =>
          re.test(r.title) ||
          re.test(r.description) ||
          (r.tags || []).some((t) => re.test(t))
      );
    }
    return list;
  }, [allResources, category, difficulty, debouncedSearch]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl">Learning Resources</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Curated free resources across every domain. Start learning today.
        </p>
      </div>

      {/* Search */}
      <SearchInput
        id="resources-search"
        value={search}
        onChange={setSearch}
        placeholder="Search resources, topics, tags..."
      />

      {/* Filters row */}
      <div className="space-y-3">
        {/* Category scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                category === c
                  ? "bg-forest text-white border-forest"
                  : "border-line text-ink-soft bg-surface hover:border-forest/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                difficulty === d
                  ? "bg-ink text-white border-ink"
                  : "border-line text-ink-soft bg-surface hover:border-ink/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && allResources && (
        <p className="text-xs text-ink-soft">
          {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <Skeleton.Grid count={6} />
      ) : error ? (
        <p className="text-sm text-red-600 text-center py-8">
          Couldn&apos;t load resources right now. Please try again.
        </p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources found"
          description={
            debouncedSearch
              ? `No results for "${debouncedSearch}". Try a broader search.`
              : "No resources in this category yet."
          }
          action="Clear filters"
          onAction={() => { setCategory("All"); setDifficulty("All"); setSearch(""); }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <ResourceCard key={r.id || r._id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
