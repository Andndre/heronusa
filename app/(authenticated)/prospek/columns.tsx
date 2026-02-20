"use client";

import { Badge } from "@/components/ui/badge";
import { createSortableHeader } from "@/components/table-header-sorted";
import { StatusProspek } from "@/lib/generated/prisma/enums";
import { Prospek } from "@/server/prospek";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  STATUS_PROSPEK_VARIANTS,
  STATUS_FILTER_OPTIONS,
  STICKY_ACTIONS_COLUMN_ID,
} from "@/lib/prospek-shared";

export const getColumns = (): ColumnDef<Prospek>[] => [
  {
    accessorKey: "nama_konsumen",
    header: createSortableHeader<Prospek>("Nama"),
    meta: {
      filterPlaceholder: "Cari nama...",
      filterable: true,
    },
  },
  {
    id: "hp1",
    header: createSortableHeader<Prospek>("No. HP"),
    accessorFn: (row) => `${row.hp1}${row.hp2 ? ", " + row.hp2 : ""}`,
    meta: {
      filterPlaceholder: "Cari no. HP...",
      filterable: true,
    },
  },
  {
    id: "kelurahan",
    accessorFn: (row) => row.kelurahan.nama_kelurahan,
    header: createSortableHeader<Prospek>("Kelurahan"),
    meta: {
      filterPlaceholder: "Cari kelurahan...",
      filterable: true,
    },
  },
  {
    id: "model",
    accessorFn: (row) => row.model.nama_model,
    header: createSortableHeader<Prospek>("Model"),
    meta: {
      filterPlaceholder: "Cari model...",
      filterable: true,
    },
  },
  {
    id: "status",
    header: createSortableHeader<Prospek>("Status"),
    meta: {
      filterPlaceholder: "Semua Status",
      filterable: true,
      filterType: "select",
      filterOptions: STATUS_FILTER_OPTIONS,
    },
    cell: ({ row }) => {
      const status = row.original.status as StatusProspek;
      return (
        <Badge variant={STATUS_PROSPEK_VARIANTS[status] || "outline"}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader<Prospek>("Tanggal Dibuat"),
    meta: {
      filterPlaceholder: "Pilih rentang tanggal",
      filterable: true,
      filterType: "date-range",
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "d/M/yyyy, HH:mm");
    },
  },
  {
    id: STICKY_ACTIONS_COLUMN_ID,
    header: "",
    meta: {
      filterable: false,
    },
    enableSorting: false,
    size: 120, // Width tetap untuk actions column
    cell: () => null, // Placeholder - akan di-override di data-table
  },
];
