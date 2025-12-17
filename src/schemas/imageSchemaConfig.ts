import { stc } from "@/i18n/utils";
import {
  getFieldsByName,
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { zMinMaxString } from "@/lib/zod/extension";
import z from "zod";

export const imageConfig = [
  {
    name: "imageId",
    type: "hidden",
    validation: z.string().cuid2().nonempty(),
  },
  {
    name: "eventId",
    type: "hidden",
    validation: z.string().cuid().nonempty(),
  },
  {
    name: "filename",
    type: "text",
    required: true,
    label: stc("dashboard.forms.image.filename"),
    validation: z.string(),
  },
  {
    name: "extension",
    type: "text",
    required: true,
    validation: z.string(),
  },
  {
    name: "size",
    type: "number",
    required: true,
    validation: z.number().int().positive(),
  },
  {
    name: "uploaderName",
    type: "text",
    label: stc("dashboard.forms.image.uploaderName"),
    validation: zMinMaxString(2, 50).required(),
  },
  {
    name: "contentType",
    type: "text",
    required: true,
    validation: z.string(),
  },
] as const;

export const uploaderNameConfig = getFieldsByName(imageConfig, "uploaderName");

export const uploaderNameSchema = z.object(
  translateSchemaConfig(uploaderNameConfig)
);

export type UploaderNameData = z.infer<typeof uploaderNameSchema>;

export const renameImageConfig = getFieldsByName(
  imageConfig,
  "imageId",
  "filename"
);

export const renameImageSchema = z.object(
  translateSchemaConfig(renameImageConfig)
);

export type RenameImageData = z.infer<typeof renameImageSchema>;

export const getUploadUrlConfig = getFieldsByName(
  imageConfig,
  "eventId",
  "filename",
  "size",
  "uploaderName",
  "contentType"
);

export const getUploadUrlSchema = z.object(
  translateSchemaConfig(getUploadUrlConfig)
);

export const confirmUploadConfig = getFieldsByName(
  imageConfig,
  "imageId",
  "eventId",
  "filename",
  "extension",
  "size",
  "uploaderName"
);

export const confirmUploadSchema = z.object(
  translateSchemaConfig(confirmUploadConfig)
);
