import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { getSeparatorClassName } from "./classNames"

/** Props for the Base UI separator primitive. */
export type SeparatorProps = SeparatorPrimitive.Props

const Separator = (props: SeparatorProps) => {
  const { orientation = "horizontal", ...rest } = props
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={getSeparatorClassName()}
      {...rest}
    />
  )
}

export { Separator }
