import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { getScrollAreaClassName, getScrollBarClassName, scrollThumbClassName, scrollViewportClassName } from "./classNames"

/** Props for the scroll area root. */
export type ScrollAreaProps = ScrollAreaPrimitive.Root.Props
/** Props for the scroll bar. */
export type ScrollBarProps = ScrollAreaPrimitive.Scrollbar.Props

const ScrollArea = (props: ScrollAreaProps) => {
  const { children, ...rest } = props
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={getScrollAreaClassName()}
      {...rest}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={scrollViewportClassName}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

const ScrollBar = (props: ScrollBarProps) => {
  const { orientation = "vertical", ...rest } = props
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={getScrollBarClassName()}
      {...rest}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={scrollThumbClassName}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
