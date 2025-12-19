"use client";

import ActionButton from "@/components/base/button-link";
import { Loader } from "@/components/base/loader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { Event } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AddTableDialog } from "./add-table-dialog";
import { CanvasControls } from "./canvas-controls";
import { CanvasHint } from "./canvas-hint";
import { CANVAS_GRID_SIZE } from "./constants";
import { DraggableTable } from "./draggable-table";
import { GuestAssignmentSheet } from "./guest-assignment-sheet";
import { useTableMutations } from "./hooks/useTableMutations";
import { InvitationConnections } from "./invitation-connections";
import { MobileWarning } from "./mobile-warning";
import { OffscreenIndicators } from "./offscreen-indicators";
import { TablePlannerProvider, useTablePlanner } from "./table-planner-context";
import {
  calculateNavigationPan,
  calculateOffscreenIndicators,
} from "./utils/offscreenIndicators";

interface TablePlannerProps {
  event: Event;
}

export function TablePlanner({ event }: TablePlannerProps) {
  return (
    <TablePlannerProvider>
      <TablePlannerContent event={event} />
    </TablePlannerProvider>
  );
}

function TablePlannerContent({ event }: TablePlannerProps) {
  const t = useTranslations("dashboard.event.tables");
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    zoom,
    pan,
    setPan,
    canvasRef,
    handleWheel,
    handleMouseDown,
    tables,
    setTables,
    dragPositions,
    setDragPositions,
  } = useTablePlanner();

  const { data: fetchedTables, isLoading } = useQuery(
    trpc.table.getTables.queryOptions({ eventId: event.id })
  );

  if (fetchedTables !== tables) {
    setTables(fetchedTables);
  }
  const { handlePositionChange, handleDelete, invalidateTables } =
    useTableMutations();

  const handleDragUpdate = (tableId: string, x: number, y: number) => {
    setDragPositions((prev) => ({ ...prev, [tableId]: { x, y } }));
  };

  const handleDragEnd = async (tableId: string, x: number, y: number) => {
    await handlePositionChange(tableId, x, y);
    setDragPositions((prev) => {
      const newPos = { ...prev };
      delete newPos[tableId];
      return newPos;
    });
  };

  const handleNavigateToTable = (
    indicator: ReturnType<typeof calculateOffscreenIndicators>[0]
  ) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPan = calculateNavigationPan(indicator, canvasRect, zoom);
    setPan(newPan);
  };

  const offscreenIndicators = canvasRef.current
    ? calculateOffscreenIndicators(
        tables,
        canvasRef.current.getBoundingClientRect(),
        zoom,
        pan
      )
    : [];

  if (isMobile) {
    return (
      <>
        <MobileWarning />
        <Loader isLoading={isLoading} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">{t("tablePlanner")}</h2>
          <ActionButton onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-1" />
            {t("add")}
          </ActionButton>
        </div>

        <div
          ref={canvasRef}
          className="relative flex-1 w-full border rounded-lg bg-muted/30 overflow-hidden min-h-0"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="canvas-grid absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, var(--color-border) 1px, transparent 1px),
                linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
              `,
              backgroundSize: `${CANVAS_GRID_SIZE * zoom}px ${CANVAS_GRID_SIZE * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
          />

          <InvitationConnections />

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
                onPositionChange={handleDragEnd}
                onDragUpdate={handleDragUpdate}
                onSeatClick={setSelectedSeatId}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <OffscreenIndicators
            indicators={offscreenIndicators}
            onNavigate={handleNavigateToTable}
          />

          <CanvasHint
            hint={t.rich("controls.hint", {
              key: (chunks) => (
                <kbd className="px-1 py-0.5 border rounded text-[10px]">
                  {chunks}
                </kbd>
              ),
            })}
          />

          <CanvasControls controlsT={(key) => t(`controls.${key}`)} />
        </div>

        <AddTableDialog
          eventId={event.id}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={invalidateTables}
        />

        {selectedSeatId && (
          <GuestAssignmentSheet
            seatId={selectedSeatId}
            eventId={event.id}
            onClose={() => setSelectedSeatId(null)}
            onSuccess={invalidateTables}
          />
        )}
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
}
