import { BadgeProps } from "@/components/ui/badge";
import { StatusProspek } from "@/lib/generated/prisma/enums";

export const STATUS_PROSPEK_VARIANTS: Record<string, BadgeProps["variant"]> = {
  DEAL: "default",
  SPK: "default",
  BARU: "secondary",
  GUGUR: "destructive",
};

export const KATEGORI_PROSPEK_VARIANTS: Record<string, BadgeProps["variant"]> = {
  HOT: "destructive",
  WARM: "default",
  COLD: "secondary",
};

// Shared type for column filter metadata
export type ColumnFilterMeta = {
  filterPlaceholder?: string;
  filterable?: boolean;
  filterType?: "text" | "select";
  filterOptions?: Array<{ label: string; value: string }>;
};

// Status filter options (shared between columns and server)
export const STATUS_FILTER_OPTIONS = [
  { label: "Semua Status", value: "ALL" },
  { label: "Baru", value: "BARU" },
  { label: "Follow Up", value: "FOLLOW_UP" },
  { label: "Pengajuan Leasing", value: "PENGAJUAN_LEASING" },
  { label: "Deal", value: "DEAL" },
  { label: "SPK", value: "SPK" },
  { label: "Faktur", value: "FAKTUR" },
  { label: "Gugur", value: "GUGUR" },
] as const;

// Extract valid status values for server-side validation
export const VALID_STATUS_VALUES = STATUS_FILTER_OPTIONS.map((opt) => opt.value).filter(
  (v) => v !== "ALL"
) as StatusProspek[];
