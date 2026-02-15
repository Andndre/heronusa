"use client";

import { useState, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { RightSidebarProvider } from "@/components/sidebar-context";

interface AppSidebarProps {
  children: ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const [rightOpen, setRightOpen] = useState(false);
  const [rightContent, setRightContent] = useState<ReactNode | null>(null);
  const [rightTitle, setRightTitle] = useState("");
  const [rightDescription, setRightDescription] = useState("");
  const [rightView, setRightView] = useState("none");

  const handleCloseRightSidebar = () => {
    setRightOpen(false);
    setRightContent(null);
    setRightView("none");
  };

  const rightSidebarValue = {
    open: rightOpen,
    setOpen: setRightOpen,
    content: rightContent,
    setContent: setRightContent,
    title: rightTitle,
    setTitle: setRightTitle,
    description: rightDescription,
    setDescription: setRightDescription,
    view: rightView,
    setView: setRightView,
  };

  return (
    <SidebarProvider>
      <RightSidebarProvider value={rightSidebarValue}>
        <LeftSidebar />
        {children}
        <RightSidebar
          open={rightOpen}
          onOpenChange={(open) => {
            setRightOpen(open);
            if (!open) handleCloseRightSidebar();
          }}
          title={rightTitle}
          description={rightDescription}
        >
          {rightContent}
        </RightSidebar>
      </RightSidebarProvider>
    </SidebarProvider>
  );
}
