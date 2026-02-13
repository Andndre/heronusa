"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSortableHeader } from "@/components/table-header-sorted";
import { StatusProspek } from "@/lib/generated/prisma/enums";
import { Prospek } from "@/server/prospek";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Prospek>[] = [
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
        <Badge>
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
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View prospek details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
