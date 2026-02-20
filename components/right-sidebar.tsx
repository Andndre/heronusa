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

interface SidebarItem {
  id: string;
  title: string;
  description: string;
  content: ReactNode | null;
}

interface RightSidebarProps {
  sidebarStack: SidebarItem[];
  onOpenChange: (open: boolean) => void;
  onClose: (id: string) => void;
}

function RightSidebarDesktop({ sidebarStack, onClose }: RightSidebarProps) {
  if (sidebarStack.length === 0) return null;

  return (
    <>
      {sidebarStack.map((item, index) => {
        // Calculate offset from the END of the stack (newest sidebars on the right)
        // index 0 (oldest) → largest offset (leftmost)
        // index N-1 (newest) → smallest offset (rightmost)
        const offsetFromLeft = (sidebarStack.length - 1 - index) * 40;
        const zIndex = 50 + index; // Higher index = higher z-index
        const isOpen = index === sidebarStack.length - 1; // Top of stack is "open"
        // All sidebars have same width, only position shifts
        const width = "20rem"; // Fixed width for all sidebars

        return (
          <div
            key={item.id}
            className={cn(
              "fixed top-14 md:block",
              "bg-background border-l shadow-lg",
              "transition-transform duration-200 ease-in-out",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
            style={{
              right: offsetFromLeft,
              zIndex,
              width,
              height: "calc(100dvh - 3.5rem)",
            }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="h-20 shrink-0 border-b px-4">
                <div className="flex h-full items-center justify-between py-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg leading-none font-semibold">{item.title}</h2>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {item.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => onClose(item.id)}
                    aria-label="Tutup Sidebar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">{item.content}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// Nested sheet renderer for mobile
function NestedSheets({ items, onClose }: { items: SidebarItem[]; onClose: (id: string) => void }) {
  if (items.length === 0) return null;

  const [current, ...rest] = items;

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose(current.id)}>
      <SheetContent side="right" className="w-full p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="h-16 shrink-0 border-b px-4">
            <div className="flex h-full items-center py-2">
              <div className="min-w-0 flex-1 pr-8">
                <SheetTitle className="truncate text-lg leading-none font-semibold">
                  {current.title}
                </SheetTitle>
                <SheetDescription className="mt-1 truncate text-sm">
                  {current.description}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">{current.content}</div>
        </div>

        {/* Nested sheet for rest of stack */}
        {rest.length > 0 && <NestedSheets items={rest} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function RightSidebarMobile({ sidebarStack, onClose }: RightSidebarProps) {
  if (sidebarStack.length === 0) return null;

  return <NestedSheets items={sidebarStack} onClose={onClose} />;
}

export function RightSidebar(props: RightSidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <RightSidebarMobile {...props} />;
  }

  return <RightSidebarDesktop {...props} />;
}
