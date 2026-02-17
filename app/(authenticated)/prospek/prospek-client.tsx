"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDropdownData } from "@/server/prospek";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useRightSidebar } from "@/components/sidebar-context";
import { CreateProspekForm } from "@/components/forms/create-prospek-form";
import { EditProspekForm } from "@/components/forms/edit-prospek-form";
import { Prospek } from "@/server/prospek";
import RowDetail from "./row-detail";
import { ProspekActionItems } from "./prospek-action-items";
import { ContextMenuItem } from "@/components/ui/context-menu";

export function ProspekClientComponent({
  data,
  totalCount,
  pageCount,
  currentPage,
  pageSize,
  dropdownData,
  initialQuery,
}: {
  data: Prospek[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  dropdownData: Awaited<ReturnType<typeof getDropdownData>>;
  initialQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setContent, setTitle, setDescription, setOpen, open, view, setView } = useRightSidebar();
  const [selectedProspek, setSelectedProspek] = useState<Prospek | null>(null);

  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

  const handleSelectRow = useCallback((row: Prospek) => {
    setSelectedProspek(row);
  }, []);

  const handleShowDetail = useCallback(
    (row: Prospek) => {
      if (open && view === "detail" && row.id === selectedProspek?.id) {
        setOpen(false);
        return;
      }

      setSelectedProspek(row);
      setTitle("Detail Prospek");
      setDescription("Informasi lengkap tentang prospek yang dipilih.");
      setView("detail");
      setOpen(true);
    },
    [open, view, setOpen, setTitle, setDescription, setView, selectedProspek?.id]
  );

  // Sync sidebar content when selectedProspek changes and view is detail
  useEffect(() => {
    if (open && view === "detail" && selectedProspek) {
      setContent(<RowDetail key={selectedProspek.id} prospekId={selectedProspek.id} />);
    }
  }, [selectedProspek?.id, open, view, setContent]);

  const handleAdd = useCallback(() => {
    setContent(
      <CreateProspekForm
        models={dropdownData.models}
        warnas={dropdownData.warnas}
        subSumberProspek={dropdownData.subSumberProspek}
        kelurahans={dropdownData.kelurahans}
      />
    );
    setTitle("Tambah Prospek");
    setDescription("Isi form untuk menambahkan prospek baru.");
    setView("form");
    setOpen(true);
  }, [dropdownData, setContent, setTitle, setDescription, setView, setOpen]);

  const handleEdit = useCallback(
    (row: Prospek) => {
      setSelectedProspek(row);
      setContent(
        <EditProspekForm
          key={row.id}
          prospek={row}
          models={dropdownData.models}
          warnas={dropdownData.warnas}
          subSumberProspek={dropdownData.subSumberProspek}
          kelurahans={dropdownData.kelurahans}
        />
      );
      setTitle(`Edit Prospek: ${row.nama_konsumen}`);
      setDescription("Perbarui informasi prospek.");
      setView("form");
      setOpen(true);
    },
    [dropdownData, setContent, setTitle, setDescription, setView, setOpen]
  );

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onViewDetail: handleShowDetail,
      }),
    [handleEdit, handleShowDetail]
  );

  useEffect(() => {
    const action = searchParams.get("action");

    if (action === "create") {
      handleAdd();
      router.replace("/prospek", { scroll: false });
    } else if (action === "focus") {
      setTimeout(() => setShouldFocusSearch(true), 0);
      router.replace("/prospek", { scroll: false });
    }
  }, [searchParams, handleAdd, router]);

  // Reset focus state after it's been triggered
  useEffect(() => {
    if (shouldFocusSearch) {
      const timer = setTimeout(() => {
        setShouldFocusSearch(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldFocusSearch]);

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
      selectedRow={selectedProspek}
      onSelectRow={handleSelectRow}
      onShowDetail={handleShowDetail}
      onAdd={handleAdd}
      renderRowActions={(row) => (
        <ProspekActionItems
          prospek={row}
          onEdit={handleEdit}
          onViewDetail={handleShowDetail}
          ActionItem={ContextMenuItem}
        />
      )}
      shouldFocusSearch={shouldFocusSearch}
      initialQuery={initialQuery}
    />
  );
}
