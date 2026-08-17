import {useEffect, useState} from "react"
import type {ConsoleState} from "@/types"
import {Badge, Card, Empty} from "@/components/ui/primitives"
import {Workspaces} from "@/panels/Workspaces"
import {Registries} from "@/panels/Registries"
import {Sessions} from "@/panels/Sessions"

type Load = {state: "loading"} | {state: "ready"; data: ConsoleState; sample: boolean} | {state: "failed"; reason: string}

// state.json is the scan of this machine and is never committed; state.sample.json ships with the repo
// so the console renders for somebody who has not scanned yet. Which one is showing is stated, because
// a sample presented as live data is the worst thing a read-only console can do.
async function load(): Promise<Load> {
    for (const [file, sample] of [["/state.json", false], ["/state.sample.json", true]] as const) {
        try {
            const response = await fetch(file, {cache: "no-store"})
            if (!response.ok) continue
            return {state: "ready", data: (await response.json()) as ConsoleState, sample}
        } catch {
            continue
        }
    }
    return {state: "failed", reason: "Không đọc được state.json lẫn state.sample.json"}
}

export default function App() {
    const [load_, setLoad] = useState<Load>({state: "loading"})
    useEffect(() => void load().then(setLoad), [])

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
            <header className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap items-baseline justify-between gap-3">
                    <h1 className="text-lg font-semibold">StarCi console</h1>
                    {load_.state === "ready" ? (
                        <div className="flex items-center gap-2">
                            {load_.sample ? <Badge tone="warn">dữ liệu mẫu</Badge> : <Badge tone="ok">đã quét</Badge>}
                            <span className="text-xs text-ink-muted">{load_.data.scannedAt}</span>
                        </div>
                    ) : null}
                </div>
                <p className="max-w-3xl text-sm text-ink-muted">
                    Chỉ đọc. Mọi thao tác ghi vào <span className="font-mono text-xs">.workspace</span> và{" "}
                    <span className="font-mono text-xs">.worktrees</span> đi qua skill, nên ở đây hành động hiện ra dưới dạng
                    câu lệnh để copy — một root chỉ có một tác giả.
                </p>
            </header>

            {load_.state === "loading" ? (
                <Card><Empty>Đang đọc trạng thái…</Empty></Card>
            ) : load_.state === "failed" ? (
                <Card title="Không đọc được trạng thái">
                    <Empty>
                        {load_.reason}. Chạy <span className="font-mono text-xs">node .claude/scripts/export-console-state.mjs</span> để sinh nó.
                    </Empty>
                </Card>
            ) : (
                <>
                    <Workspaces rows={load_.data.workspaces} />
                    <Registries projects={load_.data.projects} />
                    <Sessions projects={load_.data.projects} />
                    {load_.data.warnings.length > 0 ? (
                        <Card title="Warnings" fact={`${load_.data.warnings.length}`}>
                            <ul className="flex flex-col gap-1 px-4 py-3 text-sm text-ink-muted">
                                {load_.data.warnings.map((w) => (
                                    <li key={w}>{w}</li>
                                ))}
                            </ul>
                        </Card>
                    ) : null}
                    <footer className="text-xs text-ink-muted">
                        Source: <span className="font-mono">{load_.data.source}</span>
                    </footer>
                </>
            )}
        </main>
    )
}
