import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/registry/datatable/ui/button'
import { Input } from '@/registry/datatable/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/registry/datatable/ui/dropdown-menu'
import { DataTableHeaderProps } from './types'
import { DataTableFilter } from './data-table-filter'
import { DataTableExport } from './data-table-export'

export function DataTableHeader<TData>({
  table,
  enableSearch,
  enableFilters,
  enableColumnVisibility,
  enableExport,
  exportOptions,
  renderToolbar,
}: DataTableHeaderProps<TData>) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          {enableSearch && (
            <Input
              placeholder="Search..."
              value={table.getState().globalFilter ?? ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="max-w-xs"
            />
          )}

          {/* Custom toolbar */}
          {renderToolbar?.()}
        </div>

        <div className="flex items-center gap-2">
          {/* Export */}
          {enableExport && <DataTableExport exportOptions={exportOptions} />}

          {/* Column visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Filters */}
      {enableFilters && (
        <div className="flex flex-wrap gap-2">
          {table
            .getAllColumns()
            .filter((column) => column.getCanFilter())
            .map((column) => (
              <DataTableFilter key={column.id} column={column} />
            ))}
        </div>
      )}
    </div>
  )
}

DataTableHeader.displayName = 'DataTable.Header'