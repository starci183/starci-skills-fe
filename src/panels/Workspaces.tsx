import type {Workspace} from "@/types"
import {Badge, Card, Cell, Command, Empty, Table} from "@/components/ui/primitives"

const verdictTone = {ok: "ok", stale: "bad", absent: "warn"} as const

export function Workspaces({rows}: {rows: Workspace[]}) {
    const stale = rows.filter((r) => r.verdict !== "ok").length

    return (
        <Card title="Workspaces" fact={`${rows.length} route · ${stale} cần xử`}>
            {rows.length === 0 ? (
                <Empty>Chưa có route nào. Khai project rồi chạy /starci-init.</Empty>
            ) : (
                <Table head={["Project / role", "Checkout", "Contract", "Head", "Verdict", ""]}>
                    {rows.map((r) => (
                        <tr key={`${r.project}/${r.role}`} className="align-top">
                            <Cell>
                                <div className="font-medium">{r.project}</div>
                                <div className="text-xs text-ink-muted">{r.role}</div>
                            </Cell>
                            <Cell mono>
                                {r.diskPath ?? "—"}
                                {r.diskPath && !r.diskPathExists ? <div className="text-bad">không còn trên đĩa</div> : null}
                            </Cell>
                            <Cell mono>
                                {r.contract ? (
                                    <span className={r.contractExists ? "" : "text-bad"}>{r.contract}</span>
                                ) : (
                                    <span className="text-warn">null</span>
                                )}
                                {r.contractSource ? <div className="text-ink-muted">{r.contractSource}</div> : null}
                            </Cell>
                            <Cell mono>
                                <div>{r.recordedHead ?? "—"}</div>
                                {r.liveHead && r.liveHead !== r.recordedHead ? (
                                    <div className="text-bad">live {r.liveHead}</div>
                                ) : (
                                    <div className="text-ink-muted">{r.branch ?? ""}</div>
                                )}
                            </Cell>
                            <Cell>
                                <Badge tone={verdictTone[r.verdict]}>{r.verdict}</Badge>
                                <div className="mt-1 max-w-72 text-xs text-ink-muted">{r.reason}</div>
                            </Cell>
                            <Cell>
                                {r.verdict === "ok" ? null : <Command>{`/starci-init ${r.project} ${r.role}`}</Command>}
                            </Cell>
                        </tr>
                    ))}
                </Table>
            )}
        </Card>
    )
}
