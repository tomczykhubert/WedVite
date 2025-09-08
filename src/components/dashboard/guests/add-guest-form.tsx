"use client";

import UnsavedChangesModal from "@/components/base/unsaved-changes-modal";
import { Button } from "@/components/ui/button";
import { AutoFormField, Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { showError } from "@/lib/utils";
import { addGuestConfig } from "@/schemas/invitationFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, GuestType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object(translateSchemaConfig(addGuestConfig));
type FormData = z.infer<typeof formSchema>;

export default function AddGuestForm({
  invitationId,
  open,
  setOpen,
}: {
  invitationId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("base");
  const gT = useTranslations("dashboard.event.guests");
  const validationT = useTranslations("formValidation");

  const defaultValues = {
    name: "",
    gender: Gender.UNSPECIFIED,
    type: GuestType.ADULT,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const addGuest = useMutation(
    trpc.guest.add.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        setOpen(false);
      },
      onError: (err) => {
        showError(validationT, { key: "forms.error" });
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const onSubmit = (data: FormData) => {
    addGuest.mutate({
      ...data,
      invitationId,
    });
  };

  form.formState.isDirty;
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen && form.formState.isDirty) {
      setShowDialog(true);
      return;
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="min-w-full sm:min-w-[600px] gap-0">
          <SheetHeader className="bg-muted gap-0 border-b">
            <SheetTitle className="mb-0 font-bold text-2xl">
              {gT("add")}
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="overflow-auto p-4 h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col h-full justify-between"
              >
                <div className="space-y-4">
                  {addGuestConfig.map((fieldConfig) => (
                    <AutoFormField
                      key={fieldConfig.name}
                      control={form.control}
                      fieldConfig={fieldConfig}
                    />
                  ))}
                </div>
                <Button
                  type="submit"
                  className="w-full justify-self-end"
                  disabled={loading}
                >
                  {loading ? t("loading") : gT("save")}
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      <UnsavedChangesModal
        onConfirm={() => {
          setShowDialog(false);
          setOpen(false);
          form.reset(defaultValues);
        }}
        onCancel={() => setShowDialog(false)}
        open={showDialog}
      />
    </>
  );
}
