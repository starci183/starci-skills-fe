import type {Workspace} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Path, Verdict, type Tone} from "@/components/verdict"

const verdictTone: Record<Workspace["verdict"], Tone> = {ok: "ok", stale: "bad", absent: "warn"}

export function Workspaces({rows}: {rows: Workspace[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Workspaces</CardTitle>
                <CardDescription>
                    Where each role's source is read from. A route whose fields are well formed and whose paths no longer
                    resolve is <span className="text-foreground">stale</span>, not absent — parsing a route is not verifying it.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[14rem]">Project / role</TableHead>
                            <TableHead>Checkout</TableHead>
                            <TableHead>Contract</TableHead>
                            <TableHead className="w-[10rem]">Head</TableHead>
                            <TableHead className="w-[22rem]">Verdict</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-muted-foreground">
                                    Chưa có route nào. Khai project rồi chạy <span className="font-mono text-xs">/starci-init</span>.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((r) => (
                                <TableRow key={`${r.project}/${r.role}`} className="align-top">
                                    <TableCell>
                                        <div className="font-medium">{r.project}</div>
                                        <div className="text-xs text-muted-foreground">{r.role}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Path>{r.diskPath}</Path>
                                        {r.diskPath && !r.diskPathExists ? <div className="text-xs text-red-400">không còn trên đĩa</div> : null}
                                    </TableCell>
                                    <TableCell>
                                        {r.contract ? (
                                            <>
                                                <Path muted={!r.contractExists}>{r.contract}</Path>
                                                <div className="text-xs text-muted-foreground">{r.contractSource}</div>
                                            </>
                                        ) : (
                                            <span className="text-xs text-amber-400">null</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Path>{r.recordedHead}</Path>
                                        {r.liveHead && r.liveHead !== r.recordedHead ? (
                                            <div className="font-mono text-xs text-red-400">live {r.liveHead}</div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground">{r.branch}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1.5">
                                            <Verdict tone={verdictTone[r.verdict]}>{r.verdict}</Verdict>
                                            <p className="text-xs leading-relaxed text-muted-foreground">{r.reason}</p>
                                            {r.verdict === "ok" ? null : <CopyCommand command={`/starci-init ${r.project} ${r.role}`} />}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
