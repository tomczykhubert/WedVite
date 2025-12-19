import { TableShape } from "@prisma/client";

// Visual constants for table rendering
export const SEAT_SIZE = 40;
export const SEAT_SPACING = 10;
export const TABLE_PADDING = 40;

// Canvas grid size
export const CANVAS_GRID_SIZE = 40;

// Table dimension constants
export const ROUND_TABLE_DIAMETER = 200;
export const RECTANGULAR_SEAT_WIDTH = 60;
export const RECTANGULAR_BASE_PADDING = 200;

// Calculate total table dimensions including margins
const SEAT_OFFSET = SEAT_SIZE + SEAT_SPACING * 2;
export const ROUND_TABLE_TOTAL_SIZE = ROUND_TABLE_DIAMETER + SEAT_OFFSET * 2; // 400

// Capacity constraints
export const MIN_GRID_SIZE = 1;
export const MAX_GRID_SIZE = 10;
export const MIN_CAPACITY = MIN_GRID_SIZE * 4;
export const MAX_ROUND_CAPACITY = MAX_GRID_SIZE * 2;
export const MAX_CAPACITY = MAX_GRID_SIZE * 4;

// Default values
export const DEFAULT_CAPACITY = 8;
export const DEFAULT_ROWS = 2;
export const DEFAULT_COLUMNS = 4;

// Controls constants
export const PAN_SPEED = 20;

export function calculateRectangularSeats(
  rows: number,
  columns: number
): number {
  return 2 * rows + 2 * columns;
}

export function getTableDimensions(
  shapeOrTable:
    | TableShape
    | { shape: string; rows?: number | null; columns?: number | null },
  rows?: number | null,
  columns?: number | null
): { width: number; height: number } {
  // Handle object parameter (table entity)
  if (typeof shapeOrTable === "object") {
    const shape = shapeOrTable.shape as TableShape;
    return getTableDimensions(shape, shapeOrTable.rows, shapeOrTable.columns);
  }

  const shape = shapeOrTable;

  if (shape === TableShape.ROUND) {
    return {
      width: ROUND_TABLE_TOTAL_SIZE,
      height: ROUND_TABLE_TOTAL_SIZE,
    };
  }

  // Rectangular table
  const actualRows = rows || DEFAULT_ROWS;
  const actualColumns = columns || DEFAULT_COLUMNS;

  return {
    width: actualColumns * RECTANGULAR_SEAT_WIDTH + RECTANGULAR_BASE_PADDING,
    height: actualRows * RECTANGULAR_SEAT_WIDTH + RECTANGULAR_BASE_PADDING,
  };
}

export function isValidRectangularCapacity(
  rows: number,
  columns: number,
  capacity: number
): boolean {
  return capacity === calculateRectangularSeats(rows, columns);
}
