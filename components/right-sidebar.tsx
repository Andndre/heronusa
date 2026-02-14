"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface RightSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

export function RightSidebar({
  open,
  onOpenChange,
  title,
  description,
  children,
}: RightSidebarProps) {
  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      open={open}
      onOpenChange={onOpenChange}
      style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
    >
      <SidebarHeader className="h-16 border-b px-4 shrink-0">
        <div className="flex items-center justify-between py-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-none truncate">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 pb-0">{children}</SidebarContent>
    </Sidebar>
  );
}
