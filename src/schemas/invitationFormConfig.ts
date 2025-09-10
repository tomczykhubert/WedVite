import { stc } from "@/i18n/utils";
import {
  getFieldsByName,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { getEnumKeys } from "@/lib/utils";
import { zMaxString } from "@/lib/zod/extension";
import {
  AttendanceStatus,
  Gender,
  GuestType,
  InvitationStatus,
} from "@prisma/client";
import z from "zod";

export const guestConfig = [
  {
    name: "id",
    type: "hidden",
    validation: z.string().cuid().nonempty(),
  },
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
    label: stc("dashboard.event.guests.type"),
    validation: z.nativeEnum(GuestType, { message: stc("invalidGuestType") }),
    values: getEnumKeys(GuestType).map((key) => ({
      value: key,
      name: stc(`dashboard.event.guests.guestTypes.${key}`),
    })),
  },
  {
    name: "status",
    type: "select",
    required: true,
    label: stc("dashboard.event.guests.attendanceStatus"),
    validation: z.nativeEnum(AttendanceStatus, {
      message: stc("invalidAttendanceStatus"),
    }),
    values: getEnumKeys(AttendanceStatus).map((key) => ({
      value: key,
      name: stc(`dashboard.event.guests.status.${key}`),
    })),
  },
] as const;

export const addGuestConfig = getFieldsByName(
  guestConfig,
  "name",
  "gender",
  "type"
);

export const updateGuestConfig = getFieldsByName(
  guestConfig,
  "name",
  "gender",
  "type",
  "status"
);

const MIN_GUEST = 1;

export const invitationConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.event.invitations.name"),
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
  {
    name: "status",
    type: "select",
    required: true,
    label: stc("dashboard.event.invitations.invitationStatus"),
    validation: z.nativeEnum(InvitationStatus, {
      message: stc("invalidInvitationStatus"),
    }),
    values: getEnumKeys(InvitationStatus).map((key) => ({
      value: key,
      name: stc(`dashboard.event.invitations.status.${key}`),
    })),
  },
] as const;

export const addInvitationConfig = getFieldsByName(
  invitationConfig,
  "name",
  "guests"
);

export const updateInvitationConfig = getFieldsByName(
  invitationConfig,
  "name",
  "status"
);

export const rsvpGuestConfig = getFieldsByName(
  guestConfig,
  "id",
  "name",
  "gender",
  "status"
);

const rsvpConfig = [
  {
    name: "guests",
    type: "custom",
    validation: z.array(z.object(translateSchemaConfig(rsvpGuestConfig))),
  },
] as const;

export const respondRSVPConfig = getFieldsByName(rsvpConfig, "guests");

export const addInvitationSchema = z
  .object(translateSchemaConfig(addInvitationConfig))
  .superRefine((data, ctx) => {
    data.guests.forEach((guest, index) => {
      if (
        guest.type !== GuestType.COMPANION &&
        guest.name.trim().length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: stc("notCompanionGuestNeedName"),
          path: ["guests", index, "name"],
        });
      }
    });
  });

export type AddInvitationData = z.infer<typeof addInvitationSchema>;

export const addGuestSchema = z
  .object(translateSchemaConfig(addGuestConfig))
  .refine(
    (data) => data.name.trim().length > 0 || data.type === GuestType.COMPANION,
    {
      message: stc("notCompanionGuestNeedName"),
      path: ["name"],
    }
  );
export type AddGuestData = z.infer<typeof addGuestSchema>;

export const updateGuestSchema = z
  .object(translateSchemaConfig(updateGuestConfig))
  .refine(
    (data) => data.name.trim().length > 0 || data.type === GuestType.COMPANION,
    {
      message: stc("notCompanionGuestNeedName"),
      path: ["name"],
    }
  );
export type UpdateGuestData = z.infer<typeof updateGuestSchema>;
