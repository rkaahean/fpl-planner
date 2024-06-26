"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Updater } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  name: string;
  isFilterable: boolean;
  isPaginated?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  name,
  isFilterable,
  isPaginated = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

  // Custom row selection change handler to enforce max of 2 selected rows
  const handleRowSelectionChange = (
    updaterOrValue: Updater<RowSelectionState, RowSelectionState>
  ) => {
    // Calculate new selection state
    const newRowSelection =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelection)
        : updaterOrValue;
    const newSelectedRowIds = Object.keys(newRowSelection);

    if (newSelectedRowIds.length > 2) {
      // Maintain selection order to remove the oldest selected row
      const newSelectionOrder = [
        ...selectionOrder,
        ...newSelectedRowIds.filter((id) => !selectionOrder.includes(id)),
      ];
      const oldestSelectedId = newSelectionOrder.shift(); // Remove the oldest selected row ID
      const updatedSelection = { ...newRowSelection };
      delete updatedSelection[oldestSelectedId!];

      // Update state
      setRowSelection(updatedSelection);
      setSelectionOrder(newSelectionOrder);
    } else {
      setRowSelection(newRowSelection);
      setSelectionOrder((prevOrder) => [
        ...prevOrder,
        ...newSelectedRowIds.filter((id) => !prevOrder.includes(id)),
      ]);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters, rowSelection },
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        element_type: false,
      },
    },
  });

  return (
    <div>
      {isFilterable && (
        <div className="flex items-center pb-1 gap-2">
          <Input
            placeholder={`Filter ${name}...`}
            value={
              (table.getColumn("web_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("web_name")?.setFilterValue(event.target.value)
            }
            className="w-1/2 max-w-sm"
          />
          <ToggleGroup
            type="single"
            onValueChange={(value) => {
              const column = table.getColumn("element_type")!;
              column.setFilterValue(null);

              if (value) {
                column.setFilterValue(value);
              }
            }}
          >
            <ToggleGroupItem value="1">GK</ToggleGroupItem>
            <ToggleGroupItem value="2">DEF</ToggleGroupItem>
            <ToggleGroupItem value="3">MID</ToggleGroupItem>
            <ToggleGroupItem value="4">FWD</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    const isSelected = row.getIsSelected();
                    row.toggleSelected(!isSelected);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPaginated && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
