/**
 * Profile completion progress bar with segment tips.
 * Props: profile (user object), className
 */
export default function ProfileCompletion({ profile, className = "" }) {
  const fields = [
    { key: "bio", label: "Add a bio", weight: 15 },
    { key: "headline", label: "Add a headline", weight: 10 },
    { key: "university", label: "Add your university", weight: 10 },
    { key: "location", label: "Add your location", weight: 5 },
    {
      key: "skills",
      label: "Add at least 3 skills",
      weight: 20,
      check: (p) => (p.skills || []).length >= 3,
    },
    {
      key: "projects",
      label: "Add a project",
      weight: 20,
      check: (p) => (p.projects || []).length >= 1,
    },
    {
      key: "certifications",
      label: "Add a certification",
      weight: 10,
      check: (p) => (p.certifications || []).length >= 1,
    },
    {
      key: "links",
      label: "Add a GitHub or portfolio link",
      weight: 10,
      check: (p) => !!(p.links?.github || p.links?.portfolio),
    },
  ];

  let earned = 0;
  const missing = [];

  for (const f of fields) {
    const done = f.check
      ? f.check(profile)
      : Boolean(profile[f.key] && (typeof profile[f.key] === "string" ? profile[f.key].trim() : true));
    if (done) {
      earned += f.weight;
    } else {
      missing.push(f.label);
    }
  }

  const pct = Math.min(100, earned);

  const color =
    pct >= 80 ? "bg-forest" : pct >= 50 ? "bg-gold" : "bg-walnut";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">
          Profile {pct}% complete
        </span>
        {pct < 100 && (
          <span className="text-ink-soft">{100 - pct}% to go</span>
        )}
      </div>

      {/* Track */}
      <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Profile ${pct}% complete`}
        />
      </div>

      {/* Next tip */}
      {missing.length > 0 && (
        <p className="text-[11px] text-ink-soft">
          Next: <span className="font-medium text-ink">{missing[0]}</span>
        </p>
      )}
      {pct === 100 && (
        <p className="text-[11px] text-forest-dark font-medium">
          ✓ Your profile is complete!
        </p>
      )}
    </div>
  );
}
