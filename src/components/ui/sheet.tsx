"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { getSheetContentClassName, getSheetDescriptionClassName, getSheetFooterClassName, getSheetHeaderClassName, getSheetOverlayClassName, getSheetTitleClassName, sheetSrOnlyClassName } from "./classNames"
import { Button } from "@/components/ui/button"
/** Props for the sheet root. */
export type SheetProps = SheetPrimitive.Root.Props
/** Props for the sheet trigger. */
export type SheetTriggerProps = SheetPrimitive.Trigger.Props
/** Props for the sheet close control. */
export type SheetCloseProps = SheetPrimitive.Close.Props
/** Props for the sheet portal. */
export type SheetPortalProps = SheetPrimitive.Portal.Props
/** Props for the sheet overlay. */
export type SheetOverlayProps = SheetPrimitive.Backdrop.Props
/** Props for sheet content and its placement options. */
export type SheetContentProps = SheetPrimitive.Popup.Props & { side?: "top" | "right" | "bottom" | "left"; showCloseButton?: boolean }
/** Props for the sheet header. */
export type SheetHeaderProps = React.ComponentProps<"div">
/** Props for the sheet footer. */
export type SheetFooterProps = React.ComponentProps<"div">
/** Props for the sheet title. */
export type SheetTitleProps = SheetPrimitive.Title.Props
/** Props for the sheet description. */
export type SheetDescriptionProps = SheetPrimitive.Description.Props

const Sheet = (props: SheetProps) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

const SheetTrigger = (props: SheetTriggerProps) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetClose = (props: SheetCloseProps) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const SheetPortal = (props: SheetPortalProps) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const SheetOverlay = (props: SheetOverlayProps) => {
  const { ...rest } = props
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={getSheetOverlayClassName()}
      {...rest}
    />
  )
}

const SheetContent = (props: SheetContentProps) => {
  const { children, side = "right", showCloseButton = true, ...rest } = props
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={getSheetContentClassName()}
        {...rest}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
              />
            }
          >
            <span aria-hidden="true">×</span>
            <span className={sheetSrOnlyClassName}>Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

const SheetHeader = (props: SheetHeaderProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="sheet-header"
      className={getSheetHeaderClassName()}
      {...rest}
    />
  )
}

const SheetFooter = (props: SheetFooterProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="sheet-footer"
      className={getSheetFooterClassName()}
      {...rest}
    />
  )
}

const SheetTitle = (props: SheetTitleProps) => {
  const { ...rest } = props
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={getSheetTitleClassName()}
      {...rest}
    />
  )
}

const SheetDescription = (props: SheetDescriptionProps) => {
  const { ...rest } = props
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={getSheetDescriptionClassName()}
      {...rest}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
