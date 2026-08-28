import type {ReactNode} from "react"

/** Keeps heading level and heading presentation owned by one semantic primitive. */
export type HeadingProps = {level: 1 | 2 | 3; content: ReactNode}

/** Renders a heading with its semantic level selected together with its content. */
export const Heading = (props: HeadingProps) => {
    const Tag = `h${props.level}` as "h1" | "h2" | "h3"
    return <Tag>{props.content}</Tag>
}
