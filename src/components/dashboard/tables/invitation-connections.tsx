"use client";

import { TableWithRelations } from "@/types/table";
import { ReactElement, useMemo } from "react";
import {
  calculateRoundTableDiameter,
  DEFAULT_COLUMNS,
  DEFAULT_ROWS,
  SEAT_SIZE,
  SEAT_SPACING,
  TABLE_PADDING,
} from "./constants";
import { useTablePlanner } from "./table-planner-context";

interface GuestPosition {
  x: number;
  y: number;
  invitationId: string;
  invitationName: string;
}

/**
 * Generates a consistent color for an invitation based on its ID
 */
function getInvitationColor(invitationId: string): string {
  // Use a simple hash function to generate a consistent hue value
  let hash = 0;
  for (let i = 0; i < invitationId.length; i++) {
    hash = invitationId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);

  // Use HSL with good saturation and lightness for visibility
  return `hsl(${hue}, 70%, 50%)`;
}

export function InvitationConnections() {
  const { tables, zoom, pan, dragPositions } = useTablePlanner();

  const connections = useMemo(() => {
    if (!tables) return [];

    // Collect all guest positions with their invitation IDs
    const guestPositions: GuestPosition[] = [];

    tables.forEach((table) => {
      // Use drag position if available, otherwise use saved position
      const tablePos = dragPositions[table.id] || {
        x: table.positionX,
        y: table.positionY,
      };

      table.seats.forEach((seat) => {
        if (seat.guest && seat.guest.invitation) {
          // Calculate seat position relative to the table
          const seatPos = calculateSeatPosition(table, seat.position);

          guestPositions.push({
            x: tablePos.x + seatPos.x,
            y: tablePos.y + seatPos.y,
            invitationId: seat.guest.invitationId,
            invitationName: seat.guest.invitation.name,
          });
        }
      });
    });

    // Group guests by invitation ID
    const groupedByInvitation = guestPositions.reduce(
      (acc, pos) => {
        if (!acc[pos.invitationId]) {
          acc[pos.invitationId] = [];
        }
        acc[pos.invitationId].push(pos);
        return acc;
      },
      {} as Record<string, GuestPosition[]>
    );

    // Create connections for invitations with 2+ guests
    const lineConnections: {
      invitationId: string;
      invitationName: string;
      points: GuestPosition[];
      color: string;
    }[] = [];

    Object.entries(groupedByInvitation).forEach(([invitationId, guests]) => {
      if (guests.length >= 2) {
        lineConnections.push({
          invitationId,
          invitationName: guests[0].invitationName,
          points: guests,
          color: getInvitationColor(invitationId),
        });
      }
    });

    return lineConnections;
  }, [tables, dragPositions]);

  if (connections.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: "0 0",
        overflow: "visible",
        zIndex: 10,
      }}
    >
      {connections.map((connection) => {
        const lines: ReactElement[] = [];

        for (let i = 0; i < connection.points.length - 1; i++) {
          for (let j = i + 1; j < connection.points.length; j++) {
            const start = connection.points[i];
            const end = connection.points[j];

            lines.push(
              <line
                key={`${connection.invitationId}-${i}-${j}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={connection.color}
                strokeWidth={2 / zoom}
                strokeDasharray={`${8 / zoom} ${4 / zoom}`}
                opacity={0.6}
              >
                <title>{connection.invitationName}</title>
              </line>
            );
          }
        }

        return lines;
      })}
    </svg>
  );
}

function calculateSeatPosition(
  table: TableWithRelations,
  seatPosition: number
): { x: number; y: number } {
  const offset = SEAT_SIZE + SEAT_SPACING * 2;

  if (table.shape === "ROUND") {
    const diameter = calculateRoundTableDiameter(table.capacity);
    const centerX = offset + diameter / 2;
    const centerY = offset + diameter / 2;
    const radius = diameter / 2 + SEAT_SIZE / 2 + SEAT_SPACING;

    const totalSeats = table.capacity;
    const angle = (seatPosition / totalSeats) * 2 * Math.PI;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  } else {
    const rowSeats = table.rows || DEFAULT_ROWS;
    const colSeats = table.columns || DEFAULT_COLUMNS;

    const tableWidth = colSeats * (SEAT_SIZE + SEAT_SPACING) + TABLE_PADDING;
    const tableHeight = rowSeats * (SEAT_SIZE + SEAT_SPACING) + TABLE_PADDING;

    if (seatPosition < colSeats) {
      // Top edge
      const i = seatPosition;
      const spacing = tableWidth / (colSeats + 1);
      return {
        x: offset + spacing * (i + 1),
        y: offset - SEAT_SIZE / 2 - SEAT_SPACING,
      };
    } else if (seatPosition < colSeats + rowSeats) {
      // Right edge
      const i = seatPosition - colSeats;
      const spacing = tableHeight / (rowSeats + 1);
      return {
        x: offset + tableWidth + SEAT_SPACING + SEAT_SIZE / 2,
        y: offset + spacing * (i + 1),
      };
    } else if (seatPosition < colSeats * 2 + rowSeats) {
      // Bottom edge
      const i = seatPosition - colSeats - rowSeats;
      const spacing = tableWidth / (colSeats + 1);
      return {
        x: offset + tableWidth - spacing * (i + 1),
        y: offset + tableHeight + SEAT_SPACING + SEAT_SIZE / 2,
      };
    } else {
      // Left edge
      const i = seatPosition - colSeats * 2 - rowSeats;
      const spacing = tableHeight / (rowSeats + 1);
      return {
        x: offset - SEAT_SIZE / 2 - SEAT_SPACING,
        y: offset + tableHeight - spacing * (i + 1),
      };
    }
  }
}
