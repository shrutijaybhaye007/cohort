import { X } from "lucide-react";

const LEVEL_COLORS = {
  Beginner: "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-gold/10 text-gold-dark border-gold/30",
  Advanced: "bg-forest/10 text-forest-dark border-forest/30",
};

/**
 * Skill pill badge.
 * Props: skill (string), level ('Beginner'|'Intermediate'|'Advanced'), onRemove (optional)
 */
export default function SkillBadge({ skill, level, onRemove }) {
  const levelStyle = level ? LEVEL_COLORS[level] : "bg-parchment border-line text-ink-soft";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${levelStyle}`}
    >
      {skill}
      {level && (
        <span className="opacity-60 font-normal">{level.slice(0, 3)}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          aria-label={`Remove ${skill}`}
          className="opacity-60 hover:opacity-100 ml-0.5"
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}
