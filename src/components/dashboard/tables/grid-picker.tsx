"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MAX_GRID_SIZE } from "./constants";

interface GridPickerProps {
  rows: number;
  columns: number;
  onSelect: (rows: number, columns: number) => void;
}

export function GridPicker({ rows, columns, onSelect }: GridPickerProps) {
  const t = useTranslations("dashboard.event.tables");
  const [hoverRows, setHoverRows] = useState(-1);
  const [hoverColumns, setHoverColumns] = useState(-1);

  const displayRows = hoverRows >= 0 ? hoverRows + 1 : rows;
  const displayColumns = hoverColumns >= 0 ? hoverColumns + 1 : columns;

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-muted/30">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${MAX_GRID_SIZE}, 1fr)` }}
          onMouseLeave={() => {
            setHoverRows(-1);
            setHoverColumns(-1);
          }}
        >
          {Array.from({ length: MAX_GRID_SIZE * MAX_GRID_SIZE }).map(
            (_, index) => {
              const row = Math.floor(index / MAX_GRID_SIZE);
              const col = index % MAX_GRID_SIZE;
              const isSelected = row < rows && col < columns;
              const isHovered =
                hoverRows >= 0 &&
                hoverColumns >= 0 &&
                row <= hoverRows &&
                col <= hoverColumns;

              return (
                <div
                  key={index}
                  className={cn(
                    "w-6 h-6 border-2 cursor-pointer transition-colors",
                    isSelected && "bg-primary border-primary",
                    !isSelected &&
                      isHovered &&
                      "bg-primary/30 border-primary/50",
                    !isSelected &&
                      !isHovered &&
                      "bg-background border-muted-foreground/30"
                  )}
                  onMouseEnter={() => {
                    setHoverRows(row);
                    setHoverColumns(col);
                  }}
                  onClick={() => onSelect(row + 1, col + 1)}
                />
              );
            }
          )}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {displayRows} × {displayColumns}
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {t("clickToSelect")}
      </div>
    </div>
  );
}
