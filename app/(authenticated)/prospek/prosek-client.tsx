"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDropdownData } from "@/server/prospek";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useRightSidebar } from "@/components/app-sidebar";
import { CreateProspekForm } from "@/components/forms/create-prospek-form";
import { Prospek } from "@/server/prospek";
import RowDetail from "./row-detail";

export function ProspekClientComponent({
  data,
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  dropdownData,
}: {
  data: Prospek[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  dropdownData: Awaited<ReturnType<typeof getDropdownData>>;
}) {
  const { setContent, setTitle, setDescription, setOpen, open, view, setView } =
    useRightSidebar();
  const [, setSelectedProspek] = useState<Prospek | null>(null);

  const handleSelectRow = useCallback(
    (row: Prospek) => {
      setSelectedProspek(row);
      // If sidebar is open and showing detail, update the content immediately
      if (open && view === "detail") {
        setContent(<RowDetail prospek={row} />);
      }
    },
    [open, view, setContent],
  );

  const handleShowDetail = useCallback(
    (row: Prospek) => {
      if (open && view === "detail") {
        setOpen(false);
        return;
      }

      setContent(<RowDetail prospek={row} />);
      setTitle("Detail Prospek");
      setDescription("Informasi lengkap tentang prospek yang dipilih.");
      setView("detail");
      setOpen(true);
    },
    [open, view, setOpen, setContent, setTitle, setDescription, setView],
  );

  const handleAdd = useCallback(() => {
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
    setView("form");
    setOpen(true);
  }, [dropdownData, setContent, setTitle, setDescription, setView, setOpen]);

  const handleEdit = useCallback(
    (row: Prospek) => {
      // For now, reuse CreateProspekForm or prepare for EditProspekForm
      setContent(
        <CreateProspekForm
          models={dropdownData.models}
          warnas={dropdownData.warnas}
          subSumberProspek={dropdownData.subSumberProspek}
          kelurahans={dropdownData.kelurahans}
        />,
      );
      setTitle(`Edit Prospek: ${row.nama_konsumen}`);
      setDescription("Perbarui informasi prospek.");
      setView("form");
      setOpen(true);
    },
    [dropdownData, setContent, setTitle, setDescription, setView, setOpen],
  );

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onViewDetail: handleShowDetail,
      }),
    [handleEdit, handleShowDetail],
  );

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
      totalCount={totalCount}
      pageCount={pageCount}
      currentPage={currentPage}
      pageSize={pageSize}
      onSelectRow={handleSelectRow}
      onShowDetail={handleShowDetail}
      onAdd={handleAdd}
      onEdit={handleEdit}
    />
  );
}
