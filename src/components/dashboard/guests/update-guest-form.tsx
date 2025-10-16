"use client";

import Loader from "@/components/base/loader";
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
import { showError } from "@/lib/utils";
import {
  updateGuestConfig,
  UpdateGuestData,
  updateGuestSchema,
} from "@/schemas/invitationFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Guest, Menu } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoFastFoodSharp } from "react-icons/io5";
import { useEventMenuOptions } from "../event/menu/use-event-menu-options";

export default function UpdateGuestForm({
  guest,
  open,
  setOpen,
}: {
  guest: Guest;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("base");
  const gT = useTranslations("dashboard.event.guests");
  const validationT = useTranslations("formValidation");

  const defaultValues = {
    name: guest.name,
    gender: guest.gender,
    guestType: guest.type,
    attendanceStatus: guest.status,
    menuId: guest.menuId,
  };

  const form = useForm<UpdateGuestData>({
    resolver: zodResolver(updateGuestSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      name: guest.name,
      gender: guest.gender,
      guestType: guest.type,
      attendanceStatus: guest.status,
      menuId: guest.menuId,
    });
  }, [guest, form]);

  const { id: eventId } = useParams();
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const updateGuest = useMutation(
    trpc.guest.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        setOpen(false);
      },
      onError: () => {
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
  const { options: menuOptions, isPending } = useEventMenuOptions(eventId as string);
  if (isPending) return <Loader isLoading={isPending}></Loader>;

  const onSubmit = (data: UpdateGuestData) => {
    updateGuest.mutate({
      ...data,
      id: guest.id,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
              {gT("edit")}
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
                  {updateGuestConfig.map((fieldConfig) => (
                    <AutoFormField
                      key={fieldConfig.name}
                      control={form.control}
                      fieldConfig={fieldConfig}
                      valuesOverride={
                        fieldConfig.name === "menuId" ? menuOptions : undefined
                      }
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
