import * as React from 'react'
import { DataTableProps } from './types'
import { useDataTable } from './use-datatable'
import { DataTableHeader } from './data-table-header'
import { DataTableContent } from './data-table-content'
import { DataTablePagination } from './data-table-pagination'

function DataTable<TData>({
  data,
  columns,
  pagination,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  onFiltersChange,
  isLoading,
  error,
  renderRowActions,
  renderToolbar,
  renderEmptyState,
  renderError,
  enableRowSelection,
  enableColumnVisibility,
  enableSorting = true,
  enableFilters,
  enableSearch,
  enablePagination = true,
  enableExport,
  exportOptions,
}: DataTableProps<TData>) {
  const {
    table,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    globalFilter,
    setGlobalFilter,
  } = useDataTable({
    data,
    columns,
    pagination,
    onPaginationChange,
    onSortingChange,
    onSearchChange,
    onFiltersChange,
    enableRowSelection,
    enableColumnVisibility,
    enableSorting,
    enableFilters,
    enableSearch,
    enablePagination,
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <DataTable.Header
        table={table}
        enableSearch={enableSearch}
        enableFilters={enableFilters}
        enableColumnVisibility={enableColumnVisibility}
        enableExport={enableExport}
        exportOptions={exportOptions}
        renderToolbar={renderToolbar}
      />

      {/* Content */}
      <DataTable.Content
        table={table}
        isLoading={isLoading}
        error={error}
        renderRowActions={renderRowActions}
        renderEmptyState={renderEmptyState}
        renderError={renderError}
      />

      {/* Pagination */}
      {enablePagination && (
        <DataTable.Pagination table={table} pagination={pagination} />
      )}
    </div>
  )
}

// Compound components
DataTable.Header = DataTableHeader
DataTable.Content = DataTableContent
DataTable.Pagination = DataTablePagination

// Type-safe display names
DataTable.displayName = 'DataTable'

export { DataTable }