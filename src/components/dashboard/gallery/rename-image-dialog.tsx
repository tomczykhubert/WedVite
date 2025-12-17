"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AutoFormField, Form } from "@/components/ui/form";
import {
  renameImageConfig,
  RenameImageData,
  renameImageSchema,
} from "@/schemas/imageSchemaConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RenameImageDialogProps {
  imageId: string;
  filename: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameImageDialog({
  imageId,
  filename,
  open,
  onOpenChange,
}: RenameImageDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const baseT = useTranslations("base.forms");
  const t = useTranslations("dashboard.event.gallery");

  const form = useForm<RenameImageData>({
    resolver: zodResolver(renameImageSchema),
    defaultValues: {
      imageId,
      filename,
    },
  });

  const renameMutation = useMutation(
    trpc.image.rename.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.image.pathFilter());
        toast.success(t("rename.success"));
        onOpenChange(false);
        form.reset();
      },
      onError: () => {
        toast.error(t("rename.failed"));
      },
    })
  );

  const onSubmit = (data: RenameImageData) => {
    renameMutation.mutate({
      ...data,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rename.header")}</DialogTitle>
          <DialogDescription>{t("rename.message")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renameImageConfig.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={renameMutation.isPending}
              >
                {baseT("cancel")}
              </Button>
              <Button type="submit" disabled={renameMutation.isPending}>
                {baseT("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
