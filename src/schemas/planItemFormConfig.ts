import { availableCountries } from "@/components/ui/country-picker";
import { stc } from "@/i18n/utils";
import { getFieldsByName } from "@/lib/forms/schemaTranslator";
import { zDate, zMaxString, zMinMaxString } from "@/lib/zod/extension";
import z from "zod";

export const planItemConfig = [
  {
    name: "name",
    type: "text",
    required: true,
    label: stc("base.name"),
    validation: zMinMaxString(3, 40).required(),
  },
  {
    name: "description",
    type: "text",
    required: false,
    label: stc("base.description"),
    validation: zMaxString(),
  },
  {
    name: "startAt",
    type: "datetime",
    required: true,
    label: stc("dashboard.forms.planItem.startAt"),
    validation: zDate(),
  },
  {
    name: "endAt",
    type: "datetime",
    required: false,
    label: stc("dashboard.forms.planItem.endAt"),
    validation: zDate().nullish(),
  },
  {
    name: "details",
    type: "text",
    label: stc("dashboard.forms.planItem.details"),
    validation: zMaxString(1500),
  },
  {
    name: "addressLine1",
    type: "text",
    required: true,
    label: stc("base.addressLine1"),
    validation: zMaxString().required(),
  },
  {
    name: "addressLine2",
    type: "text",
    label: stc("base.addressLine2"),
    validation: zMaxString(),
  },
  {
    name: "city",
    type: "text",
    required: true,
    label: stc("base.city"),
    validation: zMaxString().required(),
  },
  {
    name: "postalCode",
    type: "text",
    required: true,
    label: stc("base.postalCode"),
    validation: zMaxString().required(),
  },
  {
    name: "region",
    type: "text",
    label: stc("base.region"),
    validation: zMaxString(),
  },
  {
    name: "country",
    type: "country_select",
    label: stc("base.country"),
    required: false,
    validation: z
      .custom<string>((val) => availableCountries.includes(val), {
        message: stc("invalidCountry"),
      })
      .nullish(),
  },
] as const;

export const basePlanItemConfig = getFieldsByName(
  planItemConfig,
  "name",
  "description",
  "startAt",
  "endAt",
  "details",
  "addressLine1",
  "addressLine2",
  "city",
  "postalCode",
  "region",
  "country"
);
