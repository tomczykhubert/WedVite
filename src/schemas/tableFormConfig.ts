import { stc } from "@/i18n/utils";
import {
  getFieldsByName,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { getEnumKeys } from "@/lib/utils";
import { zMaxString } from "@/lib/zod/extension";
import { TableShape } from "@prisma/client";
import z from "zod";

const MIN_GRID_SIZE = 1;
const MIN_CAPACITY = MIN_GRID_SIZE * 4;

export const MAX_GRID_SIZE = 10;
const MAX_CAPACITY = MAX_GRID_SIZE * 4;
const MAX_ROUND_CAPACITY = MAX_GRID_SIZE * 2;

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
] as const;

export const addTableConfig = getFieldsByName(
  tableConfig,
  "name",
  "shape",
  "capacity",
  "rows",
  "columns"
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
        const expectedCapacity = 2 * data.rows + 2 * data.columns;
        return data.capacity === expectedCapacity;
      }
      return true;
    },
    {
      message: stc("rectangularTableCapacityMismatch"),
      path: ["capacity"],
    }
  );

export type AddTableData = z.infer<typeof addTableSchema>;
