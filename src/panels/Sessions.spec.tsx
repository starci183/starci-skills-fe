import {cleanup, render, screen} from "@testing-library/react"
import {afterEach, describe, expect, it} from "vitest"
import type {ProjectState, SessionState} from "@/types"
import {Sessions} from "./Sessions"

const makeSession = (overrides: Partial<SessionState> = {}): SessionState => ({
    id: "session-1",
    file: "sessions/session-1.json",
    surface: "home",
    phase: "review",
    rounds: 1,
    acceptedHashes: [],
    queued: [],
    history: [],
    ...overrides,
})

const project = (sessions: SessionState[]): ProjectState => ({
    project: "academy",
    root: null,
    roots: {registries: false, sessions: true, cache: false},
    registry: null,
    sessions,
})

describe("Sessions", () => {
    afterEach(cleanup)

    it("renders phase verdicts, accepted hashes, filtered queue, and phase commands", () => {
        render(<Sessions projects={[project([
            makeSession({id: "complete", surface: "complete", phase: "complete", acceptedHashes: [], queued: [{hash: "ignored", phase: "layout", state: "done"}]}),
            makeSession({id: "layout", surface: "layout", phase: "layout", acceptedHashes: ["12345678901234567890"], queued: [{hash: "queued-layout", phase: "layout", state: "queued"}, {hash: "ignored-layout", phase: "layout", state: "done"}]}),
            makeSession({id: "block", surface: "block", phase: "block", queued: [{hash: "queued-block", phase: "block", state: "queued"}]}),
            makeSession({id: "other", surface: "other", phase: "review"}),
        ])]} />)

        expect(screen.getByText("123456789012…")).toBeInTheDocument()
        expect(screen.getByText("queued-layou…")).toBeInTheDocument()
        expect(screen.getByText("queued-block…")).toBeInTheDocument()
        expect(screen.queryByText("ignored-layou…")).not.toBeInTheDocument()
        expect(screen.getByRole("button", {name: /starci-fe-design-layout layout/})).toBeInTheDocument()
        expect(screen.getByRole("button", {name: /starci-fe-design-block block/})).toBeInTheDocument()
        expect(screen.queryByRole("button", {name: /starci-fe-design-complete complete/})).not.toBeInTheDocument()
        expect(screen.queryByRole("button", {name: /starci-fe-design-review other/})).not.toBeInTheDocument()
    })

    it("renders the empty state when there are no sessions", () => {
        render(<Sessions projects={[]} />)
        expect(screen.getByText(/Chưa session nào/)).toBeInTheDocument()
    })
})
