"use client";
import Loader from "@/components/base/loader";
import { Button } from "@/components/ui/button";
import { BaseEventMenuData } from "@/schemas/menuFormConfig";
import { useTRPC } from "@/trpc/client";
import ID from "@/types/id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import EventMenuForm from "./event-menu-form";
import { TRPCResponse } from "@/trpc/routers/_app";
import { Menu } from "@prisma/client";
import { showError } from "@/lib/utils";

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
    <Button className="w-full" variant={"primaryOutline"}><FaPlus />{t("add")}</Button>
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
