import { AddTableData } from "@/schemas/tableFormConfig";
import { TableShape } from "@prisma/client";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { getTableDimensions } from "../constants";

interface UseTablePositionProps {
  open: boolean;
  form: UseFormReturn<AddTableData>;
  selectedShape: TableShape;
  rows: number | null;
  columns: number | null;
  canvasSize: { width: number; height: number };
  pan: { x: number; y: number };
  zoom: number;
}

export function useTablePosition({
  open,
  form,
  selectedShape,
  rows,
  columns,
  canvasSize,
  pan,
  zoom,
}: UseTablePositionProps) {
  useEffect(() => {
    if (open && canvasSize.width > 0 && canvasSize.height > 0) {
      const { width: tableWidth, height: tableHeight } = getTableDimensions(
        selectedShape,
        rows,
        columns
      );

      const screenCenterX = canvasSize.width / 2;
      const screenCenterY = canvasSize.height / 2;

      const canvasX = (screenCenterX - pan.x) / zoom - tableWidth / 2;
      const canvasY = (screenCenterY - pan.y) / zoom - tableHeight / 2;

      form.setValue("positionX", canvasX);
      form.setValue("positionY", canvasY);
    }
  }, [open, selectedShape, rows, columns, canvasSize, pan, zoom, form]);
}
