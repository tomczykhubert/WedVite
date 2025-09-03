import { stc } from "@/i18n/utils";
import { getFieldsByName } from "@/lib/forms/schemaTranslator";
import { getEnumKeys, validatePhoneNumber } from "@/lib/utils";
import { zMaxString } from "@/lib/zod/extension";
import { EventContactType } from "@prisma/client";
import z from "zod";

export const contactConfig = [
  {
    name: "firstName",
    type: "text",
    required: true,
    label: stc("base.firstName"),
    validation: zMaxString().required(),
  },
  {
    name: "lastName",
    type: "text",
    required: true,
    label: stc("base.lastName"),
    validation: zMaxString().required(),
  },
  {
    name: "email",
    type: "email",
    required: true,
    label: stc("base.email"),
    validation: zMaxString()
      .email({ message: stc("email") })
      .required(),
  },
  {
    name: "phoneNumber",
    type: "tel",
    required: true,
    label: stc("base.phoneNumber"),
    validation: z
      .string()
      .required()
      .refine(validatePhoneNumber, { message: stc("invalidPhoneNumber") }),
  },
  {
    name: "contactType",
    type: "select",
    label: stc("dashboard.event.contactType"),
    validation: z
      .nativeEnum(EventContactType, { message: stc("invalidContactType") })
      .nullish(),
    values: getEnumKeys(EventContactType).map((key) => ({
      value: key,
      name: stc(`dashboard.event.${key}`),
    })),
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
