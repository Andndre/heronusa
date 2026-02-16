"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Home, Plus, Users, FileText } from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
}

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalCommandDialog({ open, onOpenChange }: CommandDialogProps) {
  const router = useRouter();

  const commands: Command[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Dashboard",
      icon: Home,
      action: () => router.push("/"),
      keywords: ["dashboard", "home", "beranda"],
    },
    {
      id: "nav-prospek",
      label: "Manajemen Prospek",
      icon: Users,
      action: () => router.push("/prospek?action=focus"),
      keywords: ["prospek", "lead", "leads"],
    },
    {
      id: "nav-spk",
      label: "Ke SPK & Diskon",
      icon: FileText,
      action: () => router.push("/spk"),
      keywords: ["spk", "diskon", "sales"],
    },
    // Actions
    {
      id: "action-create-prospek",
      label: "Buat Prospek Baru",
      icon: Plus,
      action: () => {
        // Use query param to trigger the create form
        router.push("/prospek?action=create");
      },
      keywords: ["baru", "tambah", "create", "new", "prospek"],
    },
  ];

  const handleCommandSelect = (command: Command) => {
    command.action();
    onOpenChange(false);
  };

  const navigationCommands = commands.filter((c) => c.id.startsWith("nav-"));
  const actionCommands = commands.filter((c) => c.id.startsWith("action-"));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ketik perintah atau cari..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
        {navigationCommands.length > 0 && (
          <CommandGroup heading="Navigasi">
            {navigationCommands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleCommandSelect(command)}
                keywords={command.keywords}
              >
                <command.icon className="mr-2 h-4 w-4" />
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {actionCommands.length > 0 && (
          <CommandGroup heading="Aksi">
            {actionCommands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleCommandSelect(command)}
                keywords={command.keywords}
              >
                <command.icon className="mr-2 h-4 w-4" />
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

// Hook for keyboard shortcut
export function useCommandShortcut(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
}
