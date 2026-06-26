/** Lazy-load qrcode (~77KB gzip) only when a QR image is needed. */

export async function qrCodeToDataUrl(
  value: string,
  options?: { margin?: number; width?: number; color?: { dark: string; light: string } },
): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(value, options);
}
