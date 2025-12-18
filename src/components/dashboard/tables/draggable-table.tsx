"use client";

import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TableWithRelations } from "@/types/table";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TableVisual } from "./table-visual";

interface DraggableTableProps {
  table: TableWithRelations;
  onPositionChange: (tableId: string, x: number, y: number) => void;
  onSeatClick: (seatId: string) => void;
  onDelete: (tableId: string) => void;
  zoom: number;
}

export function DraggableTable({
  table,
  onPositionChange,
  onSeatClick,
  onDelete,
  zoom,
}: DraggableTableProps) {
  const t = useTranslations("dashboard.event.tables");
  const tableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    x: table.positionX,
    y: table.positionY,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: table.positionX, y: table.positionY });
  }, [table.positionX, table.positionY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag table if Ctrl/Cmd is pressed (panning mode)
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Don't drag if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    setIsDragging(true);
    // Account for zoom when calculating drag start position
    dragStartPos.current = {
      x: e.clientX / zoom - position.x,
      y: e.clientY / zoom - position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Account for zoom when calculating new position
      const newX = e.clientX / zoom - dragStartPos.current.x;
      const newY = e.clientY / zoom - dragStartPos.current.y;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onPositionChange(table.id, position.x, position.y);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position.x, position.y, onPositionChange, table.id, zoom]);

  return (
    <div
      ref={tableRef}
      className={cn("absolute cursor-move")}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !tableRef.current?.contains(relatedTarget)) {
          setIsHovered(false);
        }
      }}
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
          "absolute -bottom-10 left-1/2 flex items-center gap-2 transition-opacity z-10",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translateX(-50%) scale(${1 / zoom})`,
          transformOrigin: "center top",
        }}
        onMouseEnter={() => setIsHovered(true)}
      >
        <Badge variant="secondary" className="h-8">
          {table.name}
        </Badge>
        <ConfirmModal
          header={t("deleteTable.header")}
          message={t("deleteTable.message")}
          onConfirm={() => onDelete(table.id)}
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
