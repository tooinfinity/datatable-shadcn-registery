import { Table as TanStackTable, ColumnDef, Row, Column, Header } from '@tanstack/react-table'

// Custom column meta interface
export interface CustomColumnMeta<TData> {
  headAs?: React.ComponentType<{
    column: Column<TData, unknown>
    header: Header<TData, unknown>
    table: TanStackTable<TData>
  }>
  filter?: {
    type: 'select' | 'multi-select' | 'date-range' | 'text'
    options?: {
      label: string
      value: string | number
    }[]
  }
}

// Export options
export interface ExportOptions {
  type: 'csv' | 'excel' | 'pdf'
  filename?: string
  onExport?: (type: string) => void | Promise<void>
}

// Augment @tanstack/react-table module
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue = unknown>
    extends CustomColumnMeta<TData> {}
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface SortingState {
  id: string
  desc: boolean
}

export interface LaravelPagination {
  current_page: number
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pagination?: LaravelPagination
  onPaginationChange?: (pagination: PaginationState) => void
  onSortingChange?: (sorting: SortingState[]) => void
  onSearchChange?: (search: string) => void
  onFiltersChange?: (filters: Record<string, any>) => void
  isLoading?: boolean
  error?: Error
  renderRowActions?: (row: Row<TData>) => React.ReactNode
  renderToolbar?: () => React.ReactNode
  renderEmptyState?: () => React.ReactNode
  renderError?: (error: Error) => React.ReactNode
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableSorting?: boolean
  enableFilters?: boolean
  enableSearch?: boolean
  enablePagination?: boolean
  enableExport?: boolean
  exportOptions?: ExportOptions
}

export interface DataTableHeaderProps<TData> {
  table: TanStackTable<TData>
  enableSearch?: boolean
  enableFilters?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  exportOptions?: ExportOptions
  renderToolbar?: () => React.ReactNode
}

export interface DataTableContentProps<TData> {
  table: TanStackTable<TData>
  isLoading?: boolean
  error?: Error
  renderRowActions?: (row: Row<TData>) => React.ReactNode
  renderEmptyState?: () => React.ReactNode
  renderError?: (error: Error) => React.ReactNode
}

export interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>
  pagination?: LaravelPagination
}

export interface FacetedFilter<TData> {
  column: Column<TData>
  title: string
  options: {
    label: string
    value: string | number
    icon?: React.ComponentType<{ className?: string }>
  }[]
}