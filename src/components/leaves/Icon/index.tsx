/** Semantic icon meanings used by the console; glyph selection stays inside the icon leaf. */
export type IconName = "warning" | "workspace" | "branch" | "layers" | "copy" | "check"
import {iconClassName} from "./classNames"

/** Props for the semantic icon leaf. */
export type IconProps = {name: IconName; size?: "sm" | "md"}

const paths: Record<IconName, string> = {
    warning: "M12 2 2 21h20L12 2Zm0 6v5m0 4h.01",
    workspace: "M3 7h7l2 2h9v10H3V7Zm0 0V5h6l2 2",
    branch: "M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 0h8a3 3 0 0 0 3-3V3",
    layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5",
    copy: "M8 8h11v13H8V8ZM5 16H3V3h13v2",
    check: "m5 12 4 4L19 6",
}

/** Renders one approved semantic icon at the caller's token size. */
/** Renders an approved semantic glyph without exposing CSS placement to callers. */
export const Icon = (props: IconProps) => {
    return <svg className={iconClassName(props.size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[props.name]} /></svg>
}
