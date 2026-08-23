import { CheckCircle2, Circle, Clock, Trash2 } from "lucide-react";

const STATUS_CONFIG = {
  "not-started": {
    label: "Not started",
    icon: Circle,
    style: "text-ink-soft",
    bg: "bg-black/[0.04]",
    next: "in-progress",
    nextLabel: "Mark in progress",
  },
  "in-progress": {
    label: "In progress",
    icon: Clock,
    style: "text-gold-dark",
    bg: "bg-gold/10",
    next: "completed",
    nextLabel: "Mark complete",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    style: "text-forest-dark",
    bg: "bg-forest/10",
    next: "not-started",
    nextLabel: "Reopen",
  },
};

/**
 * Development goal card with status toggle and delete.
 * Props: goal { id, title, status }, onStatusChange(id, newStatus), onDelete(id)
 */
export default function GoalCard({ goal, onStatusChange, onDelete }) {
  const config = STATUS_CONFIG[goal.status] || STATUS_CONFIG["not-started"];
  const Icon = config.icon;

  function handleToggle() {
    onStatusChange(goal.id, config.next);
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-card border border-line bg-surface shadow-card transition-all ${
        goal.status === "completed" ? "opacity-70" : ""
      }`}
    >
      <button
        onClick={handleToggle}
        aria-label={config.nextLabel}
        className={`mt-0.5 shrink-0 ${config.style} hover:opacity-70 transition-opacity`}
      >
        <Icon size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            goal.status === "completed" ? "line-through text-ink-soft" : "text-ink"
          }`}
        >
          {goal.title}
        </p>
        <span
          className={`inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.style}`}
        >
          {config.label}
        </span>
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(goal.id)}
          aria-label="Delete goal"
          className="shrink-0 text-ink-soft hover:text-red-500 transition-colors mt-0.5"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
