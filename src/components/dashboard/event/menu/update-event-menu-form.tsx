"use client";
import ActionButton from "@/components/base/button-link";
import Loader from "@/components/base/loader";
import { BaseEventMenuData } from "@/schemas/menuFormConfig";
import { useTRPC } from "@/trpc/client";
import { Menu } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import EventMenuForm from "./event-menu-form";

type UpdateEventMenuFormProps = {
  menu: Menu;
};

export default function UpdateEventMenuForm({
  menu,
}: UpdateEventMenuFormProps) {
  const validationT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.forms.menu");
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updateEventMenu = useMutation(
    trpc.eventMenu.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.event.pathFilter());
      },
      onError: () => {
        toast.error(validationT("error"));
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
    updateEventMenu.mutate({
      ...data,
      id: menu.id,
    });
  };

  const initialValues = {
    name: menu.name,
    color: menu.color,
  };

  const trigger = (
    <ActionButton variant="default" size="sm" tooltip={t("update")}>
      <FaEdit />
    </ActionButton>
  );
  return (
    <>
      <Loader isLoading={loading} />
      <EventMenuForm
        title={t("update")}
        initialValues={initialValues}
        trigger={trigger}
        onSubmit={onSubmit}
      ></EventMenuForm>
    </>
  );
}
