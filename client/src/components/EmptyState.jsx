/**
 * Reusable empty state component.
 * Props: icon (Lucide component), title, description, action (button label), onAction
 */
export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="text-center py-14 px-6 border border-dashed border-line rounded-card">
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-parchment mb-4">
          <Icon size={22} className="text-ink-soft" />
        </div>
      )}
      <p className="font-display text-lg text-ink">{title}</p>
      {description && (
        <p className="text-sm text-ink-soft mt-1 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-4 text-sm font-medium text-forest-dark hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  );
}
