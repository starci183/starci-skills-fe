import {cleanup, render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {afterEach, describe, expect, it} from "vitest"
import sample from "../public/state.sample.json"
import type {ProjectState, Workspace} from "./types"
import {Registries} from "./panels/Registries"
import {Sessions} from "./panels/Sessions"
import {Workspaces} from "./panels/Workspaces"

const state = sample as unknown as {projects: ProjectState[]; workspaces: Workspace[]}
afterEach(cleanup)
const richProjects: ProjectState[] = state.projects.map((project) => ({
    ...project,
    registry: project.registry ? {
        ...project.registry,
        entries: [
            {kind: "layouts", state: "queued", file: "layout.json", hash: "abc", surface: "home", members: 2, bytes: 1024, changedAt: "2026-08-18T00:00:00.000Z"},
            {kind: "blocks", state: "approved", file: "block.json", hash: null, surface: null, members: null, bytes: 2048, changedAt: "2026-08-18T00:00:00.000Z"},
        ],
        maps: [{kind: "layouts", file: "map.json", content: {home: "abc"}}],
        decisions: ["accepted abc"],
        rejections: ["rejected def"],
    } : null,
    sessions: project.sessions.map((session) => ({
        ...session,
        history: [{number: 1, phase: "layout", region: "hero", prompt: "Choose a direction", produced: [{id: "candidate", hash: "abc"}], refusal: "Needs review", state: "feedback", acceptedHash: null, rejected: [{hash: "def", instead: "abc", reason: "Not enough contrast"}]}],
    })),
}))

describe("console panels", () => {
    it("renders workspace verdicts and empty state", () => {
        const {rerender} = render(<Workspaces rows={state.workspaces} />)
        expect(screen.getByText("Workspaces")).toBeInTheDocument()
        expect(screen.getAllByText(/stale|ok/i).length).toBeGreaterThan(0)
        rerender(<Workspaces rows={[]} />)
        expect(screen.getByText((content) => content.includes("Chưa có route nào"))).toBeInTheDocument()
    })

    it("shows missing checkout, live head drift, and the repair command", () => {
        const rows: Workspace[] = [{
            project: "academy",
            role: "fe",
            route: "routes/fe.json",
            diskPath: "D:/missing",
            diskPathExists: false,
            branch: "main",
            recordedHead: "abc123",
            liveHead: "def456",
            verdict: "stale",
            reason: "checkout is missing",
        }]
        render(<Workspaces rows={rows} />)
        expect(screen.getByText("không còn trên đĩa")).toBeInTheDocument()
        expect(screen.getByText("live def456")).toBeInTheDocument()
        expect(screen.getByText("/starci-init academy fe")).toBeInTheDocument()
    })

    it("renders every workspace state with semantic status and fallback values", () => {
        const rows: Workspace[] = [
            {
                project: "present", role: "fe", route: "routes/present.json", diskPath: "D:/present",
                diskPathExists: true, branch: "main", recordedHead: "same", liveHead: "same",
                verdict: "ok", reason: "healthy checkout",
            },
            {
                project: "missing", role: "be", route: "routes/missing.json", diskPath: null,
                diskPathExists: false, branch: null, recordedHead: null, liveHead: null,
                verdict: "absent", reason: "route is absent",
            },
            {
                project: "drift", role: "fe", route: "routes/drift.json", diskPath: "D:/drift",
                diskPathExists: false, branch: "feature/registry", recordedHead: "old", liveHead: "new",
                verdict: "stale", reason: "checkout drifted",
            },
        ]

        render(<Workspaces rows={rows} />)
        expect(screen.getByText("present")).toBeInTheDocument()
        expect(screen.getByText("same")).toBeInTheDocument()
        expect(screen.getByText("missing")).toBeInTheDocument()
        expect(screen.getAllByText("—")).toHaveLength(2)
        expect(screen.getByText("drift")).toBeInTheDocument()
        expect(screen.getByText("live new")).toBeInTheDocument()
        expect(screen.queryByText("feature/registry")).not.toBeInTheDocument()
        expect(screen.getAllByText("/starci-init missing be")).toHaveLength(1)
        expect(screen.getAllByText("/starci-init drift fe")).toHaveLength(1)
        expect(screen.queryByText("/starci-init present fe")).not.toBeInTheDocument()
    })

    it("opens registry details and handles legacy snapshots without optional arrays", async () => {
        const user = userEvent.setup()
        render(<Registries projects={richProjects} />)
        await user.click(screen.getByRole("button", {name: "chi tiết"}))
        expect(screen.getByText("Registry worktree")).toBeInTheDocument()
        expect(screen.getByText("layouts")).toBeInTheDocument()
        expect(screen.getByText(/1 decision/)).toBeInTheDocument()
    })

    it("opens session details and shows queued work plus empty history", async () => {
        const user = userEvent.setup()
        render(<Sessions projects={richProjects} />)
        await user.click(screen.getByRole("button", {name: "chi tiết"}))
        expect(screen.getByText("Lịch sử")).toBeInTheDocument()
        expect(screen.getByText("Choose a direction")).toBeInTheDocument()
        expect(screen.getByText(/Đang chờ thầy duyệt/)).toBeInTheDocument()
    })

    it("renders rejected registry entries and append-only session evidence", async () => {
        const user = userEvent.setup()
        const project = richProjects.find((item) => item.registry && item.sessions.length > 0)
        expect(project).toBeDefined()
        render(<Registries projects={project ? [project] : []} />)
        const details = screen.getAllByRole("button", {name: "chi tiết"})
        await user.click(details[details.length - 1])
        expect(screen.getAllByText("rejected def").length).toBeGreaterThan(0)
    })

    it("covers registry health, count states, optional fields, and populated maps", async () => {
        const user = userEvent.setup()
        const seed = richProjects.find((item) => item.registry !== null)
        expect(seed).toBeDefined()
        const project = seed as ProjectState
        const empty = {...project, project: "empty", roots: {registries: true, sessions: true, cache: true}, registry: null}
        const sparse = {
            ...project,
            project: "sparse",
            roots: {registries: false, sessions: true, cache: false},
            registry: {
                ...project.registry!,
                locked: false,
                clean: false,
                ownedHere: false,
                branch: null,
                head: null,
                entries: [],
                maps: [],
                decisions: [],
                rejections: [],
                counts: {layoutsQueued: 0, layoutsApproved: 0, layoutsRejected: 0, blocksQueued: 0, blocksApproved: 0, blocksRejected: 0},
            },
        }
        render(<Registries projects={[empty, sparse]} />)
        expect(screen.getByText("cả ba")).toBeInTheDocument()
        expect(screen.getByText(/thiếu/)).toBeInTheDocument()
        expect(screen.getByText("không có")).toBeInTheDocument()
        const details = screen.getAllByRole("button", {name: "chi tiết"})
        await user.click(details[details.length - 1])
        expect(screen.getByText("locked")).toBeInTheDocument()
        expect(screen.getByText("No recorded layouts.")).toBeInTheDocument()
        expect(screen.getByText("No registry index.")).toBeInTheDocument()
        expect(screen.getByText("No records.")).toBeInTheDocument()
    })

    it("renders populated layout and block entries with every optional value", async () => {
        const user = userEvent.setup()
        const seed = richProjects.find((item) => item.registry !== null) as ProjectState
        const populated: ProjectState = {
            ...seed,
            project: "populated",
            registry: {
                ...seed.registry!,
                locked: true,
                clean: true,
                ownedHere: true,
                branch: "feature/registry",
                head: "head-123",
                entries: [
                    {kind: "layouts", state: "queued", file: "layout.json", hash: "hash-layout", surface: "home", members: 3, bytes: 2048, changedAt: "2026-08-18T00:00:00.000Z"},
                    {kind: "blocks", state: "approved", file: "block.json", hash: null, surface: null, members: null, bytes: 1024, changedAt: "2026-08-18T00:00:00.000Z"},
                ],
                maps: [{kind: "layouts", file: "map.json", content: {home: "hash-layout"}}],
                decisions: ["accepted hash-layout"],
                rejections: ["rejected hash-block"],
            },
        }
        render(<Registries projects={[populated]} />)
        const details = screen.getAllByRole("button", {name: "chi tiết"})
        await user.click(details[details.length - 1])
        expect(screen.getByText("layout.json")).toBeInTheDocument()
        expect(screen.getByText("block.json")).toBeInTheDocument()
        expect(screen.getByText("hash-layout")).toBeInTheDocument()
        expect(screen.getByText(/map\.json/)).toBeInTheDocument()
        expect(screen.getByText("3 candidate")).toBeInTheDocument()
        expect(screen.getByText("head-123")).toBeInTheDocument()
        expect(screen.getByText(/1 decision/)).toBeInTheDocument()
        expect(screen.getByText(/1 rejection/)).toBeInTheDocument()
    })

    it("renders approved registry counts", () => {
        const project = richProjects.find((item) => item.registry)
        expect(project?.registry).toBeDefined()
        if (!project?.registry) return

        render(<Registries projects={[{
            ...project,
            registry: {
                ...project.registry,
                counts: {
                    ...project.registry.counts,
                    layoutsApproved: 1,
                    layoutsQueued: 0,
                },
            },
        }]} />)

        expect(screen.getByText("1 approved")).toBeVisible()
    })

    it("renders empty registries and sessions", () => {
        const {rerender} = render(<Registries projects={[]} />)
        expect(screen.getByText(/Chưa project nào/)).toBeInTheDocument()
        rerender(<Sessions projects={[]} />)
        expect(screen.getByText(/Chưa session nào/)).toBeInTheDocument()
    })
})
