import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
    },
  },
  globalIgnores([
    ".react-router/**/*",
    "build/**/*",
    "node_modules/**/*",
    "app/entry.client.tsx",
    "app/entry.server.tsx",
  ]),
]);
