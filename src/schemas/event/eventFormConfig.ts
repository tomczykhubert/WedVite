import { stc } from "@/i18n/utils";
import { getFieldsByName } from "@/lib/forms/schemaTranslator";
import z from "zod";

export const eventConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.forms.event.name"),
    validation: z
      .string()
      .nonempty(stc("required"))
      .min(6, stc("minLength", { min: 6 }))
      .max(30, stc("maxLength", { max: 30 })),
  },
  {
    name: "respondStart",
    type: "date",
    required: true,
    label: stc("dashboard.forms.event.respondStart"),
    validation: z.date()
  },
  {
    name: "respondEnd",
    type: "date",
    required: true,
    label: stc("dashboard.forms.event.respondEnd"),
    validation: z.date()
  },
  {
    name: "onImageUpload",
    type: "checkbox",
    label: stc("dashboard.forms.event.onImageUpload"),
    validation: z.boolean()
  },
  {
    name: "onAttendanceRespond",
    type: "checkbox",
    label: stc("dashboard.forms.event.onAttendanceRespond"),
    validation: z.boolean()
  },
] as const

export const addEventConfig = getFieldsByName(eventConfig, "name")
export const updateEventConfig = getFieldsByName(eventConfig, "name", "onImageUpload", "onAttendanceRespond", "respondEnd", "respondStart")