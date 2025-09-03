import { stc } from "@/i18n/utils";
import z from "zod";
const DEFAULT_MAX_STRING_LENGTH = 255;

declare module "zod" {
  interface ZodString {
    required(): ZodString;
  }
}

z.ZodString.prototype.required = function () {
  return this.nonempty(stc("required"));
};

export const zMinMaxString = (
  min: number,
  max: number = DEFAULT_MAX_STRING_LENGTH
) =>
  z
    .string()
    .min(min, stc("minLength", { min }))
    .max(max, stc("maxLength", { max }));

export const zMinString = (min: number) =>
  z.string().min(min, stc("minLength", { min }));

export const zMaxString = (max: number = DEFAULT_MAX_STRING_LENGTH) =>
  z.string().max(max, stc("maxLength", { max }));

export const zDate = () =>
  z.date({
    required_error: stc("required"),
    invalid_type_error: stc("selectValidDate"),
  });
