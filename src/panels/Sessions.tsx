import type {ProjectState} from "@/types"
import {Badge, Card, Cell, Command, Empty, Table} from "@/components/ui/primitives"

export function Sessions({projects}: {projects: ProjectState[]}) {
    const rows = projects.flatMap((p) => p.sessions.map((s) => ({project: p.project, ...s})))
    const waiting = rows.reduce((n, s) => n + s.queued.filter((q) => q.state === "queued").length, 0)

    return (
        <Card title="Sessions" fact={`${rows.length} session · ${waiting} hash đang chờ duyệt`}>
            {rows.length === 0 ? (
                <Empty>Chưa session nào được mở. Layout là skill mở session, không phải orchestrator.</Empty>
            ) : (
                <Table head={["Surface", "Phase", "Rounds", "Đã chấp nhận", "Đang chờ", ""]}>
                    {rows.map((s) => (
                        <tr key={`${s.project}/${s.id}`} className="align-top">
                            <Cell>
                                <div className="font-medium">{s.surface}</div>
                                <div className="text-xs text-ink-muted">{s.project}</div>
                            </Cell>
                            <Cell><Badge tone={s.phase === "complete" ? "ok" : "muted"}>{s.phase}</Badge></Cell>
                            <Cell mono>{s.rounds}</Cell>
                            <Cell mono>
                                {s.acceptedHashes.length === 0 ? <span className="text-ink-muted">—</span> : s.acceptedHashes.map((h) => <div key={h}>{h.slice(0, 12)}…</div>)}
                            </Cell>
                            <Cell mono>
                                {s.queued.filter((q) => q.state === "queued").map((q) => (
                                    <div key={q.hash}>
                                        {q.hash.slice(0, 12)}… <span className="text-ink-muted">{q.phase}</span>
                                    </div>
                                ))}
                                {s.queued.every((q) => q.state !== "queued") ? <span className="text-ink-muted">—</span> : null}
                            </Cell>
                            <Cell>
                                {s.phase === "layout" ? <Command>{`/starci-fe-design-layout ${s.surface}`}</Command> : null}
                                {s.phase === "block" ? <Command>{`/starci-fe-design-block ${s.surface}`}</Command> : null}
                            </Cell>
                        </tr>
                    ))}
                </Table>
            )}
        </Card>
    )
}
