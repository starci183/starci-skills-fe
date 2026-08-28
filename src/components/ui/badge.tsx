import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { VariantProps } from "class-variance-authority"

import { badgeVariants, getBadgeClassName } from "./classNames"

/** Props for the shared badge primitive and its visual variant. */
export type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

/** Render a compact status badge using Base UI's render API. */
const Badge = (props: BadgeProps) => {
  const { variant = "default", render, ...rest } = props
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: getBadgeClassName(variant) },
      rest,
    ),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
