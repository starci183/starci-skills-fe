import {useEffect, useState} from "react"
import type {ConsoleState} from "@/types"
import {
    appHeaderClassName, appHeaderInnerClassName, appHeadingGroupClassName, appMainClassName,
    appShellClassName, appSubtitleClassName, appTitleClassName, commandHintClassName,
    getStatValueClassName, loadingMessageClassName, snapshotMetaClassName, snapshotTimestampClassName,
    sourceFooterClassName, statBodyClassName, statClassName, statIconClassName, statLabelClassName,
    statsGridClassName, tabCountClassName, tabsWrapperClassName, warningCardClassName, warningCountClassName,
    warningRowClassName, warningRowsClassName, warningTextClassName, warningTitleClassName,
} from "./classNames"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {TooltipProvider} from "@/components/ui/tooltip"
import {Icon, type IconName} from "@/components/leaves/Icon"
import {Heading} from "@/components/leaves/Heading"
import {copy} from "@/resources/copy"
import {Workspaces} from "@/panels/Workspaces"
import {Registries} from "@/panels/Registries"
import {Sessions} from "@/panels/Sessions"

type Load = {state: "loading"} | {state: "ready"; data: ConsoleState; sample: boolean} | {state: "failed"; reason: string}

// state.json is the scan of this machine and is never committed; state.sample.json ships with the repo
// so the console renders for somebody who has not scanned yet. Which one is showing is stated, because
// a sample presented as live data is the worst thing a read-only console can do.
const load = async (): Promise<Load> => {
    for (const [file, sample] of [["/state.json", false], ["/state.sample.json", true]] as const) {
        try {
            const response = await fetch(file, {cache: "no-store"})
            if (!response.ok) continue
            return {state: "ready", data: (await response.json()) as ConsoleState, sample}
        } catch {
            continue
        }
    }
    return {state: "failed", reason: "Unable to read state.json or state.sample.json"}
}

type StatProps = {icon: IconName; label: string; value: string; tone?: "warn" | "bad"}

const Stat = (props: StatProps) => {
    return (
        <div className={statClassName}>
            <div className={statIconClassName}><Icon name={props.icon} /></div>
            <div className={statBodyClassName}>
                <span className={getStatValueClassName(props.tone)}>{props.value}</span>
                <span className={statLabelClassName}>{props.label}</span>
            </div>
        </div>
    )
}

/** Composes the read-only snapshot panels and their source metadata. */
export type AppProps = Record<string, never>

const App = (props: AppProps) => {
    void props
    const [load_, setLoad] = useState<Load>({state: "loading"})
    useEffect(() => void load().then(setLoad), [])

    const data = load_.state === "ready" ? load_.data : null
    const stale = data?.workspaces.filter((w) => w.verdict !== "ok").length ?? 0
    const sessions = data?.projects.flatMap((p) => p.sessions) ?? []
    const waiting = sessions.reduce((n, s) => n + s.queued.filter((q) => q.state === "queued").length, 0)

    return (
        <TooltipProvider delay={200}>
            <div className={appShellClassName}>
                <header className={appHeaderClassName}>
                    <div className={appHeaderInnerClassName}>
                        <div className={appHeadingGroupClassName}>
                            <Heading level={1} content={<span className={appTitleClassName}>{copy.app.title}</span>} />
                            <p className={appSubtitleClassName}>{copy.app.subtitle}</p>
                        </div>
                        {data ? (
                            <div className={snapshotMetaClassName}>
                                {load_.state === "ready" && load_.sample ? (
                                    <Badge variant="outline">{copy.app.sample}</Badge>
                                ) : (
                                    <Badge variant="outline">{copy.app.scanned}</Badge>
                                )}
                                <span className={snapshotTimestampClassName}>{data.scannedAt.replace("T", " ").slice(0, 19)}</span>
                            </div>
                        ) : null}
                    </div>
                </header>

                <main className={appMainClassName}>
                    {load_.state === "loading" ? (
                        <Card><CardContent><div className={loadingMessageClassName}>{copy.app.loading}</div></CardContent></Card>
                    ) : load_.state === "failed" ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>{copy.app.failedTitle}</CardTitle>
                                <CardDescription>
                                    {load_.reason}. {copy.app.failedHint} <span className={commandHintClassName}>node .claude/scripts/export-console-state.mjs --out &lt;checkout&gt;/public/state.json</span>.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <>
                            <section className={statsGridClassName}>
                                <Stat icon="workspace" label={copy.labels.route} value={String(load_.data.workspaces.length)} />
                                <Stat icon="warning" label={copy.labels.staleRoutes} value={String(stale)} tone={stale > 0 ? "bad" : undefined} />
                                <Stat icon="branch" label={copy.labels.registryProjects} value={String(load_.data.projects.length)} />
                                <Stat icon="layers" label={copy.labels.queuedHashes} value={String(waiting)} tone={waiting > 0 ? "warn" : undefined} />
                            </section>

                            <div className={tabsWrapperClassName}><Tabs defaultValue="workspaces">
                                <TabsList>
                                    <TabsTrigger value="workspaces">Workspaces <span className={tabCountClassName}>{load_.data.workspaces.length}</span></TabsTrigger>
                                    <TabsTrigger value="registries">Registries <span className={tabCountClassName}>{load_.data.projects.length}</span></TabsTrigger>
                                    <TabsTrigger value="sessions">Sessions <span className={tabCountClassName}>{sessions.length}</span></TabsTrigger>
                                </TabsList>
                                <TabsContent value="workspaces"><Workspaces rows={load_.data.workspaces} /></TabsContent>
                                <TabsContent value="registries"><Registries projects={load_.data.projects} /></TabsContent>
                                <TabsContent value="sessions"><Sessions projects={load_.data.projects} /></TabsContent>
                            </Tabs></div>

                            {load_.data.warnings.length > 0 ? (
                                <div className={warningCardClassName}><Card>
                                    <CardHeader>
                                        <CardTitle><span className={warningTitleClassName}>
                                            <Icon name="warning" /> {copy.app.warnings}
                                            <span className={warningCountClassName}><Badge variant="outline">{load_.data.warnings.length}</Badge></span>
                                        </span></CardTitle>
                                        <CardDescription>The two lists should normally agree, but they can diverge.</CardDescription>
                                    </CardHeader>
                                    <CardContent><div className={warningRowsClassName}>
                                        {load_.data.warnings.map((w, i) => (
                                            <div key={w} className={warningRowClassName}>
                                                {i > 0 ? <Separator /> : null}
                                                <span className={warningTextClassName}>{w}</span>
                                            </div>
                                        ))}
                                    </div></CardContent>
                                </Card></div>
                            ) : null}

                            <footer className={sourceFooterClassName}>Source: {load_.data.source}</footer>
                        </>
                    )}
                </main>
            </div>
        </TooltipProvider>
    )
}

export default App
