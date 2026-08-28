import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import starciFe, {linterOptions, recommended, starciFeConfig} from "@starci/eslint-canon-fe"

export default tseslint.config(
    {
        ignores: ["dist/**", "coverage/**", "node_modules/**", "playwright-report/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["scripts/**/*.mjs", "*.config.{js,mjs,ts}"],
        languageOptions: {
            globals: {
                Buffer: "readonly",
                console: "readonly",
                fetch: "readonly",
                process: "readonly",
                setTimeout: "readonly",
                URL: "readonly",
            },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parserOptions: {projectService: true, tsconfigRootDir: import.meta.dirname},
        },
    },
    starciFeConfig({layout: "single-app", plugin: starciFe, recommended, linterOptions}),
)
