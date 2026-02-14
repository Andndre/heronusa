"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlusIcon, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSelectRow?: (row: TData) => void;
  onAdd?: () => void;
  onEdit?: (row: TData) => void;
  onShowDetail?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSelectRow,
  onAdd,
  onEdit,
  onShowDetail,
}: DataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleRowClick = (row: TData) => {
    setSelectedRow(row);
    onSelectRow?.(row);
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4 gap-3">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Filter names..."
              value={
                (table
                  .getColumn("nama_konsumen")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("nama_konsumen")
                  ?.setFilterValue(event.target.value)
              }
            />
          </InputGroup>
          {onShowDetail && (
            <Button
              variant="outline"
              size="icon"
              disabled={!selectedRow}
              onClick={() => selectedRow && onShowDetail(selectedRow)}
              title="Lihat Detail"
            >
              <InfoIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {onAdd && (
          <Button variant={"outline"} onClick={onAdd}>
            <PlusIcon /> Tambah
          </Button>
        )}
      </div>
      <div className="overflow-x-auto rounded-md border">
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowData = row.original;
                const isSelected = selectedRow === rowData;
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected && "selected"}
                    className={isSelected ? "bg-muted/50" : "cursor-pointer"}
                    onClick={() => onSelectRow && handleRowClick(rowData)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
