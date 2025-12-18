"use client";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { showError } from "@/lib/utils";
import { BaseEventMenuData } from "@/schemas/menuFormConfig";
import { useTRPC } from "@/trpc/client";
import { TRPCResponse } from "@/trpc/routers/_app";
import ID from "@/types/id";
import { Menu } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import EventMenuForm from "./event-menu-form";

type AddEventMenuFormProps = {
  eventId: ID;
};

export default function AddEventMenuForm({ eventId }: AddEventMenuFormProps) {
  const validationT = useTranslations("formValidation");
  const t = useTranslations("dashboard.forms.menu");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createEventMenu = useMutation(
    trpc.eventMenu.add.mutationOptions({
      onSuccess: async (res: TRPCResponse<Menu>) => {
        if (res.success) {
          await queryClient.invalidateQueries(trpc.event.pathFilter());
          return;
        }
        showError(validationT, res.error);
      },
      onError: () => {
        toast.error(validationT("forms.error"));
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const onSubmit = (data: BaseEventMenuData) => {
    createEventMenu.mutate({
      ...data,
      eventId: eventId,
    });
  };

  const initialValues = {
    name: "",
    color: "#157e2a",
  };

  const trigger = (
    <Button className="w-full" variant={"primaryOutline"}>
      <Plus />
      {t("add")}
    </Button>
  );
  return (
    <>
      <Loader isLoading={loading} />
      <EventMenuForm
        title={t("add")}
        initialValues={initialValues}
        trigger={trigger}
        onSubmit={onSubmit}
      ></EventMenuForm>
    </>
  );
}
