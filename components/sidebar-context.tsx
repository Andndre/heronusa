"use client";

import { createContext, useContext, ReactNode } from "react";

interface SidebarItem {
  id: string;
  title: string;
  description: string;
  content: ReactNode | null;
}

interface RightSidebarContextProps {
  // Stack-based state
  sidebarStack: SidebarItem[];

  // Stack operations
  pushSidebar: (item: Omit<SidebarItem, "id">) => string; // Returns ID
  popSidebar: () => void;
  closeSidebar: (id: string) => void;
  replaceTopSidebar: (item: Omit<SidebarItem, "id">) => void; // Replace top of stack

  // Pending submission tracking
  hasPendingSubmissions: boolean;
  markPendingSubmission: (id: string) => void;
  clearPendingSubmission: (id: string) => void;

  // Convenience (for backward compatibility)
  open: boolean;
  content: ReactNode | null;
  title: string;
  description: string;
  view: string;
  setOpen: (open: boolean) => void;
  setContent: (content: ReactNode | null) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setView: (view: string) => void;
}

const RightSidebarContext = createContext<RightSidebarContextProps | null>(null);

export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error("useRightSidebar must be used within AppSidebarProvider.");
  }
  return context;
}

interface RightSidebarProviderProps {
  children: ReactNode;
  value: RightSidebarContextProps;
}

export function RightSidebarProvider({ children, value }: RightSidebarProviderProps) {
  return <RightSidebarContext.Provider value={value}>{children}</RightSidebarContext.Provider>;
}
