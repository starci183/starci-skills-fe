import {Icon} from "@/components/leaves/Icon"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {copyCommandButtonClassName, copyCommandTextClassName, emptyPathClassName, getPathClassName, getVerdictIndicatorClassName, verdictClassName} from "./classNames"
import {useState} from "react"

/** Supported visual meanings for a console verdict. */
export type Tone = "ok" | "warn" | "bad" | "idle"

/** Props for a compact status verdict. */
export type VerdictProps = {tone: Tone; children: string}

/** Props for the clipboard command affordance. */
export type CopyCommandProps = {command: string}

/** Props for a readable filesystem path. */
export type PathProps = {children: string | null; muted?: boolean}

/** A verdict reads as one word and one colour, because it is one decision. */
export const Verdict = (props: VerdictProps) => {
    const variant = props.tone === "bad" ? "destructive" : props.tone === "ok" ? "secondary" : props.tone === "warn" ? "outline" : "ghost"
    return <span className={verdictClassName}><Badge variant={variant}><span className={getVerdictIndicatorClassName(props.tone)} />{props.children}</Badge></span>
}

/**
 * A command to copy, never a button that writes.
 *
 * Repointing a route, installing a worktree and approving a hash are each owned by a skill with its own
 * approval boundary. A button here would make a second author for the same root.
 */
export const CopyCommand = (props: CopyCommandProps) => {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        void navigator.clipboard?.writeText(props.command)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
    }
    return (
        <Tooltip>
            {/* Base UI composes through `render`, not `asChild` — the trigger IS the button. */}
            <TooltipTrigger onClick={copy} render={<button type="button" className={copyCommandButtonClassName} />}>
                {copied ? <Icon name="check" size="sm" /> : <Icon name="copy" size="sm" />}
                <span className={copyCommandTextClassName}>{props.command}</span>
            </TooltipTrigger>
            <TooltipContent side="left">{copied ? "Copied" : "Copy — run it yourself; the console never writes"}</TooltipContent>
        </Tooltip>
    )
}

/** A path is read, not prose: monospace, and it wraps rather than pushing the table wide. */
export const Path = (props: PathProps) => {
    if (!props.children) return <span className={emptyPathClassName}>—</span>
    return <span className={getPathClassName(Boolean(props.muted))}>{props.children}</span>
}
