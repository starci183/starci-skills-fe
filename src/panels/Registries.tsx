import type {ProjectState} from "@/types"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {CopyCommand, Path, Verdict} from "@/components/verdict"
import {RegistryDetail} from "@/panels/RegistryDetail"
import {Heading} from "@/components/leaves/Heading"
import {panelAmberTextClassName, panelForegroundClassName, panelGreenTextClassName, panelMutedTextClassName, panelStackTightClassName} from "@/panels/classNames"
import {panelCopy} from "@/resources/panelCopy"

type RegistryCounts = {queued: number; approved: number; rejected: number}
type CountsProps = {counts: RegistryCounts}
type RegistriesProps = {projects: ProjectState[]}

const Counts = (props: CountsProps) => {
    return (
        <div className={panelStackTightClassName}>
            <span className={props.counts.queued > 0 ? panelAmberTextClassName : panelMutedTextClassName}>{props.counts.queued} queued</span>
            <span className={props.counts.approved > 0 ? panelGreenTextClassName : panelMutedTextClassName}>{props.counts.approved} approved</span>
            <span className={panelMutedTextClassName}>{props.counts.rejected} rejected</span>
        </div>
    )
}

/** Renders project registry health and read-only detail access. */
export const Registries = (props: RegistriesProps) => {
    return (
        <Card>
            <CardHeader>
                            <CardTitle><Heading level={2} content="Registries" /></CardTitle>
                <CardDescription>
                    Where a decision survives. A registry is a <span className={panelForegroundClassName}>locked</span> linked worktree on
                    the project's own branch, owned by this Source's git — anything else is not this Source's state.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Roots</TableHead>
                            <TableHead>Registry</TableHead>
                            <TableHead>Layouts</TableHead>
                            <TableHead>Blocks</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>{panelCopy.noProjectRoots}</TableCell>
                            </TableRow>
                        ) : (
                            props.projects.map((p) => {
                                const r = p.registry
                                const missing = (["registries", "sessions", "cache"] as const).filter((k) => !p.roots[k])
                                const sound = Boolean(r && r.locked && r.clean && r.ownedHere)
                                return (
                                    <TableRow key={p.project}>
                                        <TableCell>
                                            <div>{p.project}</div>
                                            <Path muted>{p.root}</Path>
                                        </TableCell>
                                        <TableCell>
                                            {missing.length === 0 ? (
                                                <Verdict tone="ok">{panelCopy.allRoots}</Verdict>
                                            ) : (
                                                <Verdict tone="warn">{`${panelCopy.missingRoots} ${missing.join(", ")}`}</Verdict>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {r ? (
                                                <div>
                                                    <Verdict tone={sound ? "ok" : "bad"}>
                                                        {[r.locked ? "locked" : "unlocked", r.clean ? "clean" : "dirty", r.ownedHere ? "owned here" : "foreign git"].join(" · ")}
                                                    </Verdict>
                                                    <Path muted>{r.branch}</Path>
                                                </div>
                                            ) : (
                                                <Verdict tone="warn">{panelCopy.noRegistry}</Verdict>
                                            )}
                                            {sound ? null : (
                                                <div>
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
