import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"
import { getButtonClassName, buttonVariants } from "./classNames"

/** Props accepted by the shared Base UI button primitive. */
export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

const Button = (props: ButtonProps) => {
  const { variant = "default", size = "default", ...rest } = props
  return (
    <ButtonPrimitive
      data-slot="button"
      className={getButtonClassName(variant, size)}
      {...rest}
    />
  )
}

export { Button, buttonVariants }
