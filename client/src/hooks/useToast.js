import { useState, useCallback } from "react";

let _nextId = 1;

/**
 * Manages a queue of toast notifications.
 *
 * Returns: { toasts, toast(message, type, duration), dismiss(id) }
 *
 * Types: 'info' | 'success' | 'error'
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info", duration = 3200) => {
      const id = _nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
}
