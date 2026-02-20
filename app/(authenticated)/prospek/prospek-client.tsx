"use client";

import { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import React from "react";
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
  const { pushSidebar, popSidebar, sidebarStack, replaceTopSidebar, hasPendingSubmissions } =
    useRightSidebar();
  const [selectedProspek, setSelectedProspek] = useState<Prospek | null>(null);
  // Defer the selected prospek to prevent rapid updates during spam clicks
  // React will batch updates and only use the deferred value when it's stable
  const deferredSelectedProspek = useDeferredValue(selectedProspek);
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

  const handleSelectRow = useCallback((row: Prospek) => {
    // Debounce row selection to prevent rate limiting
    // Only update if different row
    setSelectedProspek((prev) => {
      if (prev?.id === row.id) {
        return prev; // Same row, don't update
      }
      return row;
    });
  }, []);

  const handleShowDetail = useCallback(
    (row: Prospek) => {
      // Check if the top sidebar is already showing this prospek's detail
      // We use the key prop to identify
      const topSidebar = sidebarStack[sidebarStack.length - 1];
      const isAlreadyShowing =
        React.isValidElement(topSidebar?.content) && topSidebar.content.key === row.id;

      if (isAlreadyShowing) {
        // Close the topmost sidebar
        popSidebar();
        return;
      }

      setSelectedProspek(row);
      // If there's already a sidebar open, replace it (unless there's a pending submission)
      if (sidebarStack.length > 0 && !hasPendingSubmissions) {
        replaceTopSidebar({
          title: "Detail Prospek",
          description: "Informasi lengkap tentang prospek yang dipilih.",
          content: <RowDetail key={row.id} prospekId={row.id} prospekData={row} />,
        });
      } else {
        pushSidebar({
          title: "Detail Prospek",
          description: "Informasi lengkap tentang prospek yang dipilih.",
          content: <RowDetail key={row.id} prospekId={row.id} prospekData={row} />,
        });
      }
    },
    [sidebarStack, popSidebar, pushSidebar, replaceTopSidebar, hasPendingSubmissions]
  );

  // Sync sidebar content when selectedProspek changes and the top sidebar is showing detail
  useEffect(() => {
    // Use deferred value to prevent rapid updates during spam clicks
    const prospekToUpdate = deferredSelectedProspek;
    if (!prospekToUpdate) return;

    const topSidebar = sidebarStack[sidebarStack.length - 1];
    if (!topSidebar) return;

    // Check if top sidebar is a detail sidebar by checking the title
    const isDetailSidebar = topSidebar.title === "Detail Prospek";

    // Only update if the top sidebar is detail AND it's showing a different prospek
    if (isDetailSidebar && !hasPendingSubmissions) {
      // Try to extract prospekId from the content element
      if (React.isValidElement(topSidebar.content)) {
        const content = topSidebar.content;
        const props = content.props as { prospekId?: string } | undefined;
        const currentProspekId = props?.prospekId;

        if (currentProspekId && currentProspekId !== prospekToUpdate.id) {
          // Replace with new prospek detail (pass full data to avoid refetch)
          replaceTopSidebar({
            title: "Detail Prospek",
            description: "Informasi lengkap tentang prospek yang dipilih.",
            content: (
              <RowDetail
                key={prospekToUpdate.id}
                prospekId={prospekToUpdate.id}
                prospekData={prospekToUpdate}
              />
            ),
          });
        }
      }
    }
  }, [deferredSelectedProspek, sidebarStack, hasPendingSubmissions, replaceTopSidebar]);

  const handleAdd = useCallback(() => {
    // If there's already a sidebar open, replace it (unless there's a pending submission)
    if (sidebarStack.length > 0 && !hasPendingSubmissions) {
      replaceTopSidebar({
        title: "Tambah Prospek",
        description: "Isi form untuk menambahkan prospek baru.",
        content: (
          <CreateProspekForm
            models={dropdownData.models}
            warnas={dropdownData.warnas}
            subSumberProspek={dropdownData.subSumberProspek}
            kelurahans={dropdownData.kelurahans}
            onSuccess={() => router.refresh()}
          />
        ),
      });
    } else {
      pushSidebar({
        title: "Tambah Prospek",
        description: "Isi form untuk menambahkan prospek baru.",
        content: (
          <CreateProspekForm
            models={dropdownData.models}
            warnas={dropdownData.warnas}
            subSumberProspek={dropdownData.subSumberProspek}
            kelurahans={dropdownData.kelurahans}
            onSuccess={() => router.refresh()}
          />
        ),
      });
    }
  }, [
    dropdownData,
    pushSidebar,
    replaceTopSidebar,
    router,
    sidebarStack.length,
    hasPendingSubmissions,
  ]);

  const handleEdit = useCallback(
    (row: Prospek) => {
      setSelectedProspek(row);
      // If there's already a sidebar open, replace it (unless there's a pending submission)
      if (sidebarStack.length > 0 && !hasPendingSubmissions) {
        replaceTopSidebar({
          title: `Edit Prospek: ${row.nama_konsumen}`,
          description: "Perbarui informasi prospek.",
          content: (
            <EditProspekForm
              key={row.id}
              prospek={row}
              models={dropdownData.models}
              warnas={dropdownData.warnas}
              subSumberProspek={dropdownData.subSumberProspek}
              kelurahans={dropdownData.kelurahans}
              onSuccess={() => router.refresh()}
            />
          ),
        });
      } else {
        pushSidebar({
          title: `Edit Prospek: ${row.nama_konsumen}`,
          description: "Perbarui informasi prospek.",
          content: (
            <EditProspekForm
              key={row.id}
              prospek={row}
              models={dropdownData.models}
              warnas={dropdownData.warnas}
              subSumberProspek={dropdownData.subSumberProspek}
              kelurahans={dropdownData.kelurahans}
              onSuccess={() => router.refresh()}
            />
          ),
        });
      }
    },
    [
      dropdownData,
      pushSidebar,
      replaceTopSidebar,
      router,
      sidebarStack.length,
      hasPendingSubmissions,
    ]
  );

  const handleAddFollowUp = useCallback(
    (row: Prospek) => {
      setSelectedProspek(row);
      // If there's already a sidebar open, replace it (unless there's a pending submission)
      if (sidebarStack.length > 0 && !hasPendingSubmissions) {
        replaceTopSidebar({
          title: "Tambah Follow-Up",
          description: "Catat aktivitas follow-up untuk prospek ini.",
          content: <CreateFollowUpForm key={row.id} prospekId={row.id} />,
        });
      } else {
        pushSidebar({
          title: "Tambah Follow-Up",
          description: "Catat aktivitas follow-up untuk prospek ini.",
          content: <CreateFollowUpForm key={row.id} prospekId={row.id} />,
        });
      }
    },
    [pushSidebar, replaceTopSidebar, sidebarStack.length, hasPendingSubmissions]
  );

  const columns = useMemo(() => getColumns(), []);

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
          <Button onClick={handleAdd} className="shrink-0">
            <PlusIcon className="size-5" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
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
            asIconButtons
          />
        )}
        renderContextMenuActions={(row) => (
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
