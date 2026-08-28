"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { getTooltipContentClassName, tooltipArrowClassName, tooltipPositionerClassName } from "./classNames"

/** Props for the tooltip provider. */
export type TooltipProviderProps = TooltipPrimitive.Provider.Props
/** Props for a tooltip root. */
export type TooltipProps = TooltipPrimitive.Root.Props
/** Props for a tooltip trigger. */
export type TooltipTriggerProps = TooltipPrimitive.Trigger.Props
/** Props for a tooltip content popup. */
export type TooltipContentProps = TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">

/** Provide shared tooltip timing to descendants. */
const TooltipProvider = (props: TooltipProviderProps) => {
  const { delay = 0, ...rest } = props
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...rest} />
}
/** Render a tooltip root. */
const Tooltip = (props: TooltipProps) => <TooltipPrimitive.Root data-slot="tooltip" {...props} />
/** Render the trigger for a tooltip. */
const TooltipTrigger = (props: TooltipTriggerProps) => <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
/** Render positioned tooltip content and its arrow. */
const TooltipContent = (props: TooltipContentProps) => {
  const { side = "top", sideOffset = 4, align = "center", alignOffset = 0, children, ...rest } = props
  return <TooltipPrimitive.Portal><TooltipPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className={tooltipPositionerClassName}><TooltipPrimitive.Popup data-slot="tooltip-content" className={getTooltipContentClassName()} {...rest}>{children}<TooltipPrimitive.Arrow className={tooltipArrowClassName} /></TooltipPrimitive.Popup></TooltipPrimitive.Positioner></TooltipPrimitive.Portal>
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
