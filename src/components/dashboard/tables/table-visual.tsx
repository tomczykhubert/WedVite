"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SeatWithRelations } from "@/types/table";
import { TableShape } from "@prisma/client";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";
import { getGuestImage } from "../guests/guest-row";
import {
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  ROUND_TABLE_DIAMETER,
  SEAT_SIZE,
  SEAT_SPACING,
  TABLE_PADDING,
} from "./constants";

type SeatSide = "top" | "right" | "bottom" | "left";

interface TableVisualProps {
  shape: TableShape;
  rows?: number | null;
  columns?: number | null;
  seats: SeatWithRelations[];
  onSeatClick?: (seatId: string) => void;
  isDragging?: boolean;
}

export function TableVisual({
  shape,
  rows,
  columns,
  seats,
  onSeatClick,
  isDragging,
}: TableVisualProps) {
  const t = useTranslations("dashboard.event");

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
      const diameter = ROUND_TABLE_DIAMETER;
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
          <Tooltip key={seat.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSeatClick?.(seat.id)}
                onMouseDown={(e) => e.stopPropagation()}
                className={cn(
                  "cursor-pointer absolute rounded-full border-primary bg-muted hover:bg-primary/50 border-2 transition-all flex items-center justify-center overflow-hidden pointer-events-auto"
                )}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: SEAT_SIZE,
                  height: SEAT_SIZE,
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
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    <UserPlus />
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side={pos.side} className="pointer-events-none">
              {seat.guest ? seat.guest.name : t("tables.assignGuestText")}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
