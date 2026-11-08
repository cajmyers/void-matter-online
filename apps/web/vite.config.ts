import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Modes (see docs/implementation-plan.md, Stage 0 and 1f):
//   dev                      -> `vite`, includes the /dev/* pages
//   build --mode preview     -> includes the /dev/* pages, for review on a URL
//   build (production)       -> strips the /dev/* pages
//
// __DEV_PAGES__ is replaced with a literal at every use site, so in production
// the guarded branches and their lazy chunks are removed by dead-code elimination.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    __DEV_PAGES__: JSON.stringify(mode !== "production"),
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
}));
