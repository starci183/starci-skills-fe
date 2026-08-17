import type {Round, SessionState} from "@/types"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {CopyCommand, Verdict} from "@/components/verdict"

const roundTone = {accepted: "ok", feedback: "warn", pending: "idle"} as const

function RoundCard({round}: {round: Round}) {
    return (
        <div className="flex flex-col gap-2 rounded-md border bg-card p-3">
            <div className="flex flex-row items-center justify-between gap-2">
                <span className="text-sm font-semibold">
                    Lượt {round.number} <span className="font-normal text-muted-foreground">{round.phase}{round.region ? ` · ${round.region}` : ""}</span>
                </span>
                <Verdict tone={roundTone[round.state]}>{round.state}</Verdict>
            </div>

            {round.prompt ? <p className="text-xs leading-relaxed text-muted-foreground">{round.prompt}</p> : null}

            {round.produced.length > 0 ? (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium">Đã sinh</span>
                    {round.produced.map((p) => (
                        <div key={p.hash} className="flex flex-row items-baseline gap-2 font-mono text-xs">
                            <span className={p.hash === round.acceptedHash ? "text-emerald-400" : "text-muted-foreground"}>{p.hash.slice(0, 12)}…</span>
                            <span className="text-muted-foreground">{p.id}</span>
                            {p.hash === round.acceptedHash ? <span className="text-emerald-400">accepted</span> : null}
                        </div>
                    ))}
                </div>
            ) : null}

            {round.refusal ? (
                <div className="flex flex-col gap-1 rounded-md border border-amber-500/25 bg-amber-500/5 p-2">
                    <span className="text-xs font-medium text-amber-400">returned-to-owner</span>
                    <span className="text-xs text-muted-foreground">{round.refusal}</span>
                </div>
            ) : null}

            {round.rejected.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Bị từ chối</span>
                    {round.rejected.map((r) => (
                        <div key={r.hash} className="flex flex-col gap-0.5 border-l-2 border-red-500/40 pl-2">
                            <span className="font-mono text-xs text-red-400">{r.hash.slice(0, 12)}…{r.instead ? ` → ${r.instead}` : ""}</span>
                            {/* The owner's words, verbatim. A reason rewritten is a reason lost. */}
                            <span className="text-xs text-muted-foreground italic">“{r.reason}”</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export function SessionDetail({session, project}: {session: SessionState; project: string}) {
    const queued = session.queued.filter((q) => q.state === "queued")

    return (
        <Sheet>
            <SheetTrigger render={<Button variant="outline" size="sm" className="h-7 text-xs" />}>chi tiết</SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>{session.surface}</SheetTitle>
                    <SheetDescription className="flex flex-col gap-0.5">
                        <span>{project} · phase {session.phase} · {session.rounds} lượt</span>
                        <span className="font-mono text-xs break-all">{session.file}</span>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] px-4">
                    <div className="flex flex-col gap-4 pb-8">
                        {queued.length > 0 ? (
                            <>
                                <section className="flex flex-col gap-2">
                                    <h3 className="text-sm font-semibold">Đang chờ thầy duyệt</h3>
                                    {queued.map((q) => (
                                        <div key={q.hash} className="flex flex-col gap-1 rounded-md border border-amber-500/25 bg-amber-500/5 p-2">
                                            <span className="font-mono text-xs text-amber-400 break-all">{q.hash}</span>
                                            <span className="text-xs text-muted-foreground">{q.phase}</span>
                                        </div>
                                    ))}
                                    <CopyCommand command={`/starci-fe-design-${session.phase} ${session.surface}`} />
                                </section>
                                <Separator />
                            </>
                        ) : null}

                        <section className="flex flex-col gap-2">
                            <div className="flex flex-row items-baseline justify-between">
                                <h3 className="text-sm font-semibold">Lịch sử</h3>
                                <span className="text-xs text-muted-foreground">chỉ ghi thêm, không sửa tại chỗ</span>
                            </div>
                            {session.history.length === 0 ? (
                                <p className="text-xs text-muted-foreground">Session chưa có lượt nào được ghi.</p>
                            ) : (
                                session.history.map((round) => <RoundCard key={round.number} round={round} />)
                            )}
                        </section>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
