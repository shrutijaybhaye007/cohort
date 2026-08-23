/**
 * Generic skeleton loading component.
 * Usage: <Skeleton className="h-4 w-2/3" /> or <Skeleton.Card /> for full-card skeletons.
 */
export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-black/[0.06] rounded-lg ${className}`}
    />
  );
}

Skeleton.Card = function SkeletonCard({ lines = 3, hasAvatar = false }) {
  return (
    <div className="bg-surface border border-line rounded-card shadow-card p-5 animate-pulse">
      <div className="flex gap-3">
        {hasAvatar && <div className="w-11 h-11 rounded-full bg-black/[0.06] shrink-0" />}
        <div className="flex-1 space-y-2.5">
          <div className="h-3 bg-black/[0.06] rounded w-1/3" />
          <div className="h-3 bg-black/[0.06] rounded w-2/3" />
          {lines >= 3 && <div className="h-3 bg-black/[0.06] rounded w-1/2 mt-1" />}
          {lines >= 4 && <div className="h-3 bg-black/[0.06] rounded w-3/4" />}
        </div>
      </div>
    </div>
  );
};

Skeleton.Row = function SkeletonRow({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton.Card key={i} hasAvatar />
      ))}
    </div>
  );
};

Skeleton.Grid = function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton.Card key={i} lines={4} />
      ))}
    </div>
  );
};
