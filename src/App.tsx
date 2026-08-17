import {useEffect, useState} from "react"
import type {ConsoleState} from "@/types"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {TooltipProvider} from "@/components/ui/tooltip"
import {Workspaces} from "@/panels/Workspaces"
import {Registries} from "@/panels/Registries"
import {Sessions} from "@/panels/Sessions"
import {AlertTriangle, FolderGit2, GitBranch, Layers} from "lucide-react"

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

function Stat({icon, label, value, tone}: {icon: React.ReactNode; label: string; value: string; tone?: "warn" | "bad"}) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
            <div className="text-muted-foreground">{icon}</div>
            <div className="flex flex-col">
                <span className={`text-lg leading-none font-semibold tabular-nums ${tone === "bad" ? "text-red-400" : tone === "warn" ? "text-amber-400" : ""}`}>{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
            </div>
        </div>
    )
}

export default function App() {
    const [load_, setLoad] = useState<Load>({state: "loading"})
    useEffect(() => void load().then(setLoad), [])

    const data = load_.state === "ready" ? load_.data : null
    const stale = data?.workspaces.filter((w) => w.verdict !== "ok").length ?? 0
    const sessions = data?.projects.flatMap((p) => p.sessions) ?? []
    const waiting = sessions.reduce((n, s) => n + s.queued.filter((q) => q.state === "queued").length, 0)

    return (
        <TooltipProvider delay={200}>
            <div className="min-h-screen">
                <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex w-full max-w-7xl flex-row flex-wrap items-center justify-between gap-3 px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-base leading-none font-semibold">StarCi console</h1>
                            <p className="text-xs text-muted-foreground">Chỉ đọc · mọi thao tác ghi đi qua skill</p>
                        </div>
                        {data ? (
                            <div className="flex items-center gap-2">
                                {load_.state === "ready" && load_.sample ? (
                                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">dữ liệu mẫu</Badge>
                                ) : (
                                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">đã quét</Badge>
                                )}
                                <span className="font-mono text-xs text-muted-foreground">{data.scannedAt.replace("T", " ").slice(0, 19)}</span>
                            </div>
                        ) : null}
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
                    {load_.state === "loading" ? (
                        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Đang đọc trạng thái…</CardContent></Card>
                    ) : load_.state === "failed" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Không đọc được trạng thái</CardTitle>
                                <CardDescription>
                                    {load_.reason}. Chạy <span className="font-mono text-xs">node .claude/scripts/export-console-state.mjs --out &lt;checkout&gt;/public/state.json</span>.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <>
                            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <Stat icon={<FolderGit2 className="size-4" />} label="route" value={String(load_.data.workspaces.length)} />
                                <Stat icon={<AlertTriangle className="size-4" />} label="route cần xử" value={String(stale)} tone={stale > 0 ? "bad" : undefined} />
                                <Stat icon={<GitBranch className="size-4" />} label="project có registry" value={String(load_.data.projects.length)} />
                                <Stat icon={<Layers className="size-4" />} label="hash chờ duyệt" value={String(waiting)} tone={waiting > 0 ? "warn" : undefined} />
                            </section>

                            <Tabs defaultValue="workspaces" className="gap-4">
                                <TabsList>
                                    <TabsTrigger value="workspaces">Workspaces <span className="ml-1.5 text-muted-foreground">{load_.data.workspaces.length}</span></TabsTrigger>
                                    <TabsTrigger value="registries">Registries <span className="ml-1.5 text-muted-foreground">{load_.data.projects.length}</span></TabsTrigger>
                                    <TabsTrigger value="sessions">Sessions <span className="ml-1.5 text-muted-foreground">{sessions.length}</span></TabsTrigger>
                                </TabsList>
                                <TabsContent value="workspaces"><Workspaces rows={load_.data.workspaces} /></TabsContent>
                                <TabsContent value="registries"><Registries projects={load_.data.projects} /></TabsContent>
                                <TabsContent value="sessions"><Sessions projects={load_.data.projects} /></TabsContent>
                            </Tabs>

                            {load_.data.warnings.length > 0 ? (
                                <Card className="border-amber-500/25">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-amber-400">
                                            <AlertTriangle className="size-4" /> Warnings
                                            <Badge variant="outline" className="border-amber-500/30 text-amber-400">{load_.data.warnings.length}</Badge>
                                        </CardTitle>
                                        <CardDescription>Hai danh sách lẽ ra phải khớp nhau, và thường thì không.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2 text-sm">
                                        {load_.data.warnings.map((w, i) => (
                                            <div key={w} className="flex flex-col gap-2">
                                                {i > 0 ? <Separator /> : null}
                                                <span className="text-muted-foreground">{w}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ) : null}

                            <footer className="pb-4 font-mono text-xs text-muted-foreground">Source: {load_.data.source}</footer>
                        </>
                    )}
                </main>
            </div>
        </TooltipProvider>
    )
}
