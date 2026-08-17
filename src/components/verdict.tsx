import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils"
import {Check, Copy} from "lucide-react"
import {useState} from "react"

const tone = {
    ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    bad: "border-red-500/30 bg-red-500/10 text-red-400",
    idle: "text-muted-foreground",
} as const

export type Tone = keyof typeof tone

/** A verdict reads as one word and one colour, because it is one decision. */
export function Verdict({tone: t, children}: {tone: Tone; children: string}) {
    return (
        <Badge variant="outline" className={cn("gap-1.5 font-medium", tone[t])}>
            <span className={cn("size-1.5 rounded-full", t === "ok" && "bg-emerald-400", t === "warn" && "bg-amber-400", t === "bad" && "bg-red-400", t === "idle" && "bg-muted-foreground")} />
            {children}
        </Badge>
    )
}

/**
 * A command to copy, never a button that writes.
 *
 * Repointing a route, installing a worktree and approving a hash are each owned by a skill with its own
 * approval boundary. A button here would make a second author for the same root.
 */
export function CopyCommand({command}: {command: string}) {
    const [copied, setCopied] = useState(false)
    return (
        <Tooltip>
            {/* Base UI composes through `render`, not `asChild` — the trigger IS the button. */}
            <TooltipTrigger
                render={
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 max-w-[15rem] justify-start gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            void navigator.clipboard?.writeText(command)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 1200)
                        }}
                    />
                }
            >
                {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span className="truncate">{command}</span>
            </TooltipTrigger>
            <TooltipContent side="left">{copied ? "Copied" : "Copy — run it yourself; the console never writes"}</TooltipContent>
        </Tooltip>
    )
}

/** A path is read, not prose: monospace, and it wraps rather than pushing the table wide. */
export function Path({children, muted = false}: {children: string | null; muted?: boolean}) {
    if (!children) return <span className="text-muted-foreground">—</span>
    return <span className={cn("font-mono text-xs break-all", muted && "text-muted-foreground")}>{children}</span>
}
