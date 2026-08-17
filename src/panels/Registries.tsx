import type {ProjectState} from "@/types"
import {Badge, Card, Cell, Command, Empty, Table} from "@/components/ui/primitives"

export function Registries({projects}: {projects: ProjectState[]}) {
    return (
        <Card title="Registries" fact={`${projects.length} project`}>
            {projects.length === 0 ? (
                <Empty>Chưa project nào có root worktree.</Empty>
            ) : (
                <Table head={["Project", "Roots", "Registry", "Layouts", "Blocks", ""]}>
                    {projects.map((p) => {
                        const r = p.registry
                        const missing = (["registries", "sessions", "cache"] as const).filter((k) => !p.roots[k])
                        return (
                            <tr key={p.project} className="align-top">
                                <Cell>
                                    <div className="font-medium">{p.project}</div>
                                    <div className="text-xs text-ink-muted">{p.root ?? "—"}</div>
                                </Cell>
                                <Cell>
                                    {missing.length === 0 ? (
                                        <Badge tone="ok">cả ba</Badge>
                                    ) : (
                                        <Badge tone="warn">thiếu {missing.join(", ")}</Badge>
                                    )}
                                </Cell>
                                <Cell>
                                    {r ? (
                                        <div className="flex flex-col gap-1">
                                            <Badge tone={r.locked && r.clean && r.ownedHere ? "ok" : "bad"}>
                                                {[r.locked ? "locked" : "unlocked", r.clean ? "clean" : "dirty", r.ownedHere ? "owned here" : "foreign git"].join(" · ")}
                                            </Badge>
                                            <span className="font-mono text-xs text-ink-muted">{r.branch ?? "—"}</span>
                                        </div>
                                    ) : (
                                        <Badge tone="warn">không có</Badge>
                                    )}
                                </Cell>
                                <Cell mono>
                                    {r ? `${r.counts.layoutsQueued} queued · ${r.counts.layoutsApproved} approved · ${r.counts.layoutsRejected} rejected` : "—"}
                                </Cell>
                                <Cell mono>
                                    {r ? `${r.counts.blocksQueued} queued · ${r.counts.blocksApproved} approved · ${r.counts.blocksRejected} rejected` : "—"}
                                </Cell>
                                <Cell>
                                    {r && r.locked && r.clean && r.ownedHere ? null : <Command>{`/starci-init ${p.project}`}</Command>}
                                </Cell>
                            </tr>
                        )
                    })}
                </Table>
            )}
        </Card>
    )
}
