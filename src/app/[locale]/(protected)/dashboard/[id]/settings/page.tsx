"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AutoFormField,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  translateSchemaConfig,
} from "@/lib/forms/schemaTranslator";
import { useEffect, useState } from "react";
import FormErrorMessage from "@/components/form-error-messege";
import { updateEventConfig } from "@/schemas/event/eventFormConfig";
import { useTRPC } from "@/trpc/client";
import { notFound, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, NotificationSettings } from "@prisma/client";
import Loader from "@/components/loader";
import { toast } from "sonner";

const formSchema = z.object(translateSchemaConfig(updateEventConfig));

type UpdateEventSettingsFormData = z.infer<typeof formSchema>;

export default function EventSettings() {
  const { id } = useParams();
  const trpc = useTRPC()
  const { data: event, isPending } = useQuery(trpc.event.getById.queryOptions({ id: id as string, withNotificationSettings: true }))

  if (isPending)
    return <>Ladowanie</>

  if (!event)
    return notFound()
  console.log(event)
  return (
    <EventSettingsForm event={event} />
  );
}

const EventSettingsForm = ({ event }: { event: Event & { notificationSettings: NotificationSettings | null } }) => {
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const t = useTranslations("base");
  const tEvent = useTranslations("dashboard.event");

  const form = useForm<UpdateEventSettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      respondStart: event.respondStart ?? "",
      respondEnd: event.respondEnd ?? "",
      onImageUpload: event.notificationSettings?.onImageUpload ?? false,
      onAttendanceRespond: event.notificationSettings?.onImageUpload ?? false,
    },
  });
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const createPost = useMutation(
      trpc.event.add.mutationOptions({
        onSuccess: async () => {
          form.reset();
          await queryClient.invalidateQueries(trpc.event.pathFilter());
        },
        onError: (err) => {
          toast.error(
            err.data?.code === "UNAUTHORIZED"
              ? "You must be logged in to post"
              : "Failed to create post",
          );
        },
      }),
    );
  const onSubmit = async (data: UpdateEventSettingsFormData) => {
    setFormErrorMessage("");
    console.log(data)
    createPost.mutate(data);
  };

  return (
    <div className="my-5 max-w-[600px] mx-auto">
      <div className="relative">
        <Card className="mx-4">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center m-0">{tEvent("settings")}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormErrorMessage message={formErrorMessage} />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {updateEventConfig.map((fieldConfig) => (
                  <AutoFormField
                    key={fieldConfig.name}
                    control={form.control}
                    fieldConfig={fieldConfig}
                  />
                ))}
                <Button type="submit" className="w-full">
                  {t("forms.save")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* <Loader isLoading={isPending} /> */}
      </div>
    </div>
  );
}