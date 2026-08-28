import {mkdir, readFile, writeFile} from "node:fs/promises"
import {isAbsolute} from "node:path"
import {execFileSync} from "node:child_process"

const fail = (message) => {
    console.error(`coverage: ${message}`)
    process.exitCode = 1
}

const metric = (entry, key) => {
    const value = entry?.[key]
    if (value && typeof value.total === "number" && typeof value.covered === "number") return value
    const rawKey = {statements: "s", functions: "f", lines: "s", branches: "b"}[key]
    const raw = rawKey ? entry?.[rawKey] : undefined
    if (!raw || typeof raw !== "object") throw new Error(`missing ${key} metric`)
    const values = Object.values(raw)
    if (values.length === 0) throw new Error(`empty ${key} metric`)
    if (key === "branches") {
        const branches = values.flatMap((value) => Array.isArray(value) ? value : [])
        return {covered: branches.filter((count) => count > 0).length, total: branches.length}
    }
    return {covered: values.filter((count) => typeof count === "number" && count > 0).length, total: values.length}
}

try {
    const summary = JSON.parse(await readFile("coverage/coverage-summary.json", "utf8"))
    const total = summary.total
    const names = ["statements", "functions", "lines", "branches"]
    const overall = Object.fromEntries(names.map((name) => {
        const value = metric(total, name)
        return [name, {covered: value.covered, total: value.total, pct: value.total === 0 ? 0 : value.covered / value.total * 100}]
    }))
    if (names.some((name) => overall[name].total === 0)) throw new Error("empty coverage denominator")
    console.log(`overall ${JSON.stringify(overall)}`)

    const sourceFiles = [...new Set([
        ...execFileSync("git", ["diff", "--diff-filter=ACMRT", "--name-only", "HEAD", "--", "src"], {encoding: "utf8"}).split(/\r?\n/),
        ...execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "src"], {encoding: "utf8"}).split(/\r?\n/),
    ].filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.(ts|tsx)$/.test(file)))]
    const baseSha = process.env.COVERAGE_BASE_SHA
    if (sourceFiles.length === 0) {
        console.log("patch N/A (no source change detected)")
        await mkdir("coverage", {recursive: true})
        await writeFile("coverage/patch-summary.json", JSON.stringify({baseSha: null, status: "N/A", metrics: null}, null, 2))
    } else {
        if (!baseSha) throw new Error("COVERAGE_BASE_SHA is required when source files changed")
        const changedAgainstBase = execFileSync("git", ["diff", "--diff-filter=ACMRT", "--name-only", baseSha, "--", "src"], {encoding: "utf8"})
            .split(/\r?\n/).filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.(ts|tsx)$/.test(file))
        const files = JSON.parse(await readFile("coverage/coverage-final.json", "utf8"))
        if (Object.keys(files).some((file) => !isAbsolute(file))) throw new Error("coverage-final.json must use absolute file keys")
        const entries = changedAgainstBase.map((file) => {
            const absolute = isAbsolute(file) ? file : `${process.cwd()}\\${file.replaceAll("/", "\\")}`
            const entry = files[absolute] ?? files[file]
            if (!entry) throw new Error(`missing coverage file for ${file}`)
            return entry
        })
        const measuredEntries = entries.filter((entry) => {
            try {
                return metric(entry, "statements").total > 0
            } catch {
                return false
            }
        })
        if (measuredEntries.length === 0) throw new Error("empty patch source set")
        const patch = Object.fromEntries(names.map((name) => {
            const values = measuredEntries.flatMap((entry) => {
                try {
                    return [metric(entry, name)]
                } catch {
                    return []
                }
            })
            const covered = values.reduce((sum, value) => sum + value.covered, 0)
            const denominator = values.reduce((sum, value) => sum + value.total, 0)
            if (denominator === 0) throw new Error(`empty patch ${name} denominator`)
            return [name, {covered, total: denominator, pct: covered / denominator * 100}]
        }))
        console.log(`patch ${JSON.stringify(patch)}`)
        await mkdir("coverage", {recursive: true})
        await writeFile("coverage/patch-summary.json", JSON.stringify({baseSha, status: "measured", metrics: patch}, null, 2))
        if (names.some((name) => patch[name].pct < 90)) throw new Error("patch metrics must be at least 90%")
    }
} catch (error) {
    fail(error instanceof Error ? error.message : String(error))
}
