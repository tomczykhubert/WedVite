"use client";

import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { Event } from "@prisma/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import AccessDialog from "./access-dialog";
import { ImageCard, ImageCardSkeleton } from "./image-card";
import { RenameImageDialog } from "./rename-image-dialog";

interface ImageGalleryProps {
  event: Event;
  canDelete?: boolean;
  canRename?: boolean;
}

export function ImageGallery({
  event,
  canDelete = true,
  canRename = true,
}: ImageGalleryProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [accessOpen, setAccessOpen] = useState(false);
  const [renameImage, setRenameImage] = useState<{
    id: string;
    filename: string;
  } | null>(null);
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.gallery");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSuspenseInfiniteQuery(
      trpc.image.getByEvent.infiniteQueryOptions(
        { eventId: event.id },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  const deleteImageMutation = useMutation(
    trpc.image.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.image.pathFilter());
        toast.success(t("delete.success"));
      },
      onError: () => {
        toast.error(t("delete.failed"));
      },
    })
  );

  const handleDelete = (id: string) => {
    deleteImageMutation.mutate({ id });
  };

  const handleDownload = async (
    url: string,
    filename: string,
    extension: string
  ) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(t("download.success"));
    } catch {
      toast.error(t("download.failed"));
    }
  };

  const handleRename = (id: string, filename: string) => {
    setRenameImage({ id, filename });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1>{t("gallery")}</h1>
        <Button onClick={() => setAccessOpen(true)}>{t("access.title")}</Button>
      </div>

      {data?.pages[0].images.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{t("noImagesFound")}</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-8 gap-4">
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    canDelete={canDelete}
                    canRename={canRename}
                    onDownload={handleDownload}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <Loader isLoading={isFetchingNextPage} />
                ) : (
                  baseT("loadMore")
                )}
              </Button>
            </div>
          )}
        </>
      )}

      <AccessDialog
        eventId={event.id}
        open={accessOpen}
        setOpen={(value) => setAccessOpen(value)}
      />

      {renameImage && (
        <RenameImageDialog
          imageId={renameImage.id}
          filename={renameImage.filename}
          open={!!renameImage}
          onOpenChange={(open) => !open && setRenameImage(null)}
        />
      )}
      <Loader isLoading={isLoading} />
    </>
  );
}

export function ImageGallerySkeleton() {
  const skeletonCount = 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-8 gap-4">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <ImageCardSkeleton key={i} />
      ))}
    </div>
  );
}
