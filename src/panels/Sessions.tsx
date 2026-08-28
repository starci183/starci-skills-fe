import type {ProjectState} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Verdict} from "@/components/verdict"
import {SessionDetail} from "@/panels/SessionDetail"
import {Heading} from "@/components/leaves/Heading"
import {panelCopy} from "@/resources/panelCopy"

const short = (hash: string) => `${hash.slice(0, 12)}…`
type SessionsProps = {projects: ProjectState[]}

/** Renders active design sessions and queued decisions. */
export const Sessions = (props: SessionsProps) => {
    const rows = props.projects.flatMap((p) => p.sessions.map((s) => ({project: p.project, ...s})))
    return <Card><CardHeader><CardTitle><Heading level={2} content="Sessions" /></CardTitle><CardDescription>One session per surface, and acceptance binds to a hash. Feedback opens a new round; an accepted round is never edited in place.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Surface</TableHead><TableHead>Phase</TableHead><TableHead>Rounds</TableHead><TableHead>{panelCopy.accepted}</TableHead><TableHead>{panelCopy.pending}</TableHead><TableHead /></TableRow></TableHeader><TableBody>
        {rows.length === 0 ? <TableRow><TableCell colSpan={6}>{panelCopy.noSessions}</TableCell></TableRow> : rows.map((s) => { const queued = s.queued.filter((q) => q.state === "queued"); return <TableRow key={`${s.project}/${s.id}`}><TableCell><div>{s.surface}</div><div>{s.project}</div></TableCell><TableCell><Verdict tone={s.phase === "complete" ? "ok" : "idle"}>{s.phase}</Verdict></TableCell><TableCell>{s.rounds}</TableCell><TableCell>{s.acceptedHashes.length === 0 ? <span>—</span> : s.acceptedHashes.map((h) => <div key={h}>{short(h)}</div>)}</TableCell><TableCell>{queued.length === 0 ? <span>—</span> : queued.map((q) => <div key={q.hash}>{short(q.hash)} <span>{q.phase}</span></div>)}</TableCell><TableCell><div><SessionDetail session={s} project={s.project} />{s.phase === "layout" || s.phase === "block" ? <CopyCommand command={`/starci-fe-design-${s.phase} ${s.surface}`} /> : null}</div></TableCell></TableRow>})}
    </TableBody></Table></CardContent></Card>
}
