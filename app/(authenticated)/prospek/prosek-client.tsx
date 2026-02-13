"use client";

import { useEffect } from "react";
import { getProspekData, getDropdownData } from "@/server/prospek";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ProspekDetailView, ProspekFormView } from "@/components/right-sidebar";
import { useRightSidebar } from "@/components/app-sidebar";
import { CreateProspekForm } from "@/components/forms/create-prospek-form";

export function ProspekClientComponent({
  data,
  dropdownData,
}: {
  data: Awaited<ReturnType<typeof getProspekData>>;
  dropdownData: Awaited<ReturnType<typeof getDropdownData>>;
}) {
  const { setView, setContent, setTitle, setOpen } = useRightSidebar();

  const handleSelectRow = (row: unknown) => {
    setContent(<ProspekDetailView data={row as Record<string, unknown>} />);
    setTitle((row as { name: string }).name || "Detail");
    setView("detail");
    setOpen(true);
  };

  const handleAdd = () => {
    setContent(
      <CreateProspekForm
        models={dropdownData.models}
        warnas={dropdownData.warnas}
        subSumberProspek={dropdownData.subSumberProspek}
        kelurahans={dropdownData.kelurahans}
      />
    );
    setTitle("Tambah Prospek");
    setView("form");
    setOpen(true);
  };

  const handleEdit = (_row: unknown) => {
    setContent(<ProspekFormView title="Edit Prospek" />);
    setTitle("Edit Prospek");
    setView("form");
    setOpen(true);
  };

  // Reset sidebar when unmounting/navigating away
  useEffect(() => {
    return () => {
      setView("none");
      setContent(null);
      setOpen(false);
    };
  }, [setView, setContent, setOpen]);

  return (
    <DataTable
      columns={columns}
      data={data}
      onSelectRow={handleSelectRow}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}
