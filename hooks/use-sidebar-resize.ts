"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSidebarResizeOptions {
  direction: "left" | "right";
  currentWidth: string;
  onResize: (width: string) => void;
  onToggle: () => void;
  isCollapsed: boolean;
  minResizeWidth?: string;
  maxResizeWidth?: string;
  enableAutoCollapse?: boolean;
  autoCollapseThreshold?: number;
  expandThreshold?: number;
  enableDrag?: boolean;
  setIsDraggingRail?: (isDragging: boolean) => void;
  widthCookieName?: string;
  widthCookieMaxAge?: number;
}

export function useSidebarResize({
  direction,
  currentWidth,
  onResize,
  onToggle,
  isCollapsed,
  minResizeWidth = "14rem",
  maxResizeWidth = "24rem",
  enableAutoCollapse = true,
  autoCollapseThreshold = 1.5,
  expandThreshold = 0.2,
  enableDrag = true,
  setIsDraggingRail,
  widthCookieName = "sidebar:width",
  widthCookieMaxAge = 60 * 60 * 24 * 7,
}: UseSidebarResizeOptions) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Parse width string to number (rem to px)
  const remToPx = useCallback((rem: string) => {
    const fontSize = getComputedStyle(document.documentElement).fontSize;
    return parseFloat(rem) * parseFloat(fontSize);
  }, []);

  // Parse px to rem
  const pxToRem = useCallback((px: number) => {
    const fontSize = getComputedStyle(document.documentElement).fontSize;
    return `${px / parseFloat(fontSize)}rem`;
  }, []);

  // Set cookie
  const setCookie = useCallback(
    (value: string) => {
      if (typeof document !== "undefined") {
        document.cookie = `${widthCookieName}=${value}; path=/; max-age=${widthCookieMaxAge}`;
      }
    },
    [widthCookieName, widthCookieMaxAge]
  );

  // Get cookie
  const getCookie = useCallback(() => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(^| )${widthCookieName}=([^;]+)`));
    return match ? match[2] : null;
  }, [widthCookieName]);

  // Load width from cookie on mount
  useEffect(() => {
    const savedWidth = getCookie();
    if (savedWidth) {
      onResize(savedWidth);
    }
  }, [getCookie, onResize]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableDrag) return;

      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = remToPx(currentWidth);

      if (setIsDraggingRail) {
        setIsDraggingRail(true);
      }
    },
    [enableDrag, currentWidth, remToPx, setIsDraggingRail]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const minPx = remToPx(minResizeWidth);
      const maxPx = remToPx(maxResizeWidth);
      const deltaX =
        direction === "left" ? e.clientX - startXRef.current : startXRef.current - e.clientX;
      let newWidth = startWidthRef.current + deltaX;

      // Constrain width
      newWidth = Math.max(minPx, Math.min(maxPx, newWidth));

      // Auto-collapse logic
      if (enableAutoCollapse) {
        const thresholdPx = minPx * (autoCollapseThreshold > 1 ? 1 : autoCollapseThreshold);
        const collapseThresholdPx =
          autoCollapseThreshold > 1 ? minPx * (autoCollapseThreshold - 1) : thresholdPx;

        // Check if we should collapse
        if (newWidth < minPx - collapseThresholdPx && !isCollapsed) {
          onToggle();
          setIsDragging(false);
          if (setIsDraggingRail) {
            setIsDraggingRail(false);
          }
          return;
        }

        // Check if we should expand
        if (isCollapsed && newWidth > minPx * expandThreshold) {
          onToggle();
        }
      }

      const newWidthRem = pxToRem(newWidth);
      onResize(newWidthRem);
      setCookie(newWidthRem);
    },
    [
      isDragging,
      direction,
      minResizeWidth,
      maxResizeWidth,
      remToPx,
      pxToRem,
      enableAutoCollapse,
      autoCollapseThreshold,
      expandThreshold,
      isCollapsed,
      onToggle,
      onResize,
      setCookie,
      setIsDraggingRail,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (setIsDraggingRail) {
        setIsDraggingRail(false);
      }
    }
  }, [isDragging, setIsDraggingRail]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragRef,
    handleMouseDown,
    isDragging,
  };
}
