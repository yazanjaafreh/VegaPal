import { useCallback, useRef } from "react";

/** Prevents overlapping async form submissions. */
export function useSubmitGuard() {
  const activeRef = useRef(false);

  const begin = useCallback(() => {
    if (activeRef.current) return false;
    activeRef.current = true;
    return true;
  }, []);

  const end = useCallback(() => {
    activeRef.current = false;
  }, []);

  return { begin, end, isActive: () => activeRef.current };
}
