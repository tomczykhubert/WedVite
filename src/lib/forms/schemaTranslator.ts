import { ZodType } from "zod";

export type FieldType =
  | "text"
  | "number"
  | "password"
  | "email"
  | "tel"
  | "textarea"
  | "datetime"
  | "date"
  | "checkbox"
  | "select"
  | "country_select"
  | "custom"
  | "hidden"
  | "color";

export type FormSelectOption = {
  value: string;
  name: string;
  label?: React.ReactNode;
} | {
  value: string;
  name?: string;
  label: React.ReactNode;
};

export type FormFieldConfig = {
  name: string;
  required?: boolean;
  type: FieldType;
  label?: string;
  validation: ZodType;
  values?: FormSelectOption[];
  needValues?: boolean;
};

export type FormConfig = readonly FormFieldConfig[];

export const translateSchemaConfig = <T extends readonly FormFieldConfig[]>(
  config: T
) => {
  type SchemaType = {
    [K in T[number]as K["name"]]: K["validation"];
  };

  const result = {} as SchemaType;

  for (const item of config) {
    (result as Record<string, ZodType>)[item.name] = item.validation;
  }

  return result;
};

export function getFieldsByName<
  Schema extends readonly FormFieldConfig[],
  N extends Schema[number]["name"],
>(schema: Schema, ...names: N[]): Extract<Schema[number], { name: N }>[] {
  return schema.filter((field) => names.includes(field.name as N)) as Extract<
    Schema[number],
    { name: N }
  >[];
}
