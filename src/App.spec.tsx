import {cleanup, render, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import App from "./App"
import sample from "../public/state.sample.json"
import type {ConsoleState} from "./types"

vi.mock("@/panels/Workspaces", () => ({Workspaces: () => <div>Workspaces panel</div>}))
vi.mock("@/panels/Registries", () => ({Registries: () => <div>Registries panel</div>}))
vi.mock("@/panels/Sessions", () => ({Sessions: () => <div>Sessions panel</div>}))

const response = (body: unknown, ok = true) => ({ok, json: async () => body})

describe("console application", () => {
    afterEach(cleanup)

    beforeEach(() => {
        vi.restoreAllMocks()
        vi.stubGlobal("fetch", vi.fn(async (url: string) => {
            if (url.endsWith("state.json")) return response({}, false)
            return response(sample)
        }))
    })

    it("renders the sample state and summary counts", async () => {
        render(<App />)
        expect(await screen.findByText("Sample data")).toBeInTheDocument()
        expect(screen.getByText("StarCi Skills")).toBeInTheDocument()
        expect(screen.getByRole("tab", {name: /Workspaces/})).toBeInTheDocument()
        expect(screen.getAllByText(String(sample.workspaces.length).trim()).length).toBeGreaterThan(0)
    })

    it("switches through registries and sessions without writing", async () => {
        const user = userEvent.setup()
        render(<App />)
        await screen.findByText("Sample data")
        const registriesTab = screen.getAllByRole("tab", {name: /Registries/})[0]
        const sessionsTab = screen.getAllByRole("tab", {name: /Sessions/})[0]
        await user.click(registriesTab)
        expect(registriesTab).toHaveAttribute("aria-selected", "true")
        await user.click(sessionsTab)
        expect(sessionsTab).toHaveAttribute("aria-selected", "true")
        expect(fetch).toHaveBeenCalledTimes(2)
    })

    it("falls back to a failure card when both snapshots are unavailable", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => response({}, false)))
        render(<App />)
        await waitFor(() => expect(screen.getByText("Unable to read state")).toBeInTheDocument())
        expect(screen.getByText(/export-console-state/)).toBeInTheDocument()
    })

    it("falls back to a failure card after network errors", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline") }))
        render(<App />)
        await waitFor(() => expect(screen.getByText("Unable to read state")).toBeInTheDocument())
        expect(screen.getByText(/state\.json or state\.sample\.json/)).toBeInTheDocument()
    })

    it("labels a live snapshot as scanned data", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => response(sample)))
        render(<App />)
        expect(await screen.findByText("Scanned")).toBeInTheDocument()
        expect(screen.getByText(/Source:/)).toBeInTheDocument()
    })

    it("renders a clean snapshot without warnings or queued work", async () => {
        const clean: ConsoleState = {scannedAt: "2026-08-28T12:34:56.000Z", source: "test snapshot", workspaces: [], projects: [], warnings: []}
        vi.stubGlobal("fetch", vi.fn(async () => response(clean)))
        render(<App />)
        expect(await screen.findByText("Scanned")).toBeInTheDocument()
        expect(screen.getByText("Workspaces panel")).toBeInTheDocument()
        expect(screen.queryByText("Warnings")).not.toBeInTheDocument()
        expect(screen.getByText("Source: test snapshot")).toBeInTheDocument()
    })
})
