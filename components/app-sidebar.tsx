"use client";

import { useState, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { RightSidebarProvider } from "@/components/sidebar-context";

interface AppSidebarProps {
  children: ReactNode;
}

interface SidebarItem {
  id: string;
  title: string;
  description: string;
  content: ReactNode | null;
}

export function AppSidebar({ children }: AppSidebarProps) {
  // Stack-based sidebar state for supporting multiple stacked sidebars
  const [sidebarStack, setSidebarStack] = useState<SidebarItem[]>([]);
  // Track pending submissions - sidebar IDs that are waiting for server response
  const [pendingSubmissionIds, setPendingSubmissionIds] = useState<Set<string>>(new Set());

  // Convenience getters for backward compatibility
  const currentSidebar = sidebarStack[sidebarStack.length - 1];

  const pushSidebar = (item: Omit<SidebarItem, "id">) => {
    const id = crypto.randomUUID();
    setSidebarStack((prev) => [...prev, { ...item, id }]);
    return id;
  };

  const popSidebar = () => {
    setSidebarStack((prev) => prev.slice(0, -1));
  };

  const closeSidebar = (id: string) => {
    setSidebarStack((prev) => prev.filter((item) => item.id !== id));
    setPendingSubmissionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const replaceTopSidebar = (item: Omit<SidebarItem, "id">) => {
    const id = crypto.randomUUID();
    setSidebarStack((prev) => {
      if (prev.length === 0) {
        return [{ ...item, id }];
      }
      // Replace the top item
      return [...prev.slice(0, -1), { ...item, id }];
    });
  };

  const markPendingSubmission = (id: string) => {
    setPendingSubmissionIds((prev) => new Set(prev).add(id));
  };

  const clearPendingSubmission = (id: string) => {
    setPendingSubmissionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleCloseRightSidebar = () => {
    setSidebarStack([]);
  };

  const rightSidebarValue = {
    // Stack-based state
    sidebarStack,

    // Stack operations
    pushSidebar,
    popSidebar,
    closeSidebar,
    replaceTopSidebar,

    // Pending submission tracking
    hasPendingSubmissions: pendingSubmissionIds.size > 0,
    markPendingSubmission,
    clearPendingSubmission,

    // Convenience (for backward compatibility)
    open: sidebarStack.length > 0,
    content: currentSidebar?.content ?? null,
    title: currentSidebar?.title ?? "",
    description: currentSidebar?.description ?? "",
    view: currentSidebar ? "form" : "none",

    // Legacy setters (no-ops for backward compatibility)
    setOpen: (open: boolean) => {
      if (!open) handleCloseRightSidebar();
    },
    setContent: () => {},
    setTitle: () => {},
    setDescription: () => {},
    setView: () => {},
  };

  return (
    <SidebarProvider>
      <RightSidebarProvider value={rightSidebarValue}>
        <LeftSidebar />
        {children}
        <RightSidebar
          sidebarStack={sidebarStack}
          onOpenChange={(open) => {
            if (!open) popSidebar();
          }}
          onClose={closeSidebar}
        />
      </RightSidebarProvider>
    </SidebarProvider>
  );
}
