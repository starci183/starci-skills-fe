import {cn} from "@/lib/utils"

/** Select the semantic icon size utility for the requested meaning. */
export const iconClassName = (size: "sm" | "md" = "md") => cn(size === "sm" ? "size-3" : "size-4")
