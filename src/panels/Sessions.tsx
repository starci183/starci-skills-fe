import type {ProjectState} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Verdict} from "@/components/verdict"
import {SessionDetail} from "@/panels/SessionDetail"

const short = (hash: string) => `${hash.slice(0, 12)}…`

export function Sessions({projects}: {projects: ProjectState[]}) {
    const rows = projects.flatMap((p) => p.sessions.map((s) => ({project: p.project, ...s})))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions</CardTitle>
                <CardDescription>
                    One session per surface, and acceptance binds to a hash. Feedback opens a new round; an accepted round is
                    never edited in place.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[16rem]">Surface</TableHead>
                            <TableHead className="w-[8rem]">Phase</TableHead>
                            <TableHead className="w-[6rem]">Rounds</TableHead>
                            <TableHead>Đã chấp nhận</TableHead>
                            <TableHead>Đang chờ duyệt</TableHead>
                            <TableHead className="w-[17rem]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-muted-foreground">
                                    Chưa session nào được mở. Layout là skill mở session — không có orchestrator.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((s) => {
                                const queued = s.queued.filter((q) => q.state === "queued")
                                return (
                                    <TableRow key={`${s.project}/${s.id}`} className="align-top">
                                        <TableCell>
                                            <div className="font-medium">{s.surface}</div>
                                            <div className="text-xs text-muted-foreground">{s.project}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Verdict tone={s.phase === "complete" ? "ok" : "idle"}>{s.phase}</Verdict>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{s.rounds}</TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {s.acceptedHashes.length === 0 ? (
                                                <span className="text-muted-foreground">—</span>
                                            ) : (
                                                s.acceptedHashes.map((h) => <div key={h} className="text-emerald-400">{short(h)}</div>)
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {queued.length === 0 ? (
                                                <span className="text-muted-foreground">—</span>
                                            ) : (
                                                queued.map((q) => (
                                                    <div key={q.hash} className="text-amber-400">
                                                        {short(q.hash)} <span className="text-muted-foreground">{q.phase}</span>
                                                    </div>
                                                ))
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-start gap-1.5">
                                                <SessionDetail session={s} project={s.project} />
                                                {s.phase === "layout" || s.phase === "block" ? (
                                                    <CopyCommand command={`/starci-fe-design-${s.phase} ${s.surface}`} />
                                                ) : null}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
