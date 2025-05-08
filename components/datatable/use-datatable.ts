import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState as TanStackSortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { useDebouncedCallback } from 'use-debounce'
import { DataTableProps, PaginationState, SortingState } from './types'

export function useDataTable<TData>({
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
}: DataTableProps<TData>) {
  // Memoize initial states to prevent unnecessary re-renders
  const initialPagination = useMemo(
    () => ({
      pageIndex: (pagination?.current_page ?? 1) - 1,
      pageSize: pagination?.per_page ?? 10,
    }),
    [pagination?.current_page, pagination?.per_page]
  )

  // Local state
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<TanStackSortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(initialPagination)

  // Memoize handlers to prevent unnecessary re-renders
  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      if (onPaginationChange) {
        onPaginationChange(newPagination)
      }
    },
    [onPaginationChange]
  )

  const handleSortingChange = useCallback(
    (newSorting: TanStackSortingState) => {
      if (onSortingChange) {
        const formattedSorting = newSorting.map((sort) => ({
          id: sort.id,
          desc: sort.desc,
        }))
        onSortingChange(formattedSorting)
      }
    },
    [onSortingChange]
  )

  // Debounced handlers
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      if (onSearchChange) {
        onSearchChange(value)
      }
    },
    300
  )

  const debouncedFilters = useDebouncedCallback(
    (filters: ColumnFiltersState) => {
      if (onFiltersChange) {
        const formattedFilters = filters.reduce((acc, filter) => {
          acc[filter.id] = filter.value
          return acc
        }, {} as Record<string, any>)
        onFiltersChange(formattedFilters)
      }
    },
    300
  )

  // Effect to sync pagination with server
  useEffect(() => {
    handlePaginationChange({ pageIndex, pageSize })
  }, [pageIndex, pageSize, handlePaginationChange])

  // Effect to sync sorting with server
  useEffect(() => {
    handleSortingChange(sorting)
  }, [sorting, handleSortingChange])

  // Effect to sync search with server
  useEffect(() => {
    if (enableSearch) {
      debouncedSearch(globalFilter)
    }
  }, [globalFilter, enableSearch, debouncedSearch])

  // Effect to sync filters with server
  useEffect(() => {
    if (enableFilters) {
      debouncedFilters(columnFilters)
    }
  }, [columnFilters, enableFilters, debouncedFilters])

  // Memoize table instance to prevent unnecessary re-renders
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount: pagination?.last_page ?? -1,
    enableRowSelection,
    enableColumnFilters: enableFilters,
    enableGlobalFilter: enableSearch,
    enableSorting,
    manualPagination: !!onPaginationChange,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onFiltersChange || !!onSearchChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return {
    table,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    globalFilter,
    setGlobalFilter,
  }
}