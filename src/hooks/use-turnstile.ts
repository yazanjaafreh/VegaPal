import { useCallback, useRef, useState } from "react";
import { isTurnstileEnabled, verifyTurnstileOnServer } from "@/lib/turnstile/client";

export function useTurnstile() {
  const enabled = isTurnstileEnabled();
  const [token, setToken] = useState("");
  const resetRef = useRef<(() => void) | null>(null);

  const reset = useCallback(() => {
    setToken("");
    resetRef.current?.();
  }, []);

  const verifyBeforeAuth = useCallback(async () => {
    if (!enabled) {
      return;
    }
    if (!token) {
      throw new Error("Please complete the captcha.");
    }
    await verifyTurnstileOnServer(token);
  }, [enabled, token]);

  return {
    enabled,
    token,
    setToken,
    reset,
    resetRef,
    verifyBeforeAuth,
  };
}
