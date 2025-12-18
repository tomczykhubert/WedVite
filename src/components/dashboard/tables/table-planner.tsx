"use client";

import { Loader } from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { Event } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Monitor, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AddTableDialog } from "./add-table-dialog";
import { DraggableTable } from "./draggable-table";
import { GuestAssignmentSheet } from "./guest-assignment-sheet";

interface TablePlannerProps {
  event: Event;
}

export function TablePlanner({ event }: TablePlannerProps) {
  const t = useTranslations("dashboard.event.tables");
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Pan and zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panStartPos = useRef({ x: 0, y: 0 });

  const { data: tables, isLoading } = useQuery(
    trpc.table.getTables.queryOptions({ eventId: event.id })
  );

  const updatePosition = useMutation(
    trpc.table.updateTablePosition.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.table.pathFilter());
      },
    })
  );

  const deleteTable = useMutation(
    trpc.table.deleteTable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.table.pathFilter());
      },
    })
  );

  const handlePositionChange = async (
    tableId: string,
    x: number,
    y: number
  ) => {
    await updatePosition.mutateAsync({ tableId, positionX: x, positionY: y });
  };

  const handleDelete = async (tableId: string) => {
    await deleteTable.mutateAsync({ tableId });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.shiftKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(Math.max(0.5, zoom + delta), 2);
      setZoom(newZoom);
    }
  };

  // Handle panning with Ctrl/Cmd key
  const handleMouseDown = (e: React.MouseEvent) => {
    // Start panning if Ctrl/Cmd is pressed
    if ((e.ctrlKey || e.shiftKey) && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      panStartPos.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - panStartPos.current.x,
        y: e.clientY - panStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      if (canvasRef.current && isCtrlPressed) {
        canvasRef.current.style.cursor = "grab";
      } else if (canvasRef.current) {
        canvasRef.current.style.cursor = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, isCtrlPressed]);

  // Handle Ctrl/Cmd key for cursor feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.shiftKey) && !isCtrlPressed) {
        setIsCtrlPressed(true);
        if (canvasRef.current && !isPanning) {
          canvasRef.current.style.cursor = "grab";
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.shiftKey) {
        setIsCtrlPressed(false);
        if (canvasRef.current && !isPanning) {
          canvasRef.current.style.cursor = "";
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isCtrlPressed, isPanning]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Show mobile message
  if (isMobile) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("desktop.title")}</h3>
          <p className="text-muted-foreground max-w-md">
            {t("desktop.description")}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {t("desktop.mobileNote")}
          </p>
        </div>
        <Loader isLoading={isLoading} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">{t("tablePlanner")}</h2>
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title={t("controls.zoomOut")}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                title={t("controls.zoomIn")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetView}>
              {t("controls.resetView")}
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("add")}
            </Button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative flex-1 w-full border rounded-lg bg-muted/30 overflow-hidden min-h-0"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Grid background */}
          <div
            className="canvas-grid absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
          />

          {/* Tables container with zoom and pan */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {tables?.map((table) => (
              <DraggableTable
                key={table.id}
                table={table}
                onPositionChange={handlePositionChange}
                onSeatClick={setSelectedSeatId}
                onDelete={handleDelete}
                zoom={zoom}
              />
            ))}
          </div>

          {/* Hint text */}
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded pointer-events-none">
            {t.rich("controls.hint", {
              ctrl: (chunks) => (
                <kbd className="px-1 py-0.5 border rounded text-[10px]">
                  {chunks}
                </kbd>
              ),
            })}
          </div>
        </div>

        <AddTableDialog
          eventId={event.id}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={async () => {
            await queryClient.invalidateQueries(trpc.table.pathFilter());
          }}
        />

        {selectedSeatId && (
          <GuestAssignmentSheet
            seatId={selectedSeatId}
            eventId={event.id}
            onClose={() => setSelectedSeatId(null)}
            onSuccess={async () => {
              await queryClient.invalidateQueries(trpc.table.pathFilter());
            }}
          />
        )}
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
}
