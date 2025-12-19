"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useCanvasControls } from "./hooks/use-canvas-controls";

interface TablePlannerContextValue {
  zoom: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isCtrlPressed: boolean;
  canvasSize: { width: number; height: number };
  handleWheel: (e: React.WheelEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  startPanning: (direction: "up" | "down" | "left" | "right") => void;
  stopPanning: () => void;
}

const TablePlannerContext = createContext<TablePlannerContextValue | null>(
  null
);

interface TablePlannerProviderProps {
  children: ReactNode;
}

export function TablePlannerProvider({ children }: TablePlannerProviderProps) {
  const canvasControls = useCanvasControls();

  const canvasSize = useMemo(
    () =>
      canvasControls.canvasRef.current
        ? {
            width:
              canvasControls.canvasRef.current.getBoundingClientRect().width,
            height:
              canvasControls.canvasRef.current.getBoundingClientRect().height,
          }
        : { width: 0, height: 0 },
    [canvasControls.canvasRef.current, canvasControls.zoom, canvasControls.pan]
  );

  const value = useMemo(
    () => ({
      ...canvasControls,
      canvasSize,
    }),
    [canvasControls, canvasSize]
  );

  return (
    <TablePlannerContext.Provider value={value}>
      {children}
    </TablePlannerContext.Provider>
  );
}

export function useTablePlanner() {
  const context = useContext(TablePlannerContext);
  if (!context) {
    throw new Error(
      "useTablePlanner must be used within a TablePlannerProvider"
    );
  }
  return context;
}
