import {cn} from "@/lib/utils"

/** Panel stack. */
export const panelStackClassName = cn("flex", "flex-col", "gap-2")
/** Compact panel stack. */
export const panelStackTightClassName = cn("flex", "flex-col", "gap-1")
/** Muted panel text. */
export const panelMutedTextClassName = cn("text-muted-foreground")
/** Small muted panel text. */
export const panelSmallMutedClassName = cn("text-xs", "text-muted-foreground")
/** Breakable monospace text. */
export const panelBreakMonoClassName = cn("font-mono", "text-xs", "break-all")
/** Breakable muted text. */
export const panelBreakMutedClassName = cn("text-xs", "text-muted-foreground", "break-all")
/** Registry entry card. */
export const panelRoundCardClassName = cn("flex", "flex-col", "gap-2", "rounded-md", "border", "bg-card", "p-3")
/** Wrapping row. */
export const panelFlexWrapClassName = cn("flex", "flex-wrap", "gap-2")
/** Section stack. */
export const panelSectionClassName = cn("flex", "flex-col", "gap-2")
/** Small section stack. */
export const panelSectionTextClassName = cn("flex", "flex-col", "gap-2", "text-xs")
/** Sheet body. */
export const panelSessionBodyClassName = cn("flex", "flex-col", "gap-4", "pb-8")
/** Map entry. */
export const panelMapEntryClassName = cn("flex", "flex-col", "gap-1")
/** Map preview. */
export const panelMapPreClassName = cn("overflow-x-auto", "rounded-md", "border", "bg-card", "p-3", "font-mono", "text-xs")
/** Decision list. */
export const panelDecisionListClassName = cn("flex", "flex-col", "gap-1", "font-mono", "text-xs", "text-muted-foreground")
/** Decision summary. */
export const panelDecisionRowClassName = cn("flex", "flex-wrap", "gap-2", "text-xs")
/** Amber status text. */
export const panelAmberTextClassName = cn("text-xs", "text-amber-400")
/** Green status text. */
export const panelGreenTextClassName = cn("text-emerald-400")
/** Refusal label. */
export const panelRefusalLabelClassName = cn("text-xs", "font-medium", "text-amber-400")
/** Italic muted text. */
export const panelItalicMutedClassName = cn("text-xs", "text-muted-foreground", "italic")
/** Rejected item. */
export const panelRejectedClassName = cn("flex", "flex-col", "gap-1", "border-l-2", "border-red-500/40", "pl-2")
/** Foreground emphasis. */
export const panelForegroundClassName = cn("text-foreground")
