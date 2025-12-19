import {
  MAX_CAPACITY,
  MAX_GRID_SIZE,
  MAX_ROUND_CAPACITY,
  MIN_CAPACITY,
  MIN_GRID_SIZE,
  isValidRectangularCapacity,
} from "@/components/dashboard/tables/constants";
import { stc } from "@/i18n/utils";
import {
  getFieldsByName,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { getEnumKeys } from "@/lib/utils";
import { zMaxString } from "@/lib/zod/extension";
import { TableShape } from "@prisma/client";
import z from "zod";

export const tableConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.event.tables.tableName"),
    validation: zMaxString().required(),
  },
  {
    name: "shape",
    type: "select",
    required: true,
    label: stc("dashboard.event.tables.shape"),
    validation: z.nativeEnum(TableShape, {
      message: stc("invalidTableShape"),
    }),
    values: getEnumKeys(TableShape).map((key) => ({
      value: key,
      name: stc(`dashboard.event.tables.shapes.${key}`),
    })),
  },
  {
    name: "capacity",
    type: "number",
    required: true,
    label: stc("dashboard.event.tables.capacity"),
    validation: z.coerce.number(),
  },
  {
    name: "rows",
    type: "number",
    required: false,
    label: stc("dashboard.event.tables.rows"),
    validation: z.coerce
      .number()
      .min(MIN_GRID_SIZE)
      .max(MAX_GRID_SIZE)
      .optional(),
  },
  {
    name: "columns",
    type: "number",
    required: false,
    label: stc("dashboard.event.tables.columns"),
    validation: z.coerce
      .number()
      .min(MIN_GRID_SIZE)
      .max(MAX_GRID_SIZE)
      .optional(),
  },
  {
    name: "positionX",
    type: "hidden",
    required: true,
    validation: z.coerce.number(),
  },
  {
    name: "positionY",
    type: "hidden",
    required: true,
    validation: z.coerce.number(),
  },
] as const;

export const addTableConfig = getFieldsByName(
  tableConfig,
  "name",
  "shape",
  "capacity",
  "rows",
  "columns",
  "positionX",
  "positionY"
);

export const addTableSchema = z
  .object(translateSchemaConfig(addTableConfig))
  .refine(
    (data) => {
      if (data.shape === TableShape.RECTANGULAR) {
        return data.rows && data.columns;
      }
      return true;
    },
    {
      message: stc("rectangularTableNeedsDimensions"),
      path: ["rows"],
    }
  )
  .refine(
    (data) => {
      if (data.shape === TableShape.ROUND) {
        return (
          data.capacity >= MIN_CAPACITY && data.capacity <= MAX_ROUND_CAPACITY
        );
      } else if (data.shape === TableShape.RECTANGULAR) {
        return data.capacity >= MIN_CAPACITY && data.capacity <= MAX_CAPACITY;
      }
      return false;
    },
    {
      message: stc("capacityOutOfRange", {
        min: MIN_CAPACITY,
        max: MAX_ROUND_CAPACITY,
      }),
      path: ["capacity"],
    }
  )
  .refine(
    (data) => {
      if (data.shape === TableShape.RECTANGULAR && data.rows && data.columns) {
        return isValidRectangularCapacity(
          data.rows,
          data.columns,
          data.capacity
        );
      }
      return true;
    },
    {
      message: stc("rectangularTableCapacityMismatch"),
      path: ["capacity"],
    }
  );

export type AddTableData = z.infer<typeof addTableSchema>;
