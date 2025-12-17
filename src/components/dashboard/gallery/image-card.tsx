import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toMB } from "@/lib/storage/utils";
import { cn } from "@/lib/utils";
import { Download, Pencil } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    filename: string;
    extension: string;
    size: number;
    uploaderName: string;
    createdAt: Date;
  };
  canDelete?: boolean;
  canRename?: boolean;
  onDownload: (url: string, filename: string, extension: string) => void;
  onRename: (id: string, filename: string) => void;
  onDelete: (id: string) => void;
}

export function ImageCard({
  image,
  canDelete = false,
  canRename = false,
  onDownload,
  onRename,
  onDelete,
}: ImageCardProps) {
  const t = useTranslations("dashboard.event.gallery");
  const format = useFormatter();

  return (
    <Card className="overflow-hidden group relative">
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={image.url}
          alt={image.filename}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 25vw, 12.5vw"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <ActionButton
            tooltip={t("download.alt")}
            onClick={() =>
              onDownload(image.url, image.filename, image.extension)
            }
          >
            <Download className="h-4 w-4" />
          </ActionButton>

          {canRename && (
            <ActionButton
              tooltip={t("rename.header")}
              variant="secondary"
              onClick={() => onRename(image.id, image.filename)}
            >
              <Pencil className="h-4 w-4" />
            </ActionButton>
          )}

          {canDelete && (
            <ConfirmModal
              onConfirm={() => onDelete(image.id)}
              header={t("delete.header")}
              message={t("delete.message")}
              trigger={
                <ActionButton
                  variant="destructive"
                  tooltip={t("delete.header")}
                >
                  <FaTrash />
                </ActionButton>
              }
            />
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium truncate mb-2">{image.filename}</p>
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Badge variant="neutral" className="uppercase">
            {image.extension}
          </Badge>
          <Badge variant="neutral">{toMB(image.size).toFixed(2)} MB</Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{image.uploaderName}</span>
          <span>
            {format.dateTime(image.createdAt, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function ImageCardSkeleton({ pulse = true }: { pulse?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("aspect-square bg-muted", pulse && "animate-pulse")} />
      <div className="p-3 space-y-2">
        <div
          className={cn("h-4 bg-muted rounded w-3/4", pulse && "animate-pulse")}
        />
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "h-5 w-12 bg-muted rounded",
              pulse && "animate-pulse"
            )}
          />
          <div
            className={cn(
              "h-5 w-16 bg-muted rounded",
              pulse && "animate-pulse"
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "h-3 w-24 bg-muted rounded",
              pulse && "animate-pulse"
            )}
          />
          <div
            className={cn(
              "h-3 w-20 bg-muted rounded",
              pulse && "animate-pulse"
            )}
          />
        </div>
      </div>
    </Card>
  );
}
