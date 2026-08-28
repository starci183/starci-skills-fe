import {cn} from "@/lib/utils"

/** Lays out the compact summary statistic with its icon and value. */
export const statClassName = cn("flex", "items-center", "gap-3", "rounded-lg", "border", "bg-card", "px-4", "py-3")
/** Styles a statistic value according to its severity. */
export const getStatValueClassName = (tone?: "warn" | "bad") => cn("text-lg", "leading-none", "font-semibold", "tabular-nums", tone === "bad" ? "text-red-400" : tone === "warn" ? "text-amber-400" : undefined)
/** Styles the muted icon wrapper in a summary statistic. */
export const statIconClassName = cn("text-muted-foreground")
/** Stacks a statistic value and its label. */
export const statBodyClassName = cn("flex", "flex-col")
/** Styles the small secondary label under a statistic. */
export const statLabelClassName = cn("text-xs", "text-muted-foreground")
/** Provides the app's minimum viewport-height shell. */
export const appShellClassName = cn("min-h-screen")
/** Pins the app header and gives it a translucent backdrop. */
export const appHeaderClassName = cn("sticky", "top-0", "z-10", "border-b", "bg-background/80", "backdrop-blur")
/** Centers the header content and preserves its responsive wrapping. */
export const appHeaderInnerClassName = cn("mx-auto", "flex", "w-full", "max-w-7xl", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3", "px-6", "py-4")
/** Stacks the app title and subtitle. */
export const appHeadingGroupClassName = cn("flex", "flex-col", "gap-1")
/** Styles the compact app title text inside the semantic heading. */
export const appTitleClassName = cn("text-base", "leading-none", "font-semibold")
/** Styles the app subtitle. */
export const appSubtitleClassName = cn("text-xs", "text-muted-foreground")
/** Aligns the snapshot status badge and timestamp. */
export const snapshotMetaClassName = cn("flex", "items-center", "gap-2")
/** Styles the snapshot timestamp. */
export const snapshotTimestampClassName = cn("font-mono", "text-xs", "text-muted-foreground")
/** Provides the centered, padded page content column. */
export const appMainClassName = cn("mx-auto", "flex", "w-full", "max-w-7xl", "flex-col", "gap-6", "px-6", "py-6")
/** Styles the loading message inside its CardContent owner. */
export const loadingMessageClassName = cn("py-10", "text-center", "text-sm", "text-muted-foreground")
/** Styles the command hint in the failure message. */
export const commandHintClassName = cn("font-mono", "text-xs")
/** Lays out the summary statistic grid. */
export const statsGridClassName = cn("grid", "grid-cols-2", "gap-3", "lg:grid-cols-4")
/** Adds spacing around the tabbed content region. */
export const tabsWrapperClassName = cn("gap-4")
/** Styles the result count displayed alongside each tab label. */
export const tabCountClassName = cn("ml-2", "text-muted-foreground")
/** Highlights the warning card border. */
export const warningCardClassName = cn("border-amber-500/25")
/** Aligns the warning title icon, copy and count. */
export const warningTitleClassName = cn("flex", "items-center", "gap-2", "text-amber-400")
/** Styles the warning count badge text and border. */
export const warningCountClassName = cn("border-amber-500/30", "text-amber-400")
/** Stacks warning rows with their separators. */
export const warningRowsClassName = cn("flex", "flex-col", "gap-2", "text-sm")
/** Stacks the content within one warning row. */
export const warningRowClassName = cn("flex", "flex-col", "gap-2")
/** Styles warning copy as secondary text. */
export const warningTextClassName = cn("text-muted-foreground")
/** Styles the source footer. */
export const sourceFooterClassName = cn("pb-4", "font-mono", "text-xs", "text-muted-foreground")
