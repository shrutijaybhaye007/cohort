import { useEffect, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "bg-forest text-white",
  error: "bg-red-600 text-white",
  info: "bg-ink text-white",
};

/**
 * Single toast notification with auto-dismiss.
 * Props: id, message, type ('info'|'success'|'error'), onDismiss
 */
function Toast({ id, message, type = "info", onDismiss }) {
  const Icon = ICONS[type] || Info;

  // Pause animation on hover
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 min-w-[260px] max-w-sm px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${STYLES[type]} animate-slide-up`}
    >
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-70 hover:opacity-100 ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Toast container — renders in fixed bottom-right corner.
 * Props: toasts (array), onDismiss (fn)
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col gap-2 items-end"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default Toast;
