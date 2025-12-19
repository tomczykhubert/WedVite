"use client";

import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TableWithRelations } from "@/types/table";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useTableDrag } from "./hooks/useTableDrag";
import { useTablePlanner } from "./table-planner-context";
import { TableVisual } from "./table-visual";

interface DraggableTableProps {
  table: TableWithRelations;
  onPositionChange: (tableId: string, x: number, y: number) => void;
  onDragUpdate: (tableId: string, x: number, y: number) => void;
  onSeatClick: (seatId: string) => void;
  onDelete: (tableId: string) => void;
}

export function DraggableTable({
  table,
  onPositionChange,
  onDragUpdate,
  onSeatClick,
  onDelete,
}: DraggableTableProps) {
  const t = useTranslations("dashboard.event.tables");
  const { zoom } = useTablePlanner();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { position, isDragging, handleMouseDown } = useTableDrag({
    initialX: table.positionX,
    initialY: table.positionY,
    zoom,
    onDragEnd: (x, y) => onPositionChange(table.id, x, y),
    onDragUpdate: (x, y) => onDragUpdate(table.id, x, y),
    disabled: isDeleted,
  });

  const handleDelete = () => {
    onDelete(table.id);
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div
      className={cn("absolute cursor-move")}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TableVisual
        shape={table.shape}
        rows={table.rows}
        columns={table.columns}
        seats={table.seats}
        onSeatClick={onSeatClick}
        isDragging={isDragging}
      />
      <div
        className={cn(
          "absolute -bottom-10 left-1/2 flex items-center gap-2 transition-opacity z-50",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translateX(-50%) scale(${1 / zoom})`,
          transformOrigin: "center top",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Badge variant="secondary" className="h-8 cursor-default">
          {table.name}
        </Badge>
        <ConfirmModal
          header={t("deleteTable.header")}
          message={t("deleteTable.message")}
          onConfirm={handleDelete}
          trigger={
            <ActionButton
              variant="destructive"
              size="icon"
              tooltip={t("deleteTable.header")}
              tooltipSide="bottom"
            >
              <Trash2 />
            </ActionButton>
          }
        />
      </div>
    </div>
  );
}
