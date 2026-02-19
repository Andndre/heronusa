"use client";

import { ReactNode } from "react";
import { useRightSidebar } from "@/components/sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface RightSidebarAwareInsetProps {
  children: ReactNode;
  className?: string;
}

export function RightSidebarAwareInset({ children, className = "" }: RightSidebarAwareInsetProps) {
  const { open } = useRightSidebar();
  const isMobile = useIsMobile();

  // Hanya beri margin di desktop, mobile full width tidak perlu margin
  const marginClass = isMobile ? "mr-0" : open ? "mr-[18rem]" : "mr-0";

  return (
    <div className={`transition-all duration-200 ease-in-out ${marginClass} ${className}`}>
      {children}
    </div>
  );
}
