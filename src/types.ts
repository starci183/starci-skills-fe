/**
 * The shape `.claude/scripts/export-console-state.mjs` writes. The console renders this and nothing
 * else: it never scans a disk itself, so what it shows is always a snapshot somebody took, stamped
 * with when.
 */
export interface ConsoleState {
    scannedAt: string
    source: string
    workspaces: Workspace[]
    projects: ProjectState[]
    warnings: string[]
}

export interface Workspace {
    project: string
    role: string
    route: string
    diskPath: string | null
    diskPathExists: boolean
    contract: string | null
    contractExists: boolean
    contractSource: string | null
    branch: string | null
    recordedHead: string | null
    liveHead: string | null
    /** `ok` · `stale` when a recorded path or head no longer holds · `absent` when the route is missing */
    verdict: "ok" | "stale" | "absent"
    reason: string
}

export interface ProjectState {
    project: string
    root: string | null
    roots: {registries: boolean; sessions: boolean; cache: boolean}
    registry: RegistryState | null
    sessions: SessionState[]
}

export interface RegistryState {
    branch: string | null
    locked: boolean
    clean: boolean
    ownedHere: boolean
    counts: {layoutsQueued: number; layoutsApproved: number; layoutsRejected: number; blocksQueued: number; blocksApproved: number; blocksRejected: number}
}

export interface SessionState {
    id: string
    surface: string
    phase: string
    rounds: number
    acceptedHashes: string[]
    queued: {hash: string; phase: string; state: string}[]
}
