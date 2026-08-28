import type {Workspace} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Path, Verdict, type Tone} from "@/components/verdict"
import {Heading} from "@/components/leaves/Heading"
import {panelCopy} from "@/resources/panelCopy"
const verdictTone: Record<Workspace["verdict"], Tone> = {ok: "ok", stale: "bad", absent: "warn"}
type WorkspacesProps = {rows: Workspace[]}

/** Renders the machine routes and their measured verdicts. */
export const Workspaces = (props: WorkspacesProps) => <Card><CardHeader><CardTitle><Heading level={2} content="Workspaces" /></CardTitle><CardDescription>Where each role's source is read from. A route whose fields are well formed and whose paths no longer resolve is stale, not absent — parsing a route is not verifying it.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Project / role</TableHead><TableHead>Checkout</TableHead><TableHead>Head</TableHead><TableHead>Verdict</TableHead></TableRow></TableHeader><TableBody>{props.rows.length === 0 ? <TableRow><TableCell colSpan={4}>{panelCopy.noRoute}</TableCell></TableRow> : props.rows.map((row) => <TableRow key={`${row.project}/${row.role}`}><TableCell><div>{row.project}</div><div>{row.role}</div></TableCell><TableCell><Path>{row.diskPath}</Path>{row.diskPath && !row.diskPathExists ? <div>{panelCopy.missingDisk}</div> : null}</TableCell><TableCell><Path>{row.recordedHead}</Path>{row.liveHead && row.liveHead !== row.recordedHead ? <div>live {row.liveHead}</div> : <div>{row.branch}</div>}</TableCell><TableCell><div><Verdict tone={verdictTone[row.verdict]}>{row.verdict}</Verdict><p>{row.reason}</p>{row.verdict === "ok" ? null : <CopyCommand command={`/starci-init ${row.project} ${row.role}`} />}</div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
