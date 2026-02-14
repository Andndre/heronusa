"use client";

import { useEffect, useState } from "react";
import { getProspekData, getDropdownData } from "@/server/prospek";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useRightSidebar } from "@/components/app-sidebar";
import { CreateProspekForm } from "@/components/forms/create-prospek-form";
import { Prospek } from "@/server/prospek";
import RowDetail from "./row-detail";

export function ProspekClientComponent({
  data,
  dropdownData,
}: {
  data: Awaited<ReturnType<typeof getProspekData>>;
  dropdownData: Awaited<ReturnType<typeof getDropdownData>>;
}) {
  const { setContent, setTitle, setDescription, setOpen, open } =
    useRightSidebar();
  const [selectedProspek, setSelectedProspek] = useState<Prospek | null>(null);

  const handleSelectRow = (row: Prospek) => {
    setSelectedProspek(row);
  };

  const handleShowDetail = (row: Prospek) => {
    if (open) {
      setOpen(false);
      return;
    }

    setContent(<RowDetail prospek={row} />);
    setTitle("Detail Prospek");
    setDescription("Informasi lengkap tentang prospek yang dipilih.");
    setOpen(true);
  };

  const handleAdd = () => {
    setContent(
      <CreateProspekForm
        models={dropdownData.models}
        warnas={dropdownData.warnas}
        subSumberProspek={dropdownData.subSumberProspek}
        kelurahans={dropdownData.kelurahans}
      />,
    );
    setTitle("Tambah Prospek");
    setDescription("Isi form untuk menambahkan prospek baru.");
    setOpen(true);
  };

  const handleEdit = (row: Prospek) => {
    // setContent(<ProspekFormView title="Edit Prospek" />);
    setTitle("Edit Prospek");
    setOpen(true);
  };

  // Reset sidebar when unmounting/navigating away
  useEffect(() => {
    return () => {
      setContent(null);
      setOpen(false);
    };
  }, [setContent, setOpen]);

  return (
    <DataTable
      columns={columns}
      data={data}
      onSelectRow={handleSelectRow}
      onShowDetail={handleShowDetail}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}
