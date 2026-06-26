import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { qrCodeToDataUrl } from "@/lib/qrcode-lazy";
import { cn } from "@/lib/utils";

type PaymentQrProps = {
  value: string;
  className?: string;
  /** Defer QR generation until the browser is idle (improves LCP/TTI on landing). */
  defer?: boolean;
};

export function PaymentQr({ value, className, defer = false }: PaymentQrProps) {
  const { t: tc } = useTranslation("common");
  const [src, setSrc] = useState<string | null>(null);
  const [active, setActive] = useState(!defer);

  useEffect(() => {
    if (!defer) return;
    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(() => setActive(true));
      return () => cancelIdleCallback(idleId);
    }
    const timeoutId = window.setTimeout(() => setActive(true), 200);
    return () => window.clearTimeout(timeoutId);
  }, [defer]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    qrCodeToDataUrl(value, { margin: 1, width: 168 })
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, active]);

  if (!active || !src) {
    return (
      <div
        className={cn("h-[132px] w-[132px] rounded-xl bg-muted animate-pulse shrink-0", className)}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt={tc("qr.walletAlt")}
      width={132}
      height={132}
      loading="lazy"
      decoding="async"
      className={cn(
        "h-[132px] w-[132px] rounded-xl border border-border bg-white p-1.5 shrink-0",
        className,
      )}
    />
  );
}
