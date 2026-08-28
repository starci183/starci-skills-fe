import {defineConfig} from "vitest/config"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import {fileURLToPath} from "node:url"

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {alias: {"@": fileURLToPath(new URL("./src", import.meta.url))}},
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "json-summary", "lcov"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/main.tsx"],
            thresholds: {statements: 80, lines: 80, functions: 80, branches: 75},
        },
    },
})
