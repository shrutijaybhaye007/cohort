import { useState, useMemo } from "react";
import * as api from "../api";
import { Briefcase } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import OpportunityCard from "../components/OpportunityCard";
import SearchInput from "../components/SearchInput";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const TYPES = ["All", "Internship", "Hackathon", "Workshop", "Competition", "Scholarship", "Webinar", "Event"];

export default function Opportunities() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const debouncedSearch = useDebounce(search, 350);

  const { data: allOpps, loading, error } = useFetch(() => api.getOpportunities(), []);

  const filtered = useMemo(() => {
    if (!allOpps) return [];
    let list = allOpps;
    if (activeType !== "All") list = list.filter((o) => o.type === activeType);
    if (debouncedSearch) {
      const re = new RegExp(debouncedSearch, "i");
      list = list.filter(
        (o) => re.test(o.title) || re.test(o.organization) || re.test(o.description)
      );
    }
    return list;
  }, [allOpps, activeType, debouncedSearch]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl">Opportunities</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Internships, hackathons, scholarships and more — curated for students.
        </p>
      </div>

      {/* Search */}
      <SearchInput
        id="opp-search"
        value={search}
        onChange={setSearch}
        placeholder="Search opportunities..."
      />

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeType === t
                ? "bg-forest text-white border-forest"
                : "border-line text-ink-soft bg-surface hover:border-forest/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && allOpps && (
        <p className="text-xs text-ink-soft">
          {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"}
          {activeType !== "All" && ` · ${activeType}`}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <Skeleton.Grid count={6} />
      ) : error ? (
        <p className="text-sm text-red-600 text-center py-8">
          We couldn&apos;t load opportunities right now. Please try again.
        </p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No opportunities found"
          description={
            debouncedSearch
              ? `No results for "${debouncedSearch}". Try a different search.`
              : "No opportunities available in this category right now."
          }
          action={activeType !== "All" ? "Show all" : undefined}
          onAction={() => { setActiveType("All"); setSearch(""); }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id || opp._id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
