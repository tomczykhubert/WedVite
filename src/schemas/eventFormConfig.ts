import { stc } from "@/i18n/utils";
import { getFieldsByName } from "@/lib/forms/schemaTranslator";
import { zDate, zMinMaxString } from "@/lib/zod/extension";
import z from "zod";

export const eventConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("dashboard.forms.event.name"),
    validation: zMinMaxString(6, 30).required(),
  },
  {
    name: "respondStart",
    type: "datetime",
    required: true,
    label: stc("dashboard.forms.event.respondStart"),
    validation: zDate().nullish(),
  },
  {
    name: "respondEnd",
    type: "datetime",
    required: true,
    label: stc("dashboard.forms.event.respondEnd"),
    validation: zDate().nullish(),
  },
  {
    name: "onImageUpload",
    type: "checkbox",
    label: stc("dashboard.forms.event.onImageUpload"),
    validation: z.boolean(),
  },
  {
    name: "onAttendanceRespond",
    type: "checkbox",
    label: stc("dashboard.forms.event.onAttendanceRespond"),
    validation: z.boolean(),
  },
] as const;

export const addEventConfig = getFieldsByName(eventConfig, "name");
export const updateEventConfig = getFieldsByName(
  eventConfig,
  "name",
  "onImageUpload",
  "onAttendanceRespond",
  "respondEnd",
  "respondStart"
);
