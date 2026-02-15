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
import { useCallback, useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlusIcon, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  onSelectRow?: (row: TData) => void;
  onAdd?: () => void;
  onEdit?: (row: TData) => void;
  onShowDetail?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  onSelectRow,
  onAdd,
  onShowDetail,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    manualPagination: true,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    router.push(pathname + "?" + createQueryString("page", page.toString()));
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    params.set("page", "1"); // Reset to page 1 on page size change
    router.push(pathname + "?" + params.toString());
  };

  const handleRowClick = useCallback(
    (row: TData) => {
      setSelectedRow(row);
      onSelectRow?.(row);
    },
    [onSelectRow]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!selectedRow) return;

      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const rows = table.getRowModel().rows;
      const currentIndex = rows.findIndex((row) => row.original === selectedRow);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextRow = rows[currentIndex + 1];
        if (nextRow) {
          handleRowClick(nextRow.original);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevRow = rows[currentIndex - 1];
        if (prevRow) {
          handleRowClick(prevRow.original);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRow, table, handleRowClick]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="w-full sm:max-w-sm">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Filter names..."
              value={(table.getColumn("nama_konsumen")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nama_konsumen")?.setFilterValue(event.target.value)
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
          <Button variant={"outline"} onClick={onAdd} className="w-full sm:w-auto">
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-muted-foreground flex flex-col items-center gap-4 text-sm sm:flex-row">
          <span>Total {totalCount} data</span>
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-17.5" aria-label="Pilih jumlah baris per halaman">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Pagination className="mx-0 w-full justify-center sm:w-auto sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-70" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* Simple page indicators */}
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              // Logic to show pages around current page could be added here
              let pageNum = i + 1;
              if (pageCount > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i + 1;
                if (pageNum > pageCount) pageNum = pageCount - (4 - i);
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < pageCount) handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage >= pageCount ? "pointer-events-none opacity-70" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
