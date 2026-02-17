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

import { STATUS_PROSPEK_VARIANTS } from "@/lib/prospek-shared";
import { ProspekActionItems } from "./prospek-action-items";

interface ColumnActions {
  onEdit: (prospek: Prospek) => void;
  onViewDetail: (prospek: Prospek) => void;
}

export const getColumns = ({ onEdit, onViewDetail }: ColumnActions): ColumnDef<Prospek>[] => [
  {
    accessorKey: "nama_konsumen",
    header: createSortableHeader<Prospek>("Nama"),
  },
  {
    id: "hp1",
    header: createSortableHeader<Prospek>("No. HP"),
    accessorFn: (row) => `${row.hp1}${row.hp2 ? ", " + row.hp2 : ""}`,
  },
  {
    id: "kelurahan",
    accessorFn: (row) => row.kelurahan.nama_kelurahan,
    header: createSortableHeader<Prospek>("Kelurahan"),
  },
  {
    id: "model",
    accessorFn: (row) => row.model.nama_model,
    header: createSortableHeader<Prospek>("Model"),
  },
  {
    id: "status",
    header: createSortableHeader<Prospek>("Status"),
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "d/M/yyyy, HH:mm");
    },
  },
  {
    id: "actions",
    header: "Aksi",
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
              ActionItem={DropdownMenuItem}
            />
          </DropdownMenuContent>
          {/* <DropdownMenuSeparator /> */}
        </DropdownMenu>
      );
    },
  },
];
