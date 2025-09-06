"use client";

import FormErrorMessage from "@/components/base/form-error-messege";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { AutoFormField, Form } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { updateEventConfig } from "@/schemas/eventFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, NotificationSettings } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object(translateSchemaConfig(updateEventConfig));

type UpdateEventSettingsFormData = z.infer<typeof formSchema>;

export default function EventSettings() {
  const { id } = useParams();
  const trpc = useTRPC();
  const { data: event, isPending } = useQuery(
    trpc.event.getById.queryOptions({
      id: id as string,
      withNotificationSettings: true,
    })
  );

  if (isPending) return <Loader isLoading={isPending}></Loader>;

  if (!event) return notFound();

  return (
    <>
      <EventSettingsForm event={event} />
    </>
  );
}

const EventSettingsForm = ({
  event,
}: {
  event: Event & { notificationSettings: NotificationSettings | null };
}) => {
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("base");
  const tEvent = useTranslations("dashboard.event");
  const formT = useTranslations("formValidation.forms");
  const form = useForm<UpdateEventSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      respondStart: event.respondStart,
      respondEnd: event.respondEnd,
      onImageUpload: event.notificationSettings?.onImageUpload ?? false,
      onAttendanceRespond:
        event.notificationSettings?.onAttendanceRespond ?? false,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateEvent = useMutation(
    trpc.event.update.mutationOptions({
      onSuccess: async (response) => {
        await queryClient.invalidateQueries(trpc.event.pathFilter());
        toast.success(formT("success"));
        router.refresh();
      },
      onError: (err) => {
        setFormErrorMessage("forms.error");
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
    })
  );
  const onSubmit = async (data: UpdateEventSettingsFormData) => {
    setFormErrorMessage("");

    updateEvent.mutate({
      ...data,
      id: event.id,
    });
  };

  return (
    <>
      <div className="max-w-[600px]">
        <h1 className="">{tEvent("settings")}</h1>
        <FormErrorMessage message={formErrorMessage} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {updateEventConfig.map((fieldConfig) => (
              <AutoFormField
                key={fieldConfig.name}
                control={form.control}
                fieldConfig={fieldConfig}
              />
            ))}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {t("forms.save")}
            </Button>
          </form>
        </Form>
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
};
