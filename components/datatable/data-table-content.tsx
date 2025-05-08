import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/datatable/ui/table'
import { Checkbox } from '@/registry/datatable/ui/checkbox'
import { DataTableContentProps } from './types'
import { flexRender } from '@tanstack/react-table'

export function DataTableContent<TData>({
  table,
  isLoading,
  error,
  renderRowActions,
  renderEmptyState,
  renderError,
}: DataTableContentProps<TData>) {
  // Show error state
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        {renderError ? (
          renderError(error)
        ) : (
          <>
            <p className="text-muted-foreground mb-2 text-sm">Something went wrong</p>
            <p className="text-xs">{error.message}</p>
          </>
        )}
      </div>
    )
  }

  // Show empty state
  if (table.getRowModel().rows.length === 0) {
    if (isLoading) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )
    }

    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        {renderEmptyState ? (
          renderEmptyState()
        ) : (
          <p className="text-muted-foreground text-sm">No results found.</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {header.column.id === 'select' ? (
                            <Checkbox
                              checked={table.getIsAllRowsSelected()}
                              onCheckedChange={(value) =>
                                table.toggleAllRowsSelected(!!value)
                              }
                              aria-label="Select all"
                              className="translate-y-[2px]"
                            />
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TableHead>
                )
              })}
              {renderRowActions && <TableHead />}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading rows
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`} className="animate-pulse">
                {table.getAllColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="h-4 w-full rounded bg-muted" />
                  </TableCell>
                ))}
                {renderRowActions && <TableCell />}
              </TableRow>
            ))
          ) : (
            // Data rows
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === 'select' ? (
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                {renderRowActions && (
                  <TableCell>{renderRowActions(row)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

DataTableContent.displayName = 'DataTable.Content'