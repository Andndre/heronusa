"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface RightSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

function RightSidebarDesktop({
  open,
  onOpenChange,
  title,
  description,
  children,
}: RightSidebarProps) {
  return (
    <div
      className={cn(
        "fixed top-14 right-0 z-50 hidden h-[calc(100dvh-3.5rem)] w-2xs md:block",
        "bg-background border-l shadow-lg",
        "transition-transform duration-200 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="h-16 shrink-0 border-b px-4">
          <div className="flex h-full items-center justify-between py-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg leading-none font-semibold">{title}</h2>
              <p className="text-muted-foreground mt-1 truncate text-sm">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => onOpenChange(false)}
              aria-label="Tutup Sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function RightSidebarMobile({
  open,
  onOpenChange,
  title,
  description,
  children,
}: RightSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="h-16 shrink-0 border-b px-4">
            <div className="flex h-full items-center py-2">
              <div className="min-w-0 flex-1 pr-8">
                <SheetTitle className="truncate text-lg leading-none font-semibold">
                  {title}
                </SheetTitle>
                <SheetDescription className="mt-1 truncate text-sm">{description}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function RightSidebar(props: RightSidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <RightSidebarMobile {...props} />;
  }

  return <RightSidebarDesktop {...props} />;
}
