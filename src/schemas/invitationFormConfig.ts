import { stc } from "@/i18n/utils";
import {
  getFieldsByName,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { getEnumKeys } from "@/lib/utils";
import { zMaxString } from "@/lib/zod/extension";
import { Gender, GuestType } from "@prisma/client";
import z from "zod";

export const guestConfig = [
  {
    name: "name",
    type: "text",
    required: false,
    label: stc("base.name"),
    validation: zMaxString(),
  },
  {
    name: "gender",
    type: "select",
    required: true,
    label: stc("base.gender"),
    validation: z.nativeEnum(Gender, { message: stc("invalidGender") }),
    values: getEnumKeys(Gender).map((key) => ({
      value: key,
      name: stc(`base.genderTypes.${key}`),
    })),
  },
  {
    name: "type",
    type: "select",
    required: true,
    label: stc("dashboard.forms.guest.type"),
    validation: z.nativeEnum(GuestType, { message: stc("invalidGuestType") }),
    values: getEnumKeys(GuestType).map((key) => ({
      value: key,
      name: stc(`dashboard.forms.guest.guestTypes.${key}`),
    })),
  },
] as const;

export const addGuestConfig = getFieldsByName(
  guestConfig,
  "name",
  "gender",
  "type"
);

const MIN_GUEST = 1;

export const invitationConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.forms.invitation.name"),
    validation: zMaxString().required(),
  },
  {
    name: "guests",
    type: "custom",
    label: stc("base.name"),
    validation: z
      .array(z.object(translateSchemaConfig(addGuestConfig)))
      .min(MIN_GUEST, stc("minGuest", { min: MIN_GUEST })),
  },
] as const;

export const addInvitationConfig = getFieldsByName(
  invitationConfig,
  "name",
  "guests"
);
