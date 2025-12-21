"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SeatWithRelations } from "@/types/table";
import { GuestType, TableShape } from "@prisma/client";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getGuestImage } from "../guests/guest-row";
import {
  calculateRoundTableDiameter,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  SEAT_SIZE,
  SEAT_SPACING,
  TABLE_PADDING,
} from "./constants";
import { useGuestDrag } from "./hooks/use-guest-drag";

type SeatSide = "top" | "right" | "bottom" | "left";

interface TableVisualProps {
  shape: TableShape;
  rows?: number | null;
  columns?: number | null;
  seats: SeatWithRelations[];
  onSeatClick?: (seatId: string) => void;
  onGuestMove?: (fromSeatId: string, toSeatId: string) => void;
  isDragging?: boolean;
}

export function TableVisual({
  shape,
  rows,
  columns,
  seats,
  onSeatClick,
  onGuestMove,
  isDragging,
}: TableVisualProps) {
  const {
    width,
    height,
    seatPositions,
    containerWidth,
    containerHeight,
    tableOffset,
  } = useMemo(() => {
    const positions: { x: number; y: number; side: SeatSide }[] = [];
    let tableWidth: number;
    let tableHeight: number;
    const offset = SEAT_SIZE + SEAT_SPACING * 2;

    if (shape === TableShape.ROUND) {
      const diameter = calculateRoundTableDiameter(seats.length);
      tableWidth = diameter;
      tableHeight = diameter;

      const centerX = offset + diameter / 2;
      const centerY = offset + diameter / 2;
      const radius = diameter / 2 + SEAT_SIZE / 2 + SEAT_SPACING;

      seats.forEach((_, index) => {
        const angle = (index / seats.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) - SEAT_SIZE / 2;
        const y = centerY + radius * Math.sin(angle) - SEAT_SIZE / 2;

        // Determine side based on angle
        let side: SeatSide;
        const degrees = (angle * 180) / Math.PI;
        const normalizedDegrees = ((degrees % 360) + 360) % 360;

        if (normalizedDegrees >= 315 || normalizedDegrees < 45) {
          side = "right";
        } else if (normalizedDegrees >= 45 && normalizedDegrees < 135) {
          side = "bottom";
        } else if (normalizedDegrees >= 135 && normalizedDegrees < 225) {
          side = "left";
        } else {
          side = "top";
        }

        positions.push({ x, y, side });
      });
    } else {
      const rowSeats = rows || DEFAULT_ROWS;
      const colSeats = columns || DEFAULT_COLUMNS;

      tableWidth = colSeats * (SEAT_SIZE + SEAT_SPACING) + TABLE_PADDING;
      tableHeight = rowSeats * (SEAT_SIZE + SEAT_SPACING) + TABLE_PADDING;

      // Top edge
      for (let i = 0; i < colSeats; i++) {
        const spacing = tableWidth / (colSeats + 1);
        positions.push({
          x: offset + spacing * (i + 1) - SEAT_SIZE / 2,
          y: offset - SEAT_SIZE - SEAT_SPACING,
          side: "top",
        });
      }

      // Right edge
      for (let i = 0; i < rowSeats; i++) {
        const spacing = tableHeight / (rowSeats + 1);
        positions.push({
          x: offset + tableWidth + SEAT_SPACING,
          y: offset + spacing * (i + 1) - SEAT_SIZE / 2,
          side: "right",
        });
      }

      // Bottom edge
      for (let i = 0; i < colSeats; i++) {
        const spacing = tableWidth / (colSeats + 1);
        positions.push({
          x: offset + tableWidth - spacing * (i + 1) - SEAT_SIZE / 2,
          y: offset + tableHeight + SEAT_SPACING,
          side: "bottom",
        });
      }

      // Left edge
      for (let i = 0; i < rowSeats; i++) {
        const spacing = tableHeight / (rowSeats + 1);
        positions.push({
          x: offset - SEAT_SIZE - SEAT_SPACING,
          y: offset + tableHeight - spacing * (i + 1) - SEAT_SIZE / 2,
          side: "left",
        });
      }
    }

    const contWidth = tableWidth + offset * 2;
    const contHeight = tableHeight + offset * 2;

    return {
      width: tableWidth,
      height: tableHeight,
      seatPositions: positions,
      containerWidth: contWidth,
      containerHeight: contHeight,
      tableOffset: offset,
    };
  }, [shape, rows, columns, seats]);

  return (
    <div
      className="relative pointer-events-none"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div
        className={cn(
          "absolute border-2 border-primary bg-muted pointer-events-auto",
          shape === TableShape.ROUND && "rounded-full",
          shape === TableShape.RECTANGULAR && "rounded-lg",
          isDragging && "opacity-70"
        )}
        style={{
          width,
          height,
          left: tableOffset,
          top: tableOffset,
        }}
      />

      {seats.map((seat, index) => {
        const pos = seatPositions[index];
        if (!pos) return null;

        return (
          <SeatButton
            key={seat.id}
            seat={seat}
            position={pos}
            onSeatClick={onSeatClick}
            onGuestMove={onGuestMove}
          />
        );
      })}
    </div>
  );
}

