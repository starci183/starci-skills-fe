import * as React from "react"
import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableContainerClassName, tableFooterClassName, tableClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from "./classNames"

/** Props for the table wrapper. */
export type TableProps = React.ComponentProps<"table">
/** Props for the table header. */
export type TableHeaderProps = React.ComponentProps<"thead">
/** Props for the table body. */
export type TableBodyProps = React.ComponentProps<"tbody">
/** Props for the table footer. */
export type TableFooterProps = React.ComponentProps<"tfoot">
/** Props for a table row. */
export type TableRowProps = React.ComponentProps<"tr">
/** Props for a table heading cell. */
export type TableHeadProps = React.ComponentProps<"th">
/** Props for a table data cell. */
export type TableCellProps = React.ComponentProps<"td">
/** Props for a table caption. */
export type TableCaptionProps = React.ComponentProps<"caption">

const Table = (props: TableProps) => { const { className, ...rest } = props; return <div data-slot="table-container" className={tableContainerClassName}><table data-slot="table" className={tableClassName(className)} {...rest} /></div> }
const TableHeader = (props: TableHeaderProps) => { const { className, ...rest } = props; return <thead data-slot="table-header" className={tableHeaderClassName(className)} {...rest} /> }
const TableBody = (props: TableBodyProps) => { const { className, ...rest } = props; return <tbody data-slot="table-body" className={tableBodyClassName(className)} {...rest} /> }
const TableFooter = (props: TableFooterProps) => { const { className, ...rest } = props; return <tfoot data-slot="table-footer" className={tableFooterClassName(className)} {...rest} /> }
const TableRow = (props: TableRowProps) => { const { className, ...rest } = props; return <tr data-slot="table-row" className={tableRowClassName(className)} {...rest} /> }
const TableHead = (props: TableHeadProps) => { const { className, ...rest } = props; return <th data-slot="table-head" className={tableHeadClassName(className)} {...rest} /> }
const TableCell = (props: TableCellProps) => { const { className, ...rest } = props; return <td data-slot="table-cell" className={tableCellClassName(className)} {...rest} /> }
const TableCaption = (props: TableCaptionProps) => { const { className, ...rest } = props; return <caption data-slot="table-caption" className={tableCaptionClassName(className)} {...rest} /> }

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
