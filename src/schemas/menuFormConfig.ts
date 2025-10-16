import { stc } from "@/i18n/utils";
import { getFieldsByName, translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { zColorHex, zMaxString } from "@/lib/zod/extension";
import z from "zod";

export const MAX_MENU = 10;

type SystemMenuItem = {
  name: "MEAT" | "VEGETARIAN" | "VEGAN" | "KIDS";
  color: string;
};

export const SYSTEM_MENUS: readonly SystemMenuItem[] = [
  { name: "MEAT", color: "#E53935" },
  { name: "VEGETARIAN", color: "#43A047" },
  { name: "VEGAN", color: "#8BC34A" },
  { name: "KIDS", color: "#FFB300" },
] as const;

export const eventMenuConfig = [
  {
    name: "id",
    type: "hidden",
    validation: z.string().cuid().nonempty(),
  },
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("base.name"),
    validation: zMaxString(20).required(),
  },
  {
    name: "color",
    type: "color",
    required: true,
    label: stc("base.color"),
    validation: zColorHex().required(),
  },
] as const;

export const baseEventMenuConfig = getFieldsByName(
  eventMenuConfig,
  "name",
  "color",
);

export const baseEventMenuSchema = z.object(
  translateSchemaConfig(baseEventMenuConfig)
);

export type BaseEventMenuData = z.infer<typeof baseEventMenuSchema>;