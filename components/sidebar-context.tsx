"use client";

import { createContext, useContext, ReactNode } from "react";

interface RightSidebarContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  view: string;
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
