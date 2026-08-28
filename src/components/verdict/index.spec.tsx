import {fireEvent, render, screen} from "@testing-library/react"
import {describe, expect, it, vi} from "vitest"
import {CopyCommand, Path, Verdict} from "./index"

describe("verdict components", () => {
    it("renders every semantic tone with its status text", () => {
        render(<div>{(["ok", "warn", "bad", "idle"] as const).map((tone) => <Verdict key={tone} tone={tone}>{tone}</Verdict>)}</div>)

        for (const tone of ["ok", "warn", "bad", "idle"]) expect(screen.getByText(tone)).toBeInTheDocument()
    })

    it("copies the complete command from its accessible button", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        Object.defineProperty(navigator, "clipboard", {configurable: true, value: {writeText}})
        render(<CopyCommand command="npm run export" />)

        fireEvent.click(screen.getByRole("button", {name: "npm run export"}))

        expect(writeText).toHaveBeenCalledWith("npm run export")
    })

    it("renders absent and muted paths semantically", () => {
        render(<div><Path>{null}</Path><Path muted>/tmp/snapshot.json</Path></div>)

        expect(screen.getByText("—")).toBeInTheDocument()
        expect(screen.getByText("/tmp/snapshot.json")).toBeInTheDocument()
    })
})
