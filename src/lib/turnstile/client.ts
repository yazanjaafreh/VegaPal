export function isTurnstileEnabled() {
  return Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstileOnServer(token: string): Promise<void> {
  if (!isTurnstileEnabled()) {
    return;
  }

  const response = await fetch("/api/turnstile/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Captcha verification failed. Please try again.");
  }
}
