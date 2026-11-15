import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// Stage 0 lint. The determinism and import-boundary rules for the engine
// packages (ENF-1) arrive with those packages in Stage 2 and are deliberately
// not enabled for apps/web, which legitimately uses window, document and timers.
export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "docs/**", ".firebase/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["packages/content/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.config.{js,ts}", "apps/web/vite.config.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
);
