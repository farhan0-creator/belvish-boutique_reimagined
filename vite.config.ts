// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Photos/videos live on Lovable's CDN under relative /__l5e/ URLs. Builds on other hosts
// (Vercel, Netlify) must load them from the Lovable site instead. ASSET_ORIGIN overrides.
const LOVABLE_ORIGIN = "https://belvish-boutique-reimagined.lovable.app";
const assetOrigin =
  process.env["ASSET_ORIGIN"] ?? (process.env["VERCEL"] || process.env["NETLIFY"] ? LOVABLE_ORIGIN : "");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    define: { __ASSET_ORIGIN__: JSON.stringify(assetOrigin) },
  },
});
