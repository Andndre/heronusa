"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Hook standar untuk mendeteksi hidrasi di React 19.
 * Menggunakan useSyncExternalStore untuk menghindari cascading renders.
 */
const noop = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const hasMounted = useHasMounted();

  // Tampilan skeleton saat proses hidrasi (SSR)
  if (!hasMounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-muted h-5 w-8 animate-pulse rounded-full" />
        <div className="bg-muted h-4 w-10 animate-pulse rounded" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {isDark ? (
          <Moon className="text-muted-foreground h-4 w-4" />
        ) : (
          <Sun className="text-muted-foreground h-4 w-4" />
        )}
        <Label htmlFor="theme-switch" className="cursor-pointer text-sm font-medium">
          Tema {isDark ? "Gelap" : "Terang"}
        </Label>
      </div>
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Ganti tema"
      />
    </div>
  );
}
