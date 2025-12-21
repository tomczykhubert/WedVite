"use client";

import Loader from "@/components/base/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth/authClient";
import { STORAGE_CONFIG } from "@/lib/storage/config";
import { isValidFileSize } from "@/lib/storage/utils";
import { useTRPC } from "@/trpc/client";
import { createId } from "@paralleldrive/cuid2";
import { Event } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { FileDropzone } from "./file-dropzone";
import { NameInputStep } from "./name-input-step";
import { UploadingFile, UploadProgress } from "./upload-progress";

interface ImageUploadProps {
  event: Event;
  onUploadComplete?: () => void;
}

export function ImageUpload({ event, onUploadComplete }: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [anonymousName, setAnonymousName] = useState<string>("");
  const [showNameInput, setShowNameInput] = useState(true);
  const completedUploadsRef = useRef(0);

  const t = useTranslations("imagesUpload");
  const trpc = useTRPC();
  const { data: session, isPending } = useSession();

  const getUploadUrlMutation = useMutation(
    trpc.image.getUploadUrl.mutationOptions()
  );

  const confirmUploadMutation = useMutation(
    trpc.image.confirmUpload.mutationOptions()
  );

  const handleNameSubmit = (name: string) => {
    setAnonymousName(name);
    setShowNameInput(false);
  };

  const uploadFile = useCallback(
    async (file: File, totalCount: number) => {
      const uploadId = createId();

      try {
        setUploadingFiles((prev) => [
          ...prev,
          { id: uploadId, file, progress: 0 },
        ]);

        // Step 1: Get presigned upload URL (0% -> 10%)
        const { uploadUrl, imageId, metadata } =
          await getUploadUrlMutation.mutateAsync({
            eventId: event.id,
            filename: file.name,
            contentType: file.type,
            size: file.size,
            uploaderName: session?.user.name ?? anonymousName,
          });

        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 10 } : f))
        );

        // Step 2: Upload to storage (10% -> 90%)
        await uploadToStorage(uploadUrl, file, uploadId);

        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 90 } : f))
        );

        // Step 3: Confirm upload and check if it's the last one
        completedUploadsRef.current += 1;
        const isLastUpload = completedUploadsRef.current === totalCount;

        await confirmUploadMutation.mutateAsync({
          imageId,
          eventId: metadata.eventId,
          filename: metadata.filename,
          extension: metadata.extension,
          size: metadata.size,
          uploaderName: metadata.uploaderName,
          skipNotification: !isLastUpload,
          totalCount: totalCount,
        });

        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === uploadId ? { ...f, progress: 100 } : f))
        );

        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
        }, 1000);

        if (isLastUpload) {
          toast.success(t("uploadSuccess", { count: totalCount }));
          onUploadComplete?.();
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId
              ? { ...f, error: t("uploadError", { fileName: file.name }) }
              : f
          )
        );
        toast.error(t("uploadError", { fileName: file.name }));
      }
    },
    [
      event.id,
      getUploadUrlMutation,
      confirmUploadMutation,
      t,
      session,
      anonymousName,
      onUploadComplete,
    ]
  );

  const uploadToStorage = (
    uploadUrl: string,
    file: File,
    uploadId: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            10 + (event.loaded / event.total) * 80
          );
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId ? { ...f, progress: percentComplete } : f
            )
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const handleFilesSelected = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > STORAGE_CONFIG.MAX_FILES_PER_UPLOAD) {
        toast.error(
          t("maxFilesError", {
            maxFiles: STORAGE_CONFIG.MAX_FILES_PER_UPLOAD,
          })
        );
        return;
      }

      const validFiles = acceptedFiles.filter((file) => {
        if (!isValidFileSize(file.size)) {
          toast.error(
            t("fileSizeError", {
              fileName: file.name,
              maxSize: STORAGE_CONFIG.MAX_FILE_SIZE_MB,
            })
          );
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      completedUploadsRef.current = 0;
      validFiles.forEach((file) => uploadFile(file, validFiles.length));
    },
    [uploadFile, t]
  );

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 relative">
      <Card className="border-b bg-accent/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-lg">{event.name}</CardDescription>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!session?.user && showNameInput ? (
            <>
              <NameInputStep onNameSubmit={handleNameSubmit} />
              <Loader isLoading={isPending} />
            </>
          ) : (
            <>
              <FileDropzone onFilesSelected={handleFilesSelected} />
              <UploadProgress
                files={uploadingFiles}
                onRemove={removeUploadingFile}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
