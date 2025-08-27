import { stc } from "@/i18n/utils";
import { getFieldsByName } from "@/lib/forms/schemaTranslator";
import { getEnumKeys, validatePhoneNumber } from "@/lib/utils";
import { EventContactType } from "@prisma/client";
import z from "zod";

export const contactConfig = [
  {
    name: "firstName",
    type: "text",
    required: true,
    label: stc("base.firstName"),
    validation: z.string().nonempty(stc("required")),
  },
  {
    name: "lastName",
    type: "text",
    required: true,
    label: stc("base.lastName"),
    validation: z.string().nonempty(stc("required")),
  },
  {
    name: "email",
    type: "email",
    required: true,
    label: stc("base.email"),
    validation: z.string().email({message: stc("email")}).nonempty(stc("required"))
  },
  {
    name: "phoneNumber",
    type: "tel",
    label: stc("base.phoneNumber"),
    validation: z.string().nonempty(stc("required"))
    .refine(validatePhoneNumber, {message: stc("invalidPhoneNumber")}),
  },
  {
    name: "contactType",
    type: "select",
    label: stc("dashboard.event.contactType"),
    validation: z.nativeEnum(EventContactType, {message: stc("invalidContactType")}).optional(),
    values: getEnumKeys(EventContactType).map(key => ({
      value: key,
      name: stc(`dashboard.event.${key}`)
    }))
  },
] as const;

export const baseContactConfig = getFieldsByName(
  contactConfig,
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "contactType"
);
