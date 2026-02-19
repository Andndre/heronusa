"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Loader2, Search } from "lucide-react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  selectedRow?: TData | null;
  onSelectRow: (row: TData) => void;
  renderRowActions: (row: TData) => React.ReactNode;
  shouldFocusSearch?: boolean;
  initialQuery?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  selectedRow: propSelectedRow,
  onSelectRow,
  renderRowActions,
  shouldFocusSearch,
  initialQuery = "",
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [internalSelectedRow, setInternalSelectedRow] = useState<TData | null>(null);

  const selectedRow = propSelectedRow !== undefined ? propSelectedRow : internalSelectedRow;

  // Focus search input when shouldFocusSearch is true
  useEffect(() => {
    if (shouldFocusSearch) {
      searchInputRef.current?.focus();
    }
  }, [shouldFocusSearch]);

  // Sync state with URL param (handle browser navigation)
  useEffect(() => {
    setSearchValue(initialQuery);
  }, [initialQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (currentQ !== searchValue) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
          params.set("q", searchValue);
        } else {
          params.delete("q");
        }
        params.set("page", "1");
        startTransition(() => {
          router.push(pathname + "?" + params.toString());
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, pathname, router]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    state: {
      sorting,
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
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("page", page.toString()));
    });
  };

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", value);
    params.set("page", "1"); // Reset to page 1 on page size change
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  };

  const handleRowClick = useCallback(
    (row: TData) => {
      if (propSelectedRow === undefined) {
        setInternalSelectedRow(row);
      }
      onSelectRow(row);
    },
    [onSelectRow, propSelectedRow]
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
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="w-full sm:max-w-2xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            ref={searchInputRef}
            placeholder="Cari prospek..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </InputGroup>
        <div className="flex items-center justify-end gap-2">
          <span className="text-muted-foreground text-sm">Baris:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]" aria-label="Pilih jumlah baris per halaman">
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
      <div className="relative overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
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
                    <ContextMenu key={row.id}>
                      <ContextMenuTrigger asChild>
                        <TableRow
                          data-state={isSelected && "selected"}
                          className={isSelected ? "bg-muted/50" : "cursor-pointer"}
                          onClick={() => handleRowClick(rowData)}
                          onContextMenu={() => handleRowClick(rowData)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-48">
                        <ContextMenuLabel>Aksi</ContextMenuLabel>
                        {renderRowActions(rowData)}
                      </ContextMenuContent>
                    </ContextMenu>
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
        {isPending && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
      <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        {/* <span>Total {totalCount} data</span> */}
        <span>
          Menampilkan {table.getRowModel().rows.length} dari {totalCount} data
        </span>
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