interface SeatButtonProps {
  seat: SeatWithRelations;
  position: { x: number; y: number; side: SeatSide };
  onSeatClick?: (seatId: string) => void;
  onGuestMove?: (fromSeatId: string, toSeatId: string) => void;
}

function SeatButton({
  seat,
  position,
  onSeatClick,
  onGuestMove,
}: SeatButtonProps) {
  const t = useTranslations("dashboard.event");
  const { isDragging, isOver, dragHandlers } = useGuestDrag({
    seatId: seat.id,
    guestId: seat.guest?.id || null,
    onGuestMove: onGuestMove || (() => {}),
  });
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const movedDuringTouch = useRef(false);
  const ignoreNextClick = useRef(false);
  const holdTimer = useRef<number | null>(null);
  const HOLD_DURATION = 500; // ms

  useEffect(() => {
    const handleDocTouchEnd = (ev: TouchEvent) => {
      if (!tooltipOpen) return;
      const target = ev.target as Node | null;
      if (!target) return;
      const closestSeat = (target as HTMLElement).closest
        ? (target as HTMLElement).closest("[data-seat-id]")
        : null;
      if (closestSeat && closestSeat.getAttribute("data-seat-id") === seat.id)
        return;
      setTooltipOpen(false);
    };

    document.addEventListener("touchend", handleDocTouchEnd, {
      passive: true,
    });
    return () => document.removeEventListener("touchend", handleDocTouchEnd);
  }, [tooltipOpen, seat.id]);

  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
    };
  }, []);

  const handleTouchStartWrapper = (e: React.TouchEvent) => {
    dragHandlers.onTouchStart?.(e);
    const touch = e.touches[0];
    touchStartPos.current = touch
      ? { x: touch.clientX, y: touch.clientY }
      : null;
    touchStartTime.current = Date.now();
    movedDuringTouch.current = false;

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    holdTimer.current = window.setTimeout(() => {
      if (!movedDuringTouch.current) {
        onSeatClick?.(seat.id);
        ignoreNextClick.current = true;
        setTooltipOpen(false);
      }
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
    }, HOLD_DURATION);
  };

  const handleTouchMoveWrapper = (e: React.TouchEvent) => {
    dragHandlers.onTouchMove?.(e);
    const touch = e.touches[0];
    if (!touch || !touchStartPos.current) return;
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    if (Math.hypot(dx, dy) > 10) movedDuringTouch.current = true;
    if (movedDuringTouch.current && holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const handleTouchEndWrapper = (e: React.TouchEvent) => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    const duration = touchStartTime.current
      ? Date.now() - touchStartTime.current
      : 0;
    const isTap = duration < 300 && !movedDuringTouch.current;

    dragHandlers.onTouchEnd?.(e);

    if (isTap) {
      setTooltipOpen((v) => !v);
      ignoreNextClick.current = true;
    }

    touchStartPos.current = null;
    touchStartTime.current = null;
    movedDuringTouch.current = false;
  };

  const handleClickWrapper = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      e.stopPropagation();
      return;
    }
    onSeatClick?.(seat.id);
  };

  return (
    <>
      <Tooltip
        key={`${seat.id}-${position.x}-${position.y}-${tooltipOpen ? "open" : "closed"}`}
        {...(isTouchDevice
          ? { open: tooltipOpen, onOpenChange: setTooltipOpen }
          : {})}
      >
        <TooltipTrigger asChild>
          <button
            data-seat-id={seat.id}
            draggable={dragHandlers.draggable}
            onDragStart={dragHandlers.onDragStart}
            onDragEnd={dragHandlers.onDragEnd}
            onDragOver={dragHandlers.onDragOver}
            onDragEnter={dragHandlers.onDragEnter}
            onDragLeave={dragHandlers.onDragLeave}
            onDrop={dragHandlers.onDrop}
            onTouchStart={handleTouchStartWrapper}
            onTouchMove={handleTouchMoveWrapper}
            onTouchEnd={handleTouchEndWrapper}
            onClick={handleClickWrapper}
            onMouseDown={(e) => e.stopPropagation()}
            className={cn(
              "cursor-pointer absolute rounded-full border-primary bg-muted hover:bg-primary/50 border-2 transition-all flex items-center justify-center overflow-hidden pointer-events-auto select-none",
              isDragging && "opacity-50 cursor-grabbing",
              isOver && "ring-2 ring-primary ring-offset-2",
              seat.guest && "cursor-grab"
            )}
            style={{
              left: position.x,
              top: position.y,
              width: SEAT_SIZE,
              height: SEAT_SIZE,
              zIndex: 10,
            }}
          >
            {seat.guest ? (
              <Image
                src={`/images/guests/${getGuestImage(seat.guest.type, seat.guest.gender)}.png`}
                alt={t(
                  `guests.typeAlt.${getGuestImage(seat.guest.type, seat.guest.gender)}`
                )}
                width={SEAT_SIZE}
                height={SEAT_SIZE}
                className="object-cover pointer-events-none"
                draggable={false}
              />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                <UserPlus />
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side={position.side} className="pointer-events-none">
          {seat.guest
            ? seat.guest.name || t(`guests.guestTypes.${GuestType.COMPANION}`)
            : t("tables.assignGuestText")}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
