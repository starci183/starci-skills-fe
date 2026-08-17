import type {ProjectState, RegistryEntry} from "@/types"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Verdict} from "@/components/verdict"

const stateTone = {queued: "warn", approved: "ok", rejected: "bad"} as const

function Entry({entry}: {entry: RegistryEntry}) {
    return (
        <div className="flex flex-col gap-1 rounded-md border bg-card px-3 py-2">
            <div className="flex flex-row items-center justify-between gap-2">
                <span className="font-mono text-xs break-all">{entry.file}</span>
                <Verdict tone={stateTone[entry.state]}>{entry.state}</Verdict>
            </div>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                {entry.surface ? <span>surface {entry.surface}</span> : null}
                {entry.members !== null ? <span>{entry.members} candidate</span> : null}
                <span>{(entry.bytes / 1024).toFixed(1)} KB</span>
                <span>{entry.changedAt.replace("T", " ").slice(0, 19)}</span>
            </div>
            {entry.hash ? <span className="font-mono text-xs text-muted-foreground break-all">{entry.hash}</span> : null}
        </div>
    )
}

function Section({title, fact, children}: {title: string; fact?: string; children: React.ReactNode}) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex flex-row items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold">{title}</h3>
                {fact ? <span className="text-xs text-muted-foreground">{fact}</span> : null}
            </div>
            {children}
        </section>
    )
}

/**
 * One registry, opened.
 *
 * The empty states are written out rather than hidden: a registry with nothing in it is a real answer —
 * no decision has been recorded for this project yet — and collapsing that into a blank panel would read
 * as the console failing rather than the project being new.
 */
export function RegistryDetail({project}: {project: ProjectState}) {
    const r = project.registry
    const kinds = ["layouts", "blocks"] as const

    return (
        <Sheet>
            <SheetTrigger render={<Button variant="outline" size="sm" className="h-7 text-xs" />}>chi tiết</SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>{project.project}</SheetTitle>
                    <SheetDescription className="font-mono text-xs break-all">{project.root}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] px-4">
                    <div className="flex flex-col gap-6 pb-8">
                        <Section title="Roots">
                            <div className="flex flex-wrap gap-2">
                                {(["registries", "sessions", "cache"] as const).map((k) => (
                                    <Verdict key={k} tone={project.roots[k] ? "ok" : "warn"}>{k}</Verdict>
                                ))}
                            </div>
                        </Section>

                        <Separator />

                        {r ? (
                            <>
                                <Section title="Registry worktree">
                                    <div className="flex flex-col gap-1.5 text-xs">
                                        <div className="flex flex-wrap gap-2">
                                            <Verdict tone={r.locked ? "ok" : "bad"}>{r.locked ? "locked" : "unlocked"}</Verdict>
                                            <Verdict tone={r.clean ? "ok" : "bad"}>{r.clean ? "clean" : "dirty"}</Verdict>
                                            <Verdict tone={r.ownedHere ? "ok" : "bad"}>{r.ownedHere ? "owned here" : "foreign git"}</Verdict>
                                        </div>
                                        <span className="font-mono text-muted-foreground break-all">{r.branch ?? "—"}</span>
                                        <span className="font-mono text-muted-foreground">{r.head ?? "—"}</span>
                                        {r.lastCommit ? <span className="text-muted-foreground">{r.lastCommit}</span> : null}
                                    </div>
                                </Section>

                                {kinds.map((kind) => {
                                    const rows = r.entries.filter((e) => e.kind === kind)
                                    return (
                                        <Section key={kind} title={kind} fact={`${rows.length} artifact`}>
                                            {rows.length === 0 ? (
                                                <p className="text-xs text-muted-foreground">
                                                    Chưa có {kind === "layouts" ? "phương án layout" : "giải phẫu khối"} nào được ghi. Layout là skill mở
                                                    session và ghi vào đây.
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-2">{rows.map((e) => <Entry key={`${e.kind}/${e.state}/${e.file}`} entry={e} />)}</div>
                                            )}
                                        </Section>
                                    )
                                })}

                                <Section title="Map" fact={`${r.maps.length} file`}>
                                    {r.maps.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">Registry chưa có index nào.</p>
                                    ) : (
                                        r.maps.map((m) => (
                                            <div key={`${m.kind}/${m.file}`} className="flex flex-col gap-1">
                                                <span className="font-mono text-xs text-muted-foreground">{m.kind}/map/{m.file}</span>
                                                <pre className="overflow-x-auto rounded-md border bg-card p-3 font-mono text-xs">{JSON.stringify(m.content, null, 2)}</pre>
                                            </div>
                                        ))
                                    )}
                                </Section>

                                <Section title="Decisions & rejections">
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <Badge variant="outline">{r.decisions.length} decision</Badge>
                                        <Badge variant="outline">{r.rejections.length} rejection</Badge>
                                    </div>
                                    {r.decisions.length + r.rejections.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">
                                            Chưa có bản ghi nào. Một lần từ chối phải ghi lời của người chủ, nên chỗ này rỗng có nghĩa là chưa ai từ
                                            chối gì — không phải là đã mất.
                                        </p>
                                    ) : (
                                        <ul className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
                                            {[...r.decisions, ...r.rejections].map((f) => <li key={f}>{f}</li>)}
                                        </ul>
                                    )}
                                </Section>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Project này chưa có registry — không có chỗ nào cho một quyết định sống sót, nên chưa hash nào neo được.
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
