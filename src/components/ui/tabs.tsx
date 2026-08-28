"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type { VariantProps } from "class-variance-authority"
import { getTabsClassName, getTabsContentClassName, getTabsListClassName, getTabsTriggerClassName, tabsListVariants } from "./classNames"

/** Props for the tabs root. */
export type TabsProps = TabsPrimitive.Root.Props
/** Props for the tabs list. */
export type TabsListProps = TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>
/** Props for a tab trigger. */
export type TabsTriggerProps = TabsPrimitive.Tab.Props
/** Props for tab content. */
export type TabsContentProps = TabsPrimitive.Panel.Props

const Tabs = (props: TabsProps) => { const { orientation = "horizontal", ...rest } = props; return <TabsPrimitive.Root data-slot="tabs" data-orientation={orientation} className={getTabsClassName()} {...rest} /> }
const TabsList = (props: TabsListProps) => { const { variant = "default", ...rest } = props; return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={getTabsListClassName(variant)} {...rest} /> }
const TabsTrigger = (props: TabsTriggerProps) => <TabsPrimitive.Tab data-slot="tabs-trigger" className={getTabsTriggerClassName()} {...props} />
const TabsContent = (props: TabsContentProps) => <TabsPrimitive.Panel data-slot="tabs-content" className={getTabsContentClassName()} {...props} />

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
