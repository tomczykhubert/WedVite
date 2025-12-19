import { TableShape } from "@prisma/client";

// Visual constants for table rendering
export const SEAT_SIZE = 40;
export const SEAT_SPACING = 10;
export const TABLE_PADDING = 40;

// Canvas grid size
export const CANVAS_GRID_SIZE = 40;

// Table dimension constants
export const MIN_ROUND_TABLE_DIAMETER = 120;
export const RECTANGULAR_SEAT_WIDTH = 60;
export const RECTANGULAR_BASE_PADDING = 200;

// Calculate total table dimensions including margins
const SEAT_OFFSET = SEAT_SIZE + SEAT_SPACING * 2;

export function calculateRoundTableDiameter(capacity: number): number {
  // Minimum spacing between seats on the perimeter
  const minSeatSpacing = SEAT_SIZE + SEAT_SPACING * 2;
  // Calculate circumference needed
  const circumference = capacity * minSeatSpacing;
  // Calculate diameter from circumference (C = π * d)
  const calculatedDiameter = circumference / Math.PI;
  // Use minimum diameter for small capacities
  return Math.max(MIN_ROUND_TABLE_DIAMETER, calculatedDiameter);
}

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
    | {
        shape: string;
        rows?: number | null;
        columns?: number | null;
        capacity?: number;
      },
  rows?: number | null,
  columns?: number | null,
  capacity?: number
): { width: number; height: number } {
  // Handle object parameter (table entity)
  if (typeof shapeOrTable === "object") {
    const shape = shapeOrTable.shape as TableShape;
    return getTableDimensions(
      shape,
      shapeOrTable.rows,
      shapeOrTable.columns,
      shapeOrTable.capacity
    );
  }

  const shape = shapeOrTable;

  if (shape === TableShape.ROUND) {
    const diameter = calculateRoundTableDiameter(capacity || DEFAULT_CAPACITY);
    const totalSize = diameter + SEAT_OFFSET * 2;
    return {
      width: totalSize,
      height: totalSize,
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
