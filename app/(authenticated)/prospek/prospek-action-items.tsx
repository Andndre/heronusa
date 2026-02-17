"use client";

import { Edit, User } from "lucide-react";
import { Prospek } from "@/server/prospek";
import React from "react";

interface ProspekActionItemsProps {
  prospek: Prospek;
  onEdit: (prospek: Prospek) => void;
  onViewDetail: (prospek: Prospek) => void;
  ActionItem: React.ComponentType<{
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
  }>;
}

export function ProspekActionItems({
  prospek,
  onEdit,
  onViewDetail,
  ActionItem,
}: ProspekActionItemsProps) {
  return (
    <>
      <ActionItem
        onClick={(e) => {
          e.stopPropagation();
          onViewDetail(prospek);
        }}
      >
        <User className="mr-2 h-4 w-4" />
        Lihat Detail
      </ActionItem>
      <ActionItem
        onClick={(e) => {
          e.stopPropagation();
          onEdit(prospek);
        }}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Prospek
      </ActionItem>
    </>
  );
}
