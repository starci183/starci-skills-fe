import type {ReactNode} from "react"
import {cn} from "@/lib/utils"

export function Card({title, fact, children, className}: {title?: string; fact?: ReactNode; children: ReactNode; className?: string}) {
    return (
        <section className="flex min-w-0 flex-col gap-3">
            {title ? (
                <div className="flex flex-row flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-sm font-semibold text-ink">{title}</h2>
                    {fact ? <span className="text-xs text-ink-muted">{fact}</span> : null}
                </div>
            ) : null}
            <div className={cn("rounded-xl border border-line bg-surface-raised", className)}>{children}</div>
        </section>
    )
}

export function Badge({tone = "muted", children}: {tone?: "ok" | "warn" | "bad" | "muted"; children: ReactNode}) {
    const tones = {
        ok: "text-ok border-ok/40 bg-ok/10",
        warn: "text-warn border-warn/40 bg-warn/10",
        bad: "text-bad border-bad/40 bg-bad/10",
        muted: "text-ink-muted border-line bg-surface",
    } as const
    return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>
}

export function Table({head, children}: {head: string[]; children: ReactNode}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-line text-xs text-ink-muted">
                        {head.map((h) => (
                            <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">{children}</tbody>
            </table>
        </div>
    )
}

export function Cell({children, mono = false}: {children: ReactNode; mono?: boolean}) {
    return <td className={cn("px-4 py-2.5 align-top", mono && "font-mono text-xs")}>{children}</td>
}

export function Empty({children}: {children: ReactNode}) {
    return <p className="px-4 py-6 text-sm text-ink-muted">{children}</p>
}

/** A command to copy, not a button that writes: the skills stay the only author of this state. */
export function Command({children}: {children: string}) {
    return (
        <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(children)}
            title="Copy"
            className="w-full truncate rounded-md border border-line bg-surface px-2 py-1 text-left font-mono text-xs text-ink-muted hover:text-ink"
        >
            {children}
        </button>
    )
}
