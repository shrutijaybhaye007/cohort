/**
 * Stat display card used in the dashboard.
 * Props: label, value, icon (Lucide component), color, href (optional link), suffix
 */
import { useNavigate } from "react-router-dom";

export default function StatCard({ label, value, icon: Icon, color = "forest", suffix, href }) {
  const navigate = useNavigate();

  const colorMap = {
    forest: "bg-forest/[0.08] text-forest-dark",
    gold: "bg-gold/[0.12] text-gold-dark",
    walnut: "bg-walnut/10 text-walnut",
    ink: "bg-ink/[0.06] text-ink",
  };

  const iconBg = colorMap[color] || colorMap.ink;

  const inner = (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${iconBg}`}>
        {Icon && <Icon size={18} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-soft leading-tight truncate">{label}</p>
        <p className="text-xl font-bold text-ink leading-tight tabular-nums">
          {value}
          {suffix && <span className="text-xs font-normal text-ink-soft ml-0.5">{suffix}</span>}
        </p>
      </div>
    </div>
  );

  const base =
    "bg-surface border border-line rounded-card shadow-card p-4 transition-all duration-150";

  if (href) {
    return (
      <button
        onClick={() => navigate(href)}
        className={`${base} hover:border-forest/40 hover:shadow-md text-left w-full`}
        aria-label={`${label}: ${value}`}
      >
        {inner}
      </button>
    );
  }

  return <div className={base}>{inner}</div>;
}
