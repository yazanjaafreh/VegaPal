// @lovable.dev/vite-tanstack-config bundles tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, and nitro — do NOT add those plugins manually or builds will break.
// Outside Lovable, nitro is off by default; force it for self-host deploys (e.g. Vercel).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    routeRules: {
      "/**": {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "X-Frame-Options": "SAMEORIGIN",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});
