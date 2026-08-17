import type {ProjectState} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Path, Verdict} from "@/components/verdict"
import {RegistryDetail} from "@/panels/RegistryDetail"

function Counts({counts}: {counts: {queued: number; approved: number; rejected: number}}) {
    return (
        <div className="flex flex-col gap-0.5 font-mono text-xs">
            <span className={counts.queued > 0 ? "text-amber-400" : "text-muted-foreground"}>{counts.queued} queued</span>
            <span className={counts.approved > 0 ? "text-emerald-400" : "text-muted-foreground"}>{counts.approved} approved</span>
            <span className="text-muted-foreground">{counts.rejected} rejected</span>
        </div>
    )
}

export function Registries({projects}: {projects: ProjectState[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Registries</CardTitle>
                <CardDescription>
                    Where a decision survives. A registry is a <span className="text-foreground">locked</span> linked worktree on
                    the project's own branch, owned by this Source's git — anything else is not this Source's state.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[16rem]">Project</TableHead>
                            <TableHead className="w-[9rem]">Roots</TableHead>
                            <TableHead>Registry</TableHead>
                            <TableHead className="w-[9rem]">Layouts</TableHead>
                            <TableHead className="w-[9rem]">Blocks</TableHead>
                            <TableHead className="w-[7rem]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-muted-foreground">Chưa project nào có root worktree.</TableCell>
                            </TableRow>
                        ) : (
                            projects.map((p) => {
                                const r = p.registry
                                const missing = (["registries", "sessions", "cache"] as const).filter((k) => !p.roots[k])
                                const sound = Boolean(r && r.locked && r.clean && r.ownedHere)
                                return (
                                    <TableRow key={p.project} className="align-top">
                                        <TableCell>
                                            <div className="font-medium">{p.project}</div>
                                            <Path muted>{p.root}</Path>
                                        </TableCell>
                                        <TableCell>
                                            {missing.length === 0 ? (
                                                <Verdict tone="ok">cả ba</Verdict>
                                            ) : (
                                                <Verdict tone="warn">{`thiếu ${missing.join(", ")}`}</Verdict>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {r ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <Verdict tone={sound ? "ok" : "bad"}>
                                                        {[r.locked ? "locked" : "unlocked", r.clean ? "clean" : "dirty", r.ownedHere ? "owned here" : "foreign git"].join(" · ")}
                                                    </Verdict>
                                                    <Path muted>{r.branch}</Path>
                                                </div>
                                            ) : (
                                                <Verdict tone="warn">không có</Verdict>
                                            )}
                                            {sound ? null : (
                                                <div className="mt-1.5">
                                                    <CopyCommand command={`/starci-init ${p.project}`} />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {r ? <Counts counts={{queued: r.counts.layoutsQueued, approved: r.counts.layoutsApproved, rejected: r.counts.layoutsRejected}} /> : <Path>{null}</Path>}
                                        </TableCell>
                                        <TableCell>
                                            {r ? <Counts counts={{queued: r.counts.blocksQueued, approved: r.counts.blocksApproved, rejected: r.counts.blocksRejected}} /> : <Path>{null}</Path>}
                                        </TableCell>
                                        <TableCell>
                                            <RegistryDetail project={p} />
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
