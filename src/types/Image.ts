import { EventImage } from "@prisma/client";

export type ImageWithUrl = EventImage & {
  url: string;
};
