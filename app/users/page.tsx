"use client"

import { UsersTable } from '@/components/examples/users-table'
import { LaravelPagination } from '@/components/datatable/types'

type User = {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  status: 'active' | 'inactive' | 'pending'
}

// Test data
const testUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    createdAt: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    createdAt: "2024-02-20",
    status: "active"
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Editor",
    createdAt: "2024-03-10",
    status: "pending"
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    createdAt: "2024-03-25",
    status: "inactive"
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Moderator",
    createdAt: "2024-04-05",
    status: "active"
  }
]

// Test pagination data
const testPagination: LaravelPagination = {
  current_page: 1,
  first_page_url: "?page=1",
  from: 1,
  last_page: 1,
  last_page_url: "?page=1",
  next_page_url: null,
  path: "",
  per_page: 10,
  prev_page_url: null,
  to: 5,
  total: 5,
  links: [
    { url: null, label: "&laquo; Previous", active: false },
    { url: "?page=1", label: "1", active: true },
    { url: null, label: "Next &raquo;", active: false }
  ]
}

export default function UsersPage() {
  return (
    <div className="container py-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your application users
          </p>
        </div>
        
        <UsersTable data={testUsers} pagination={testPagination} />
      </div>
    </div>
  )
}