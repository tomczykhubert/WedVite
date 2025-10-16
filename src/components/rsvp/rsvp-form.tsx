"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AutoFormField, Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { showError } from "@/lib/utils";
import {
  respondRSVPConfig,
  rsvpGuestConfig,
} from "@/schemas/invitationFormConfig";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceStatus, Gender, GuestType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Loader from "../base/loader";
import { getGuestImage } from "../dashboard/guests/guest-row";
import { InvitationWithGuests } from "../dashboard/guests/invitations-context";
import RSVPCard from "./rsvp-card";
import { getAttendanceStatusIcon } from "../dashboard/guests/partials/attendance-status-icon";
import { useEventMenuOptions } from "../dashboard/event/menu/use-event-menu-options";

const formSchema = z.object(translateSchemaConfig(respondRSVPConfig));

type FormData = z.infer<typeof formSchema>;

export default function RSVPForm({
  invitation,
}: {
  invitation: InvitationWithGuests & {
    event: {
      name: string;
    };
  };
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const validationT = useTranslations("formValidation");
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("rsvp");
  const trpc = useTRPC();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: invitation.guests.map((guest) => ({
        id: guest.id,
        name: guest.name,
        gender: guest.gender,
        attendanceStatus: guest.status,
        menuId: guest.menuId,
      })),
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const submitResponse = useMutation(
    trpc.rsvp.submitResponse.mutationOptions({
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: () => {
        showError(validationT, { key: "forms.error" });
        toast.error(t("error"));
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
    })
  );

  const { options: menuOptions, isPending } = useEventMenuOptions(invitation.eventId);
  if (isPending) return <Loader isLoading={isPending}></Loader>;

  const onSubmit = (data: FormData) => {
    submitResponse.mutate({
      invitationId: invitation.id,
      guests: data.guests,
    });
  };
  if (submitted) {
    return <RSVPCard message={t("thankYou")} />;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 relative">
      <Card className="border-b bg-accent/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-lg">
            {invitation.event.name}
          </CardDescription>
          <p className="text-muted-foreground">{t("description")}</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {t("guestDetails")}
                </h3>

                <Tabs
                  defaultValue={invitation.guests[0]?.id}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1 h-auto mb-6 bg-transparent">
                    {invitation.guests.map((guest, index) => {
                      const currentStatus = form.watch(
                        `guests.${index}.attendanceStatus`
                      );
                      const currentGender = form.watch(
                        `guests.${index}.gender`
                      );
                      const currentName = form.watch(`guests.${index}.name`);

                      return (
                        <TabsTrigger
                          key={guest.id}
                          value={guest.id}
                          className="flex items-center justify-between gap-2 p-3 text-sm data-[state=inactive]:bg-gray-100 data-[state=inactive]:hover:bg-background data-[state=inactive]:border-input dark:data-[state=active]:bg-input/50 dark:data-[state=inactive]:bg-input/10 dark:data-[state=inactive]:hover:bg-input/50"

                        >
                          <GuestInfo
                            name={currentName}
                            gender={currentGender}
                            status={currentStatus}
                            type={guest.type}
                            size="small"
                          />
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {invitation.guests.map((guest, index) => {
                    const currentGender = form.watch(`guests.${index}.gender`);
                    const currentName = form.watch(`guests.${index}.name`);
                    const currentStatus = form.watch(`guests.${index}.attendanceStatus`);
                    return (
                      <TabsContent
                        key={guest.id}
                        value={guest.id}
                        className="mt-0"
                      >
                        <Card className="border-accent bg-background dark:bg-muted/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <GuestInfo
                                name={currentName}
                                gender={currentGender}
                                status={currentStatus}
                                type={guest.type}
                              />
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {rsvpGuestConfig.map((fieldConfig) => {
                              // Skip name and gender fields for non-companion guests
                              if (
                                guest.type !== GuestType.COMPANION &&
                                fieldConfig.name === "name"
                              ) {
                                return null;
                              }

                              return (
                                <AutoFormField
                                  key={`${guest.id}-${fieldConfig.name}`}
                                  control={form.control}
                                  fieldConfig={fieldConfig}
                                  name={`guests.${index}.${fieldConfig.name}`}
                                  valuesOverride={
                                    fieldConfig.name === "menuId" ? menuOptions : undefined
                                  }
                                />
                              );
                            })}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? t("loading") : t("submitResponse")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Loader isLoading={loading || !mounted} />
    </div>
  );
}

function GuestInfo({
  name,
  gender,
  status,
  type,
  size = "default",
}: {
  name: string;
  gender: Gender;
  status: AttendanceStatus;
  type: GuestType;
  size?: "small" | "default";
}) {
  const t = useTranslations("dashboard.event.guests");
  const imageSize = size === "small" ? 20 : 32;

  return (
    <>
      <Image
        src={`/images/guests/${getGuestImage(type, gender)}.png`}
        alt={t(`typeAlt.${getGuestImage(type, gender)}`)}
        width={imageSize}
        height={imageSize}
      />
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <span className="truncate">
          {name || t(`guestTypes.${GuestType.COMPANION}`)}
        </span>
        {size === "default" && (
          <span className="text-xs text-muted-foreground">
            {t(`guestTypes.${type}`)}
          </span>
        )}
      </div>
      <div>{getAttendanceStatusIcon(status, size)}</div>
    </>
  );
}