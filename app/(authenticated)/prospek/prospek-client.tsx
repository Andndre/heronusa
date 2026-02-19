"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDropdownData } from "@/server/prospek";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useRightSidebar } from "@/components/sidebar-context";
import { CreateProspekForm } from "@/components/forms/create-prospek-form";
import { EditProspekForm } from "@/components/forms/edit-prospek-form";
import { CreateFollowUpForm } from "@/components/forms/create-followup-form";
import { Prospek } from "@/server/prospek";
import RowDetail from "./row-detail";
import { ProspekActionItems } from "./prospek-action-items";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlusIcon } from "lucide-react";

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
  }, [selectedProspek?.id, open, view, setContent, selectedProspek]);

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

  const handleAddFollowUp = useCallback(
    (row: Prospek) => {
      setSelectedProspek(row);
      setContent(<CreateFollowUpForm key={row.id} prospekId={row.id} />);
      setTitle("Tambah Follow-Up");
      setDescription("Catat aktivitas follow-up untuk prospek ini.");
      setView("form");
      setOpen(true);
    },
    [setContent, setTitle, setDescription, setView, setOpen]
  );

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onViewDetail: handleShowDetail,
        onAddFollowUp: handleAddFollowUp,
      }),
    [handleEdit, handleShowDetail, handleAddFollowUp]
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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold sm:text-2xl">Manajemen Prospek</h1>
          <p className="text-sm text-gray-500">
            Kelola prospek penjualan dan aktivitas tindak lanjut
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!handleShowDetail || !selectedProspek}
            onClick={() => selectedProspek && handleShowDetail(selectedProspek)}
            title="Lihat Detail"
            className="size-10 shrink-0"
          >
            <InfoIcon className="size-5" />
          </Button>
          <Button onClick={handleAdd} className="shrink-0">
            <PlusIcon className="size-5" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        totalCount={totalCount}
        pageCount={pageCount}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedRow={selectedProspek}
        onSelectRow={handleSelectRow}
        renderRowActions={(row) => (
          <ProspekActionItems
            prospek={row}
            onEdit={handleEdit}
            onViewDetail={handleShowDetail}
            onAddFollowUp={handleAddFollowUp}
            ActionItem={ContextMenuItem}
          />
        )}
        shouldFocusSearch={shouldFocusSearch}
        initialQuery={initialQuery}
      />
    </div>
  );
}
