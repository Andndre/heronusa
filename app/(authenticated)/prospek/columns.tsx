"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSortableHeader } from "@/components/table-header-sorted";
import { StatusProspek } from "@/lib/generated/prisma/enums";
import { Prospek } from "@/server/prospek";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import { STATUS_PROSPEK_VARIANTS, STATUS_FILTER_OPTIONS } from "@/lib/prospek-shared";
import { ProspekActionItems } from "./prospek-action-items";

interface ColumnActions {
  onEdit: (prospek: Prospek) => void;
  onViewDetail: (prospek: Prospek) => void;
  onAddFollowUp: (prospek: Prospek) => void;
}

export const getColumns = ({
  onEdit,
  onViewDetail,
  onAddFollowUp,
}: ColumnActions): ColumnDef<Prospek>[] => [
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
      filterable: false,
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "d/M/yyyy, HH:mm");
    },
  },
  {
    id: "actions",
    header: "Aksi",
    meta: {
      filterable: false,
    },
    cell: ({ row }) => {
      const prospek = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <ProspekActionItems
              prospek={prospek}
              onEdit={onEdit}
              onViewDetail={onViewDetail}
              onAddFollowUp={onAddFollowUp}
              ActionItem={DropdownMenuItem}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
