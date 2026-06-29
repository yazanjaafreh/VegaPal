import { serverTurnstilePolicy, shouldBypassTurnstile } from "@/lib/turnstile/policy";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerifyResult = {
  success: boolean;
  error?: string;
  skipped?: boolean;
};

export async function verifyTurnstileToken(
  token: string,
  options?: { remoteIp?: string; host?: string | null },
): Promise<TurnstileVerifyResult> {
  const host = options?.host ?? null;

  if (shouldBypassTurnstile(serverTurnstilePolicy(host))) {
    return { success: true, skipped: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const isProductionHost = host && !shouldBypassTurnstile(serverTurnstilePolicy(host));

  if (!secret) {
    if (isProductionHost) {
      return { success: false, error: "Captcha verification failed. Please try again." };
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set — verification skipped");
    }
    return { success: true, skipped: true };
  }

  if (!token?.trim()) {
    return { success: false, error: "Captcha token is required." };
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token.trim());
  if (options?.remoteIp) {
    form.set("remoteip", options.remoteIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!response.ok) {
    return { success: false, error: "Captcha verification failed. Please try again." };
  }

  const data = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!data.success) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[turnstile] siteverify failed", data["error-codes"] ?? []);
    }
    return { success: false, error: "Captcha verification failed. Please try again." };
  }

  return { success: true };
}

export async function handleTurnstileVerifyRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ success: false, error: "Method not allowed." }, { status: 405 });
  }

  try {
    const body = (await request.json()) as { token?: string };
    const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const host = request.headers.get("host");
    const result = await verifyTurnstileToken(body.token ?? "", { remoteIp, host });

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error ?? "Captcha verification failed." },
        { status: 403 },
      );
    }

    return Response.json({ success: true, skipped: result.skipped ?? false });
  } catch {
    return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
}
