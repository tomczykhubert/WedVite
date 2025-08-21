import { ZodTypeAny } from "zod";

export type FormFieldConfig = {
    name: string;
    required?: boolean;
    type: string
    label: string
    validation: ZodTypeAny
}

export type FormConfig = FormFieldConfig[]

export const translateSchemaConfig = (config: FormConfig) => {
  const result: Record<string, any> = {};
  for (const item of config) {
    result[item.name] = item.validation;
  }
  return result;
}


export function getFieldsByName<
  Schema extends readonly FormFieldConfig[],
  N extends Schema[number]["name"]
>(schema: Schema, ...names: N[]): Extract<Schema[number], { name: N }>[] {
  return schema.filter((field) =>
    names.includes(field.name as N)
  ) as any;
}