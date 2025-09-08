"use client";

import UnsavedChangesModal from "@/components/base/unsaved-changes-modal";
import { Button } from "@/components/ui/button";
import {
  AutoFormField,
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { showError } from "@/lib/utils";
import {
  addGuestConfig,
  addInvitationConfig,
} from "@/schemas/invitationFormConfig";
import { useTRPC } from "@/trpc/client";
import { TRPCResponse } from "@/trpc/routers/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, Gender, Guest, GuestType, Invitation } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { z } from "zod";
import { useInvitations } from "./invitations-context";

const formSchema = z.object(translateSchemaConfig(addInvitationConfig));
type FormData = z.infer<typeof formSchema>;

export default function AddInvitationForm({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const invT = useTranslations("dashboard.event.invitations");
  const t = useTranslations("base");
  const validationT = useTranslations("formValidation");
  const defaultGuestValues = {
    name: "",
    gender: Gender.UNSPECIFIED,
    type: GuestType.ADULT,
  };
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      guests: [defaultGuestValues],
    },
  });
  form.formState.isDirty;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });
  const { resetFilters } = useInvitations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createInvitation = useMutation(
    trpc.invitation.add.mutationOptions({
      onSuccess: async (
        res: TRPCResponse<Invitation & { guests: Guest[] }>
      ) => {
        if (!res.success) {
          return showError(validationT, res.error);
        }
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        resetFilters();
        form.reset();
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
    createInvitation.mutate({
      ...data,
      eventId: event.id,
    });
  };

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
        <SheetTrigger asChild>
          <Button>{invT("add")}</Button>
        </SheetTrigger>
        <SheetContent className="min-w-full sm:min-w-[600px] gap-0">
          <SheetHeader className="bg-muted gap-0 border-b">
            <SheetTitle className="mb-0 font-bold text-2xl">
              {invT("new")}
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
                  {addInvitationConfig.map((fieldConfig) => (
                    <AutoFormField
                      key={fieldConfig.name}
                      control={form.control}
                      fieldConfig={fieldConfig}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name="guests"
                    render={() => (
                      <FormItem>
                        <FormMessage />

                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="border p-3 rounded-lg space-y-3"
                            >
                              {addGuestConfig.map((fieldConfig) => (
                                <AutoFormField
                                  key={fieldConfig.name}
                                  control={form.control}
                                  fieldConfig={fieldConfig}
                                  name={`guests.${index}.${fieldConfig.name}`}
                                />
                              ))}

                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    remove(index);
                                    form.trigger("guests");
                                  }}
                                >
                                  {t("delete")}
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="primaryOutline"
                          onClick={() => {
                            append(defaultGuestValues);
                            form.trigger("guests");
                          }}
                        >
                          <FaPlus /> {invT("addGuest")}
                        </Button>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full justify-self-end"
                  disabled={loading}
                >
                  {loading ? t("loading") : invT("save")}
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
          form.reset();
        }}
        onCancel={() => setShowDialog(false)}
        open={showDialog}
      />
    </>
  );
}
