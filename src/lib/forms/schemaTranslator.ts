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
  | "hidden";

export type FormFieldConfig = {
  name: string;
  required?: boolean;
  type: FieldType;
  label?: string;
  validation: ZodType;
  values?: { value: string; name: string }[];
};

export type FormConfig = readonly FormFieldConfig[];

export const translateSchemaConfig = <T extends readonly FormFieldConfig[]>(
  config: T
) => {
  type SchemaType = {
    [K in T[number] as K["name"]]: K["validation"];
  };

  const result = {} as SchemaType;

  for (const item of config) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result[item.name as keyof SchemaType] = item.validation as any;
  }

  return result;
};

export function getFieldsByName<
  Schema extends readonly FormFieldConfig[],
  N extends Schema[number]["name"],
>(schema: Schema, ...names: N[]): Extract<Schema[number], { name: N }>[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema.filter((field) => names.includes(field.name as N)) as any;
}
