import { ZodType } from "zod";

export type FieldType = 'text'|'number'|'password'|'email'|'tel'|'textarea'|
                        'datetime'|'date'|'checkbox'|'select'

export type FormFieldConfig = {
  name: string;
  required?: boolean;
  type: FieldType;
  label: string;
  validation: ZodType;
  values?: { value: string, name: string }[]
};

export type FormConfig = FormFieldConfig[]

export const translateSchemaConfig = <T extends FormConfig>(config: T) => {
  type SchemaType = {
    [K in T[number]['name']]: ZodType;
  };

  const result = {} as SchemaType;
  
  for (const item of config) {
    result[item.name as T[number]['name']] = item.validation;
  }
  
  return result;
};


export function getFieldsByName<
  Schema extends readonly FormFieldConfig[],
  N extends Schema[number]["name"]
>(schema: Schema, ...names: N[]): Extract<Schema[number], { name: N }>[] {
  return schema.filter((field) =>
    names.includes(field.name as N)
  ) as any;
}