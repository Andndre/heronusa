import { BadgeProps } from "@/components/ui/badge";

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
