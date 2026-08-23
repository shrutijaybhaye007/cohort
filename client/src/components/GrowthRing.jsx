import Avatar from "./Avatar";

// The signature visual motif of the app: a ring of ticks around a person's
// avatar, styled after the growth rings on a tree cross-section. Each tick
// is one "development credit" — a completed session, post, or milestone.
// Filled ticks (forest green) show progress toward the current goal;
// the gold tick marks exactly where they are today.
export default function GrowthRing({ user, size = 64, ticks = 24, showLabel = false }) {
  if (!user) return null;
  const credits = Math.max(0, Math.min(100, user.credits ?? 0));
  const filledCount = Math.round((credits / 100) * ticks);
  const radius = size / 2;
  const avatarSize = size * 0.72;
  const tickLength = size * 0.09;
  const tickInset = radius - tickLength - 1;

  const tickEls = Array.from({ length: ticks }).map((_, i) => {
    const angle = (i / ticks) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const x1 = radius + tickInset * Math.cos(rad);
    const y1 = radius + tickInset * Math.sin(rad);
    const x2 = radius + (tickInset + tickLength) * Math.cos(rad);
    const y2 = radius + (tickInset + tickLength) * Math.sin(rad);
    const isFilled = i < filledCount;
    const isCurrent = i === filledCount - 1;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={isCurrent ? 2.4 : 1.6}
        stroke={isCurrent ? "#C9A227" : isFilled ? "#2F5233" : "#E4DFD1"}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="absolute top-0 left-0" aria-hidden="true">
        {tickEls}
      </svg>
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <Avatar user={user} size={avatarSize} />
      </div>
      {showLabel && (
        <span className="mt-1.5 font-mono text-[11px] text-ink-soft tracking-wide">
          {credits} credits
        </span>
      )}
    </div>
  );
}
