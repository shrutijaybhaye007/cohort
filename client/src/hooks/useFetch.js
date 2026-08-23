import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Runs an async function, tracking loading/error/data state.
 * Re-runs when the deps array changes (like useEffect).
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch(() => api.getUsers(), []);
 */
export function useFetch(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep a ref to the latest fn to avoid stale-closure issues
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
