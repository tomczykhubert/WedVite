"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STORAGE_CONFIG } from "@/lib/storage/config";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const t = useTranslations("imagesUpload");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: {
      "image/*": STORAGE_CONFIG.ALLOWED_IMAGE_EXTENSIONS,
    },
    maxFiles: STORAGE_CONFIG.MAX_FILES_PER_UPLOAD,
    maxSize: STORAGE_CONFIG.MAX_FILE_SIZE_BYTES,
    multiple: true,
  });

  return (
    <Card
      {...getRootProps()}
      className={`
        border-2 border-dashed p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/5" : "border-accent hover:border-primary/50"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? t("drop") : t("drag")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("orClickToBrowse", { maxSize: STORAGE_CONFIG.MAX_FILE_SIZE_MB })}
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          {t("chooseFiles")}
        </Button>
      </div>
    </Card>
  );
}
