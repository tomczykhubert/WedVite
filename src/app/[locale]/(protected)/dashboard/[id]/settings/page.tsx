"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AutoFormField, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { useEffect, useState } from "react";
import FormErrorMessage from "@/components/form-error-messege";
import { updateEventConfig } from "@/schemas/event/eventFormConfig";
import { useTRPC } from "@/trpc/client";
import { notFound, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, NotificationSettings } from "@prisma/client";
import Loader from "@/components/loader";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

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

  if (isPending) return <>Ladowanie</>;

  if (!event) return notFound();

  return <EventSettingsForm event={event} />;
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
      respondStart: event.respondStart ?? new Date(),
      respondEnd: event.respondEnd ?? new Date(),
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
        router.refresh()
      },
      onError: (err) => {
        setFormErrorMessage("forms.error");
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false)
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
    <div className="relative">
      <Card className="my-5 max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>
            <h1 className="text-center m-0">{tEvent("settings")}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      <Loader isLoading={isLoading}/>
    </div>
  );
};
