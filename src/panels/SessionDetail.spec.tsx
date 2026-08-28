import {cleanup, render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {afterEach, describe, expect, it} from "vitest"
import type {Round, SessionState} from "@/types"
import {SessionDetail} from "./SessionDetail"

const round = (overrides: Partial<Round> = {}): Round => ({
    number: 1,
    phase: "layout",
    region: "hero",
    prompt: "Choose a direction",
    produced: [{id: "accepted", hash: "123456789012345"}, {id: "other", hash: "987654321098765"}],
    refusal: "Needs review",
    state: "accepted",
    acceptedHash: "123456789012345",
    rejected: [{hash: "rejected-hash", instead: "accepted-hash", reason: "Not enough contrast"}],
    ...overrides,
})

const session = (overrides: Partial<SessionState> = {}): SessionState => ({
    id: "session-1",
    file: "sessions/session-1.json",
    surface: "home",
    phase: "layout",
    rounds: 3,
    acceptedHashes: [],
    queued: [{hash: "waiting-hash", phase: "layout", state: "queued"}, {hash: "ignored-hash", phase: "layout", state: "done"}],
    history: [
        round(),
        round({number: 2, phase: "block", prompt: "", produced: [], refusal: null, state: "pending", acceptedHash: null, rejected: []}),
        round({number: 3, phase: "review", prompt: "Follow up", produced: [{id: "feedback", hash: "feedback-hash"}], refusal: null, state: "feedback", acceptedHash: "different-hash", rejected: []}),
    ],
    ...overrides,
})

describe("SessionDetail", () => {
    afterEach(cleanup)

    it("shows queued work and every history branch through semantic content", async () => {
        const user = userEvent.setup()
        render(<SessionDetail session={session()} project="academy" />)
        await user.click(screen.getByRole("button", {name: "chi tiết"}))

        expect(screen.getByText("Đang chờ thầy duyệt")).toBeInTheDocument()
        expect(screen.getByText("waiting-hash")).toBeInTheDocument()
        expect(screen.queryByText("ignored-hash")).not.toBeInTheDocument()
        expect(screen.getByRole("button", {name: /starci-fe-design-layout home/})).toBeInTheDocument()
        expect(screen.getByText("Needs review")).toBeInTheDocument()
        expect(screen.getByText("Not enough contrast")).toBeInTheDocument()
        expect(screen.getByText("feedback-has…")).toBeInTheDocument()
        expect(screen.getByText("returned-to-owner")).toBeInTheDocument()
        expect(screen.getAllByText("accepted").length).toBeGreaterThan(0)
        expect(screen.getAllByText("pending").length).toBeGreaterThan(0)
        expect(screen.getAllByText("feedback").length).toBeGreaterThan(0)
    })

    it("shows the empty history branch without queued work", async () => {
        const user = userEvent.setup()
        render(<SessionDetail session={session({queued: [], history: [], phase: "review"})} project="academy" />)
        await user.click(screen.getByRole("button", {name: "chi tiết"}))

        expect(screen.getByText("Session chưa có lượt nào được ghi.")).toBeInTheDocument()
        expect(screen.queryByText("Đang chờ thầy duyệt")).not.toBeInTheDocument()
        expect(screen.queryByRole("button", {name: /starci-fe-design-review home/})).not.toBeInTheDocument()
    })
})
