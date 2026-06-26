import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isTurnstileEnabled } from "@/lib/turnstile/client";

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

let scriptLoadPromise: Promise<void> | undefined;

function loadTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      if (window.turnstile) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), {
        once: true,
      });
      return;
    }

    window.onTurnstileLoad = () => resolve();
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  resetRef?: React.MutableRefObject<(() => void) | null>;
  className?: string;
};

export function TurnstileWidget({
  onToken,
  onExpire,
  onError,
  resetRef,
  className,
}: TurnstileWidgetProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  onTokenRef.current = onToken;
  onExpireRef.current = onExpire;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!siteKey || !isTurnstileEnabled()) {
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => {
            onTokenRef.current("");
            onExpireRef.current?.();
          },
          "error-callback": () => {
            onTokenRef.current("");
            onErrorRef.current?.();
          },
        });

        if (resetRef) {
          resetRef.current = () => {
            if (widgetIdRef.current && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
            onTokenRef.current("");
          };
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          onErrorRef.current?.();
        }
      });

    return () => {
      cancelled = true;
      if (resetRef) {
        resetRef.current = null;
      }
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, resetRef]);

  if (!siteKey || !isTurnstileEnabled()) {
    return null;
  }

  if (loadError) {
    return (
      <p className={cn("text-sm text-destructive", className)}>
        Captcha could not load. Please refresh and try again.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("min-w-0 max-w-full overflow-hidden flex justify-center", className)}
      aria-label="Security check"
    />
  );
}
