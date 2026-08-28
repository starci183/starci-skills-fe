import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("UI primitives", () => {
  it("renders card family content and footer", () => {
    render(<Card size="sm"><CardHeader><CardTitle>Summary</CardTitle></CardHeader><CardContent>Details</CardContent><CardFooter>Actions</CardFooter></Card>)
    expect(screen.getByText("Summary")).toBeVisible()
    expect(screen.getByText("Details")).toBeVisible()
    expect(screen.getByText("Actions")).toBeVisible()
  })

  it("supports badge variants and button activation", () => {
    const onClick = () => undefined
    render(<><Badge variant="outline">Ready</Badge><Button variant="secondary" size="sm" onClick={onClick}>Continue</Button></>)
    expect(screen.getByText("Ready")).toBeVisible()
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled()
  })

  it("renders table semantics through every table primitive", () => {
    render(<Table><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Ada</TableCell></TableRow></TableBody></Table>)
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeVisible()
    expect(screen.getByRole("cell", { name: "Ada" })).toBeVisible()
  })

  it("switches tab panels and supports vertical orientation", () => {
    render(<Tabs defaultValue="one" orientation="vertical"><TabsList><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two">Two</TabsTrigger></TabsList><TabsContent value="one">First</TabsContent><TabsContent value="two">Second</TabsContent></Tabs>)
    expect(screen.getByText("First")).toBeVisible()
    fireEvent.click(screen.getByRole("tab", { name: "Two" }))
    expect(screen.getByText("Second")).toBeVisible()
  })

  it("opens sheet content and renders scrollable children", () => {
    render(<Sheet><SheetTrigger>Open menu</SheetTrigger><SheetContent side="left">Menu content</SheetContent></Sheet>)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByText("Menu content")).toBeVisible()
    render(<ScrollArea><div>Scrollable content</div><ScrollBar orientation="horizontal" /></ScrollArea>)
    expect(screen.getByText("Scrollable content")).toBeVisible()
  })

  it("renders sheet compound parts and default primitive branches", () => {
    render(<Sheet open><SheetContent showCloseButton={false}><SheetHeader><SheetTitle>Preferences</SheetTitle><SheetDescription>Choose a setting</SheetDescription></SheetHeader><SheetFooter>Done</SheetFooter></SheetContent></Sheet>)
    expect(screen.getByText("Preferences")).toBeVisible()
    expect(screen.getByText("Choose a setting")).toBeVisible()
    expect(screen.getByText("Done")).toBeVisible()

    render(<><Tabs defaultValue="first"><TabsList variant="default"><TabsTrigger value="first">First</TabsTrigger></TabsList><TabsContent value="first">Default panel</TabsContent></Tabs><ScrollArea><ScrollBar /></ScrollArea></>)
    expect(screen.getByText("Default panel")).toBeVisible()
  })
})
