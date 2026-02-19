"use client";

import { Edit, MessageCirclePlus, User, LucideIcon } from "lucide-react";
import { Prospek } from "@/server/prospek";
import React from "react";
import { Button } from "@/components/ui/button";

interface ProspekActionItemsProps {
  prospek: Prospek;
  onEdit: (prospek: Prospek) => void;
  onViewDetail: (prospek: Prospek) => void;
  onAddFollowUp: (prospek: Prospek) => void;
  ActionItem?: React.ComponentType<{
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
  }>;
  asIconButtons?: boolean;
}

// Action configuration type
type ActionConfig = {
  icon: LucideIcon;
  label: string;
  action: keyof Pick<ProspekActionItemsProps, "onViewDetail" | "onEdit" | "onAddFollowUp">;
};

// Shared action configurations
const PROSPEK_ACTIONS: ActionConfig[] = [
  { icon: User, label: "Lihat Detail", action: "onViewDetail" },
  { icon: Edit, label: "Edit Prospek", action: "onEdit" },
  { icon: MessageCirclePlus, label: "Follow-Up", action: "onAddFollowUp" },
];

// Helper to create click handler with stopPropagation
const createClickHandler = (e: React.MouseEvent, callback: () => void) => {
  e.stopPropagation();
  callback();
};

export function ProspekActionItems({
  prospek,
  onEdit,
  onViewDetail,
  onAddFollowUp,
  ActionItem,
  asIconButtons = false,
}: ProspekActionItemsProps) {
  const actionHandlers = { onViewDetail, onEdit, onAddFollowUp };

  // Render icon buttons untuk overlay
  if (asIconButtons || !ActionItem) {
    return (
      <div className="flex items-center gap-1">
        {PROSPEK_ACTIONS.map(({ icon: Icon, label, action }) => (
          <Button
            key={action}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => createClickHandler(e, () => actionHandlers[action](prospek))}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    );
  }

  // Render menu items dengan teks
  return (
    <>
      {PROSPEK_ACTIONS.map(({ icon: Icon, label, action }) => (
        <ActionItem
          key={action}
          onClick={(e) => createClickHandler(e, () => actionHandlers[action](prospek))}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </ActionItem>
      ))}
    </>
  );
}
