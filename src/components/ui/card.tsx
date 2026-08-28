import * as React from "react"

import { getCardActionClassName, getCardClassName, getCardContentClassName, getCardDescriptionClassName, getCardFooterClassName, getCardHeaderClassName, getCardTitleClassName } from "./classNames"

/** Props for the primary card surface. */
export type CardProps = React.ComponentProps<"div"> & { size?: "default" | "sm" }
/** Props for the card header. */
export type CardHeaderProps = React.ComponentProps<"div">
/** Props for the card title. */
export type CardTitleProps = React.ComponentProps<"div">
/** Props for the card description. */
export type CardDescriptionProps = React.ComponentProps<"div">
/** Props for the card action area. */
export type CardActionProps = React.ComponentProps<"div">
/** Props for the card content area. */
export type CardContentProps = React.ComponentProps<"div">
/** Props for the card footer. */
export type CardFooterProps = React.ComponentProps<"div">

const Card = (props: CardProps) => {
  const { size = "default", ...rest } = props
  return (
    <div
      data-slot="card"
      data-size={size}
        className={getCardClassName()}
      {...rest}
    />
  )
}

const CardHeader = (props: CardHeaderProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-header"
      className={getCardHeaderClassName()}
      {...rest}
    />
  )
}

const CardTitle = (props: CardTitleProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-title"
      className={getCardTitleClassName()}
      {...rest}
    />
  )
}

const CardDescription = (props: CardDescriptionProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-description"
      className={getCardDescriptionClassName()}
      {...rest}
    />
  )
}

const CardAction = (props: CardActionProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-action"
      className={getCardActionClassName()}
      {...rest}
    />
  )
}

const CardContent = (props: CardContentProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-content"
      className={getCardContentClassName()}
      {...rest}
    />
  )
}

const CardFooter = (props: CardFooterProps) => {
  const { ...rest } = props
  return (
    <div
      data-slot="card-footer"
      className={getCardFooterClassName()}
      {...rest}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
