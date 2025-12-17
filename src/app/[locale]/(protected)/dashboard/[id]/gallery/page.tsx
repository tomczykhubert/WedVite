import {
  ImageGallery,
  ImageGallerySkeleton,
} from "@/components/dashboard/gallery/image-gallery";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Gallery({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }
  prefetch(trpc.image.getByEvent.infiniteQueryOptions({ eventId: event.id }));
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<ImageGallerySkeleton />}>
          <ImageGallery event={event} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
