import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { router } from '@inertiajs/react'
import { DataTable } from '@/components/datatable/data-table'
import { Button } from '@/registry/datatable/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/registry/datatable/ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-react'
import { LaravelPagination, PaginationState, SortingState } from '@/components/datatable/types'

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  status: 'active' | 'inactive' | 'pending'
}

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Editor', value: 'editor' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function UsersTable({
  data,
  pagination,
}: {
  data: User[]
  pagination: LaravelPagination
}) {
  const [sorting, setSorting] = React.useState<SortingState[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  // Define columns with advanced filtering
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role}</span>
      ),
      meta: {
        filter: {
          type: 'select',
          options: roleOptions.map(option => ({
            label: option.label,
            value: option.value,
          })),
        },
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.status}</span>
      ),
      meta: {
        filter: {
          type: 'multi-select',
          options: statusOptions.map(option => ({
            label: option.label,
            value: option.value,
          })),
        },
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => dateFormatter.format(new Date(row.original.createdAt)),
      meta: {
        filter: {
          type: 'date-range',
        },
      },
    },
  ]

  // Handle server-side operations
  const handlePaginationChange = (pagination: PaginationState) => {
    router.get(
      '/users',
      {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort: sorting.length ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : undefined,
        search: searchQuery || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    )
  }

  const handleSortingChange = (newSorting: SortingState[]) => {
    setSorting(newSorting)
    router.get(
      '/users',
      {
        page: pagination.current_page,
        per_page: pagination.per_page,
        sort: newSorting.length ? `${newSorting[0].id}:${newSorting[0].desc ? 'desc' : 'asc'}` : undefined,
        search: searchQuery || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    )
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    router.get(
      '/users',
      {
        page: 1, // Reset to first page on search
        per_page: pagination.per_page,
        sort: sorting.length ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : undefined,
        search: query || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    )
  }

  const handleFiltersChange = (filters: Record<string, any>) => {
    router.get(
      '/users',
      {
        page: 1,
        per_page: pagination.per_page,
        sort: sorting.length ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : undefined,
        search: searchQuery || undefined,
        ...filters,
      },
      {
        preserveState: true,
        preserveScroll: true,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    )
  }

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/users/export?type=${type}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export.${type}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      onSortingChange={handleSortingChange}
      onSearchChange={handleSearchChange}
      onFiltersChange={handleFiltersChange}
      enableRowSelection
      enableColumnVisibility
      enableSorting
      enableSearch
      enableFilters
      enableExport
      exportOptions={{
        type: 'csv',
        onExport: handleExport,
      }}
      renderRowActions={(row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.visit(`/users/${row.original.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to delete this user?')) {
                  router.delete(`/users/${row.original.id}`)
                }
              }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderToolbar={() => (
        <Button onClick={() => router.visit('/users/create')}>
          Add User
        </Button>
      )}
    />
  )
}