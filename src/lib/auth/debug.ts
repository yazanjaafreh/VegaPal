/** Dev-only auth diagnostics — never logs tokens or secrets. */
export function logAuthDebug(scope: string, detail: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return;
  console.debug(`[auth:${scope}]`, detail);
}
