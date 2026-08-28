import {cn} from "@/lib/utils"

/** Styles the compact verdict status row. */
export const verdictClassName = cn("inline-flex", "items-center", "gap-1.5")

/** Styles the verdict indicator dot. */
export const verdictDotClassName = cn("size-1.5", "rounded-full")

/** Selects the verdict dot colour for the current status. */
export const getVerdictDotClassName = (tone: "ok" | "warn" | "bad" | "idle") => cn(tone === "ok" ? "bg-emerald-400" : tone === "warn" ? "bg-amber-400" : tone === "bad" ? "bg-red-400" : "bg-muted-foreground")

/** Combines the verdict dot shape and its semantic status colour. */
export const getVerdictIndicatorClassName = (tone: "ok" | "warn" | "bad" | "idle") => cn(verdictDotClassName, getVerdictDotClassName(tone))

/** Styles the copy command button without allowing arbitrary width growth. */
export const copyCommandButtonClassName = cn("justify-start", "gap-2", "font-mono", "text-xs")

/** Truncates a copy command while keeping its tooltip as the full value. */
export const copyCommandTextClassName = cn("max-w-60", "truncate")

/** Styles readable filesystem paths with wrapping monospace text. */
export const pathClassName = cn("break-all", "font-mono", "text-xs")

/** Adds muted text styling when a path is present but stale or unavailable. */
export const getPathClassName = (muted: boolean) => cn(pathClassName, muted ? "text-muted-foreground" : undefined)

/** Styles the placeholder for an absent filesystem path. */
export const emptyPathClassName = cn("text-muted-foreground")
