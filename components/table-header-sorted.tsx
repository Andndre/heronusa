import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

export function createSortableHeader<TData>(label: string) {
  const SortableHeader = ({ column }: { column: Column<TData, unknown> }) => {
    return (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {label}
        {column.getIsSorted() ? (
          column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : null}
      </Button>
    );
  };

  SortableHeader.displayName = `SortableHeader(${label})`;

  return SortableHeader;
}
