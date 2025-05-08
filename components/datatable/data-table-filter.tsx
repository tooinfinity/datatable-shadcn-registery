import * as React from 'react'
import { Column } from '@tanstack/react-table'
import { Calendar } from 'lucide-react'
import { Button } from '@/registry/datatable/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/datatable/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/datatable/ui/select'
import { Calendar as CalendarComponent } from '@/registry/datatable/ui/calendar'
import { CustomColumnMeta } from './types'

interface DateRange {
  from?: Date
  to?: Date
}

interface DataTableFilterProps<TData> {
  column: Column<TData>
}

export function DataTableFilter<TData>({
  column,
}: DataTableFilterProps<TData>) {
  const columnMeta = column.columnDef.meta as CustomColumnMeta<TData>
  const filterType = columnMeta?.filter?.type
  const filterOptions = columnMeta?.filter?.options

  if (!filterType) return null

  switch (filterType) {
    case 'select':
      return (
        <Select
          value={(column.getFilterValue() as string) ?? ''}
          onValueChange={(value) => column.setFilterValue(value)}
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder={`Filter ${column.id}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {filterOptions?.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'multi-select':
      return (
        <Select
          value={(column.getFilterValue() as string[])?.join(',') ?? ''}
          onValueChange={(value) =>
            column.setFilterValue(value ? value.split(',') : [])
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder={`Filter ${column.id}`} />
          </SelectTrigger>
          <SelectContent>
            {filterOptions?.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'date-range':
      const value = column.getFilterValue() as DateRange
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-[180px] justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {value?.from ? (
                value.to ? (
                  <>
                    {value.from.toLocaleDateString()} -{' '}
                    {value.to.toLocaleDateString()}
                  </>
                ) : (
                  value.from.toLocaleDateString()
                )
              ) : (
                `Filter ${column.id}`
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={value?.from}
              selected={{
                from: value?.from,
                to: value?.to,
              }}
              onSelect={(range: DateRange | undefined) => {
                column.setFilterValue(range)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )

    default:
      return null
  }
}

DataTableFilter.displayName = 'DataTable.Filter'