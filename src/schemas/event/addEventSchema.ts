import { stc } from "@/i18n/utils";
import z from "zod";

export const addEventSchema = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.forms.addEventForm.name"),
    validation: z
      .string()
      .nonempty(stc("required"))
      .min(6, stc("minLength", { min: 6 }))
      .max(30, stc("maxLength", { min: 30 })),
  },
];