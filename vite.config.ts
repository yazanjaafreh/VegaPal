// @lovable.dev/vite-tanstack-config bundles tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, and nitro — do NOT add those plugins manually or builds will break.
// Outside Lovable, nitro is off by default; force it for self-host deploys (e.g. Vercel).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { SECURITY_HEADERS } from "./src/lib/security-headers";

export default defineConfig({
  nitro: {
    preset: "vercel",
    routeRules: {
      "/**": {
        headers: SECURITY_HEADERS,
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});
