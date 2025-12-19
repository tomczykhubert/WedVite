"use client";

import { TableWithRelations } from "@/types/table";
import {
  createContext,
  Dispatch,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useMemo,
  useState,
  WheelEvent,
} from "react";
import { useCanvasControls } from "./hooks/use-canvas-controls";

interface TablePlannerContextValue {
  zoom: number;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  canvasRef: RefObject<HTMLDivElement | null>;
  isCtrlPressed: boolean;
  canvasSize: { width: number; height: number };
  handleWheel: (e: WheelEvent) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  startPanning: (direction: "up" | "down" | "left" | "right") => void;
  stopPanning: () => void;
  tables: TableWithRelations[] | undefined;
  setTables: Dispatch<SetStateAction<TableWithRelations[] | undefined>>;
  dragPositions: Record<string, { x: number; y: number }>;
  setDragPositions: React.Dispatch<
    SetStateAction<Record<string, { x: number; y: number }>>
  >;
}

const TablePlannerContext = createContext<TablePlannerContextValue | null>(
  null
);

interface TablePlannerProviderProps {
  children: ReactNode;
}

export function TablePlannerProvider({ children }: TablePlannerProviderProps) {
  const canvasControls = useCanvasControls();
  const [tables, setTables] = useState<TableWithRelations[] | undefined>(
    undefined
  );
  const [dragPositions, setDragPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

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
    [canvasControls.canvasRef]
  );

  const value = useMemo(
    () => ({
      ...canvasControls,
      canvasSize,
      tables,
      setTables,
      dragPositions,
      setDragPositions,
    }),
    [canvasControls, canvasSize, tables, dragPositions]
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
