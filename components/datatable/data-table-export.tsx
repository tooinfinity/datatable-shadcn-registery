import * as React from 'react'
import { DownloadIcon } from 'lucide-react'
import { Button } from '@/registry/datatable/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/datatable/ui/dropdown-menu'
import { ExportOptions } from './types'

interface DataTableExportProps {
  exportOptions?: ExportOptions
}

export function DataTableExport({ exportOptions }: DataTableExportProps) {
  if (!exportOptions) return null

  const handleExport = async (type: string) => {
    if (exportOptions.onExport) {
      await exportOptions.onExport(type)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

DataTableExport.displayName = 'DataTable.Export'