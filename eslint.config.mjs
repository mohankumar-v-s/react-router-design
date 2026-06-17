import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/no-unknown-property": "warn",
    },
  },
]);
