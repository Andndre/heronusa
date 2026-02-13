"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const RIGHT_SIDEBAR_WIDTH = "24rem";

export type RightSidebarView = "detail" | "form" | "none";

interface RightSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view: RightSidebarView;
  title?: string;
  children: ReactNode;
}

export function RightSidebar({
  open,
  onOpenChange,
  view,
  title = "Detail",
  children,
}: RightSidebarProps) {
  const isMobile = useIsMobile();

  if (view === "none") {
    return null;
  }

  // Mobile: use Sheet (overlay)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full max-w-sm p-0">
          <SheetHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {view === "form" ? "Form" : title}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {view === "form" ? "Isi form di bawah" : "Informasi detail"}
                </p>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: fixed sidebar with spacer
  return (
    <div className="relative flex h-full">
      {/* Spacer/reserved space on right */}
      <div
        className={cn(
          "relative bg-transparent transition-[width] duration-200 ease-linear",
          open ? "w-(--right-sidebar-width)" : "w-0",
        )}
        style={
          {
            "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH,
          } as React.CSSProperties
        }
      />

      {/* Fixed sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-20 flex h-full w-(--right-sidebar-width) flex-col border-l bg-background transition-[right,width] duration-200 ease-linear",
          open ? "right-0" : "right-[calc(var(--right-sidebar-width)*-1)]",
        )}
        style={
          {
            "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH,
          } as React.CSSProperties
        }
      >
        {/* Header - same height as navbar (h-16) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div>
            <h2 className="text-lg font-semibold">
              {view === "form" ? "Form" : title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {view === "form" ? "Isi form di bawah" : "Informasi detail"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

// Example content components for different views
interface DetailViewProps {
  data?: Record<string, unknown>;
}

export function DetailViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProspekDetailView({ data }: DetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Nama</p>
        <p className="text-base">{(data?.name as string) || "-"}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Email</p>
        <p className="text-base">{(data?.email as string) || "-"}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Telepon</p>
        <p className="text-base">{(data?.phone as string) || "-"}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <p className="text-base">{(data?.status as string) || "-"}</p>
      </div>
    </div>
  );
}

interface FormViewProps {
  title?: string;
}

export function ProspekFormView({ title = "Tambah Prospek" }: FormViewProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nama *</label>
        <input
          type="text"
          placeholder="Masukkan nama"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Masukkan email"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Telepon</label>
        <input
          type="tel"
          placeholder="Masukkan nomor telepon"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <option value="">Pilih status</option>
          <option value="baru">Baru</option>
          <option value="kontak">Kontak</option>
          <option value="deal">Deal</option>
        </select>
      </div>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={() => {}}>
          Batal
        </Button>
        <Button className="flex-1" onClick={() => {}}>
          Simpan
        </Button>
      </div>
    </div>
  );
}
