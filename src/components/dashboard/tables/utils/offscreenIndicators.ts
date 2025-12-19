import { TableWithRelations } from "@/types/table";
import { getTableDimensions } from "../constants";

export interface OffscreenIndicator {
  x: number;
  y: number;
  angle: number;
  tableName: string;
  tableId: string;
  tablePosition: { x: number; y: number };
  tableDim: { width: number; height: number };
}

export { getTableDimensions };

export function calculateOffscreenIndicators(
  tables: TableWithRelations[] | undefined,
  canvasRect: DOMRect,
  zoom: number,
  pan: { x: number; y: number }
): OffscreenIndicator[] {
  if (!tables) return [];

  const indicators: OffscreenIndicator[] = [];

  tables.forEach((table) => {
    const tableDim = getTableDimensions(table);

    // Calculate table center in screen coordinates
    const tableCenterX = (table.positionX + tableDim.width / 2) * zoom + pan.x;
    const tableCenterY = (table.positionY + tableDim.height / 2) * zoom + pan.y;

    // Check if table is outside viewport
    const isOffscreen =
      tableCenterX < 0 ||
      tableCenterX > canvasRect.width ||
      tableCenterY < 0 ||
      tableCenterY > canvasRect.height;

    if (isOffscreen) {
      // Calculate canvas center
      const canvasCenterX = canvasRect.width / 2;
      const canvasCenterY = canvasRect.height / 2;

      // Calculate direction from canvas center to table
      const dx = tableCenterX - canvasCenterX;
      const dy = tableCenterY - canvasCenterY;

      // Calculate angle
      const angle = Math.atan2(dy, dx);

      // Find intersection with canvas edge
      const absAngle = Math.abs(angle);
      const halfWidth = canvasRect.width / 2;
      const halfHeight = canvasRect.height / 2;

      let intersectX: number;
      let intersectY: number;

      // Determine which edge the line intersects
      if (
        absAngle < Math.atan2(halfHeight, halfWidth) ||
        absAngle > Math.PI - Math.atan2(halfHeight, halfWidth)
      ) {
        // Intersects left or right edge
        if (dx > 0) {
          // Right edge
          intersectX = canvasRect.width;
          intersectY = canvasCenterY + halfWidth * Math.tan(angle);
        } else {
          // Left edge
          intersectX = 0;
          intersectY = canvasCenterY - halfWidth * Math.tan(angle);
        }
      } else {
        // Intersects top or bottom edge
        if (dy > 0) {
          // Bottom edge
          intersectY = canvasRect.height;
          intersectX = canvasCenterX + halfHeight / Math.tan(angle);
        } else {
          // Top edge
          intersectY = 0;
          intersectX = canvasCenterX - halfHeight / Math.tan(angle);
        }
      }

      // Clamp to canvas bounds
      intersectX = Math.max(20, Math.min(canvasRect.width - 20, intersectX));
      intersectY = Math.max(20, Math.min(canvasRect.height - 20, intersectY));

      indicators.push({
        x: intersectX,
        y: intersectY,
        angle: angle * (180 / Math.PI),
        tableName: table.name,
        tableId: table.id,
        tablePosition: { x: table.positionX, y: table.positionY },
        tableDim,
      });
    }
  });

  return indicators;
}

export function calculateNavigationPan(
  indicator: OffscreenIndicator,
  canvasRect: DOMRect,
  zoom: number
): { x: number; y: number } {
  const canvasCenterX = canvasRect.width / 2;
  const canvasCenterY = canvasRect.height / 2;

  // Calculate table center position
  const tableCenterX = indicator.tablePosition.x + indicator.tableDim.width / 2;
  const tableCenterY =
    indicator.tablePosition.y + indicator.tableDim.height / 2;

  // Calculate new pan to center the table
  const newPanX = canvasCenterX - tableCenterX * zoom;
  const newPanY = canvasCenterY - tableCenterY * zoom;

  return { x: newPanX, y: newPanY };
}
