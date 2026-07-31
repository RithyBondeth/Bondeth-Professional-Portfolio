import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Replacing (not extending) the default ignores of eslint-config-next, so
  // every directory to skip has to be listed here explicitly.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Custom NEXT_DIST_DIR build dirs (see .claude/launch.json). Without this
    // their compiled chunks get linted and bury the real source findings under
    // thousands of generated-code violations.
    ".next-*/**",
  ]),
  // github-profile/ is a standalone CommonJS Node script that renders the
  // GitHub profile README's SVGs — not part of the Next app, so the app's
  // module rules don't apply to it.
  {
    files: ["github-profile/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
