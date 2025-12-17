import {
  assertEventIsAcceptingResponsesByEventId,
  assertOwnerOfEvent,
  assertOwnerOfImage,
} from "@/lib/prisma/eventUtils";
import {
  deleteFile,
  getImageKey,
  getPresignedUploadUrl,
  getPresignedUrl,
} from "@/lib/storage/service";
import {
  getFileExtension,
  getFilenameWithoutExtension,
} from "@/lib/storage/utils";
import {
  confirmUploadSchema,
  getUploadUrlSchema,
  renameImageSchema,
} from "@/schemas/imageSchemaConfig";
import { ImageWithUrl } from "@/types/Image";
import { createId as cuid2 } from "@paralleldrive/cuid2";
import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

const IMAGES_PER_PAGE = 8;

export const imageRouter = createTRPCRouter({
  getEvent: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      const event = await db.event.findUnique({
        where: { id: input.id },
      });

      return event;
    }),

  getUploadUrl: baseProcedure
    .input(getUploadUrlSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      await assertEventIsAcceptingResponsesByEventId(input.eventId, db);

      const tempImageId = cuid2();
      const key = getImageKey(input.eventId, tempImageId);

      const { url } = await getPresignedUploadUrl({
        key,
        contentType: input.contentType,
        expiresIn: 300,
      });

      const extension = getFileExtension(input.filename);
      const filenameWithoutExt = getFilenameWithoutExtension(input.filename);

      return {
        uploadUrl: url,
        key,
        imageId: tempImageId,
        metadata: {
          filename: filenameWithoutExt,
          extension: extension,
          size: input.size,
          uploaderName: input.uploaderName,
          eventId: input.eventId,
        },
      };
    }),

  confirmUpload: baseProcedure
    .input(confirmUploadSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      await assertEventIsAcceptingResponsesByEventId(input.eventId, db);

      const image = await db.eventImage.create({
        data: {
          id: input.imageId,
          filename: input.filename,
          extension: input.extension,
          size: input.size,
          uploaderName: input.uploaderName,
          eventId: input.eventId,
        },
      });

      return { success: true, image };
    }),

  getByEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx: { db, user }, input }) => {
      const { eventId, cursor } = input;
      await assertOwnerOfEvent(user.id, eventId, db);
      const images = await db.eventImage.findMany({
        where: { eventId },
        take: IMAGES_PER_PAGE + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor = undefined;
      if (images.length > IMAGES_PER_PAGE) {
        const nextItem = images.pop();
        nextCursor = nextItem!.id;
      }

      const imagesWithUrls: ImageWithUrl[] = await Promise.all(
        images.map(async (image) => {
          const { url } = await getPresignedUrl({
            key: getImageKey(image.eventId, image.id),
          });

          return {
            ...image,
            url,
          };
        })
      );

      return {
        images: imagesWithUrls,
        nextCursor,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, user }, input }) => {
      const image = await assertOwnerOfImage(user.id, input.id, db);

      await deleteFile(getImageKey(image.eventId, image.id));

      await db.eventImage.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  rename: protectedProcedure
    .input(renameImageSchema)
    .mutation(async ({ ctx: { db, user }, input }) => {
      await assertOwnerOfImage(user.id, input.imageId, db);

      const updatedImage = await db.eventImage.update({
        where: { id: input.imageId },
        data: { filename: input.filename },
      });

      return updatedImage;
    }),
});
